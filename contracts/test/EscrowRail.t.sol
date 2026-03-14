// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EscrowRail.sol";
import "../src/identity/NullVerifier.sol";
import "../src/identity/SignetIDVerifier.sol";

contract EscrowRailTest is Test {
    EscrowRail public escrow;
    NullVerifier public nullVerifier;

    address client = address(0x1);
    address provider = address(0x2);
    address evaluator = address(0x3);

    uint256 constant BUDGET = 1 ether;
    uint256 expiry;

    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        address indexed provider,
        address evaluator,
        uint256 expiry,
        address hook
    );
    event JobFunded(uint256 indexed jobId, uint256 amount);
    event JobSubmitted(uint256 indexed jobId, bytes32 deliverable);
    event JobCompleted(uint256 indexed jobId, bytes32 reason);
    event JobRejected(uint256 indexed jobId, bytes32 reason);
    event JobExpired(uint256 indexed jobId);

    function setUp() public {
        // Deploy verifier and escrow
        nullVerifier = new NullVerifier();
        escrow = new EscrowRail(address(nullVerifier));

        // Set expiry to 1 day from now
        expiry = block.timestamp + 1 days;

        // Fund test accounts
        vm.deal(client, 10 ether);
        vm.deal(provider, 1 ether);
    }

    // ============ Happy Path Tests ============

    function test_CreateJob() public {
        vm.startPrank(client);

        vm.expectEmit(true, true, true, true);
        emit JobCreated(1, client, provider, evaluator, expiry, address(0));

        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        assertEq(jobId, 1, "Job ID should be 1");

        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(job.client, client);
        assertEq(job.provider, provider);
        assertEq(job.evaluator, evaluator);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Open));

        vm.stopPrank();
    }

    function test_FundJob() public {
        vm.startPrank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.expectEmit(true, false, false, true);
        emit JobFunded(jobId, BUDGET);

        escrow.fund{value: BUDGET}(jobId, BUDGET);

        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(job.budget, BUDGET);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Funded));

        vm.stopPrank();
    }

    function test_SubmitWork() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        bytes32 deliverable = keccak256("ipfs://Qm...");

        vm.startPrank(provider);
        vm.expectEmit(true, false, false, true);
        emit JobSubmitted(jobId, deliverable);

        escrow.submit(jobId, deliverable);

        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(job.deliverable, deliverable);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Submitted));

        vm.stopPrank();
    }

    function test_CompleteJob() public {
        // Setup: Create, fund, and submit
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        vm.prank(provider);
        escrow.submit(jobId, keccak256("deliverable"));

        // Complete the job
        uint256 providerBalanceBefore = provider.balance;
        bytes32 reason = keccak256("approved");

        vm.startPrank(evaluator);
        vm.expectEmit(true, false, false, true);
        emit JobCompleted(jobId, reason);

        escrow.complete(jobId, reason);

        // Check state and payment
        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Completed));
        assertEq(provider.balance, providerBalanceBefore + BUDGET, "Provider should receive payment");

        vm.stopPrank();
    }

    function test_RejectJobInFundedState() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        uint256 clientBalanceBefore = client.balance;
        bytes32 reason = keccak256("rejected");

        vm.startPrank(evaluator);
        vm.expectEmit(true, false, false, true);
        emit JobRejected(jobId, reason);

        escrow.reject(jobId, reason);

        // Check refund
        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Rejected));
        assertEq(client.balance, clientBalanceBefore + BUDGET, "Client should get refund");

        vm.stopPrank();
    }

    function test_ClaimRefundAfterExpiry() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        // Fast forward past expiry
        vm.warp(expiry + 1);

        uint256 clientBalanceBefore = client.balance;

        vm.expectEmit(true, false, false, true);
        emit JobExpired(jobId);

        // Anyone can call claimRefund
        escrow.claimRefund(jobId);

        IEIP8183AgenticCommerce.Job memory job = escrow.getJob(jobId);
        assertEq(uint256(job.state), uint256(IEIP8183AgenticCommerce.State.Expired));
        assertEq(client.balance, clientBalanceBefore + BUDGET, "Client should get refund");
    }

    // ============ Access Control Tests ============

    function test_RevertIf_WrongClientFunds() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(provider);
        vm.expectRevert("EscrowRail: only client can fund");
        escrow.fund{value: BUDGET}(jobId, BUDGET);
    }

    function test_RevertIf_WrongProviderSubmits() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        vm.prank(client);
        vm.expectRevert("EscrowRail: only provider can submit");
        escrow.submit(jobId, keccak256("fake"));
    }

    function test_RevertIf_WrongEvaluatorCompletes() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        vm.prank(provider);
        escrow.submit(jobId, keccak256("deliverable"));

        vm.prank(client);
        vm.expectRevert("EscrowRail: only evaluator can complete");
        escrow.complete(jobId, bytes32(0));
    }

    // ============ State Transition Tests ============

    function test_RevertIf_FundingNonOpenJob() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        // Try to fund again
        vm.prank(client);
        vm.expectRevert("EscrowRail: job not open");
        escrow.fund{value: BUDGET}(jobId, BUDGET);
    }

    function test_RevertIf_SubmitToNonFundedJob() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(provider);
        vm.expectRevert("EscrowRail: job not funded");
        escrow.submit(jobId, keccak256("deliverable"));
    }

    function test_RevertIf_CompleteNonSubmittedJob() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        vm.prank(evaluator);
        vm.expectRevert("EscrowRail: job not submitted");
        escrow.complete(jobId, bytes32(0));
    }

    function test_RevertIf_RefundBeforeExpiry() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));

        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);

        vm.expectRevert("EscrowRail: not expired yet");
        escrow.claimRefund(jobId);
    }

    // ============ Admin Tests ============

    function test_SetIdentityVerifier() public {
        NullVerifier newVerifier = new NullVerifier();

        escrow.setIdentityVerifier(address(newVerifier));

        assertEq(address(escrow.identityVerifier()), address(newVerifier));
    }

    function test_SetMinimumReputation() public {
        escrow.setMinimumReputation(500);
        assertEq(escrow.minimumReputation(), 500);
    }

    function test_RevertIf_NonOwnerSetsVerifier() public {
        NullVerifier newVerifier = new NullVerifier();

        vm.prank(client);
        vm.expectRevert();
        escrow.setIdentityVerifier(address(newVerifier));
    }

    // ============ Full Flow Integration Test ============

    function test_FullHappyPathFlow() public {
        // 1. Client creates job
        vm.prank(client);
        uint256 jobId = escrow.createJob(provider, evaluator, expiry, address(0));
        assertEq(uint256(escrow.getState(jobId)), uint256(IEIP8183AgenticCommerce.State.Open));

        // 2. Client funds job
        vm.prank(client);
        escrow.fund{value: BUDGET}(jobId, BUDGET);
        assertEq(uint256(escrow.getState(jobId)), uint256(IEIP8183AgenticCommerce.State.Funded));

        // 3. Provider submits work
        bytes32 deliverable = keccak256("ipfs://QmXYZ123");
        vm.prank(provider);
        escrow.submit(jobId, deliverable);
        assertEq(uint256(escrow.getState(jobId)), uint256(IEIP8183AgenticCommerce.State.Submitted));

        // 4. Evaluator approves and releases payment
        uint256 providerBalanceBefore = provider.balance;
        vm.prank(evaluator);
        escrow.complete(jobId, keccak256("approved"));
        assertEq(uint256(escrow.getState(jobId)), uint256(IEIP8183AgenticCommerce.State.Completed));
        assertEq(provider.balance, providerBalanceBefore + BUDGET);
    }
}
