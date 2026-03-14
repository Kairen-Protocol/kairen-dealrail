// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IEIP8183AgenticCommerce.sol";
import "./interfaces/IIdentityVerifier.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EscrowRail
 * @notice EIP-8183 compliant agentic commerce escrow contract
 * @dev Implements trustless job execution with optional identity verification
 *
 * Key Features:
 *   - EIP-8183 state machine (Open → Funded → Submitted → Completed)
 *   - Pluggable identity verification (SignetID, ERC-8004, or none)
 *   - ReentrancyGuard for all fund-moving functions
 *   - Deadline enforcement with permissionless refund
 *   - Optional hook system for extensibility
 *
 * Security Model:
 *   - CEI (Checks-Effects-Interactions) pattern
 *   - ReentrancyGuard on fund(), complete(), reject(), claimRefund()
 *   - Explicit state checks before all transitions
 *   - No unlimited approvals or external calls in loops
 */
contract EscrowRail is IEIP8183AgenticCommerce, ReentrancyGuard, Ownable {
    // ============ State Variables ============

    /// @notice Mapping from job ID to Job struct
    mapping(uint256 => Job) private _jobs;

    /// @notice Next job ID (auto-incrementing)
    uint256 public nextJobId;

    /// @notice Optional identity verifier contract
    IIdentityVerifier public identityVerifier;

    /// @notice Minimum reputation score required for providers (0 = disabled)
    uint256 public minimumReputation;

    // ============ Events ============

    event IdentityVerifierUpdated(address indexed newVerifier);
    event MinimumReputationUpdated(uint256 newMinimum);

    // ============ Constructor ============

    /**
     * @notice Initialize with optional identity verifier
     * @param _identityVerifier Address of identity verifier (address(0) for none)
     */
    constructor(address _identityVerifier) Ownable(msg.sender) {
        identityVerifier = IIdentityVerifier(_identityVerifier);
        nextJobId = 1; // Start job IDs at 1
    }

    // ============ Core EIP-8183 Functions ============

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function createJob(
        address provider,
        address evaluator,
        uint256 expiry,
        address hook
    ) external returns (uint256 jobId) {
        require(provider != address(0), "EscrowRail: zero provider");
        require(evaluator != address(0), "EscrowRail: zero evaluator");
        require(expiry > block.timestamp, "EscrowRail: expiry must be in future");

        // Optional: Verify provider identity
        if (address(identityVerifier) != address(0)) {
            IIdentityVerifier.VerificationResult memory result = identityVerifier.verify(provider);

            require(!result.isSuspended, "EscrowRail: provider is suspended");

            // Optional: Enforce minimum reputation
            if (minimumReputation > 0) {
                require(
                    result.reputationScore >= minimumReputation,
                    "EscrowRail: insufficient reputation"
                );
            }
        }

        jobId = nextJobId++;

        _jobs[jobId] = Job({
            client: msg.sender,
            provider: provider,
            evaluator: evaluator,
            budget: 0,
            expiry: expiry,
            state: State.Open,
            deliverable: bytes32(0),
            hook: hook
        });

        emit JobCreated(jobId, msg.sender, provider, evaluator, expiry, hook);
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function fund(uint256 jobId, uint256 expectedBudget) external payable nonReentrant {
        Job storage job = _jobs[jobId];

        require(job.state == State.Open, "EscrowRail: job not open");
        require(msg.sender == job.client, "EscrowRail: only client can fund");
        require(msg.value > 0, "EscrowRail: budget must be > 0");
        require(msg.value == expectedBudget, "EscrowRail: budget mismatch");

        job.budget = msg.value;
        job.state = State.Funded;

        emit JobFunded(jobId, msg.value);
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function submit(uint256 jobId, bytes32 deliverable) external {
        Job storage job = _jobs[jobId];

        require(job.state == State.Funded, "EscrowRail: job not funded");
        require(msg.sender == job.provider, "EscrowRail: only provider can submit");
        require(deliverable != bytes32(0), "EscrowRail: empty deliverable");

        job.deliverable = deliverable;
        job.state = State.Submitted;

        emit JobSubmitted(jobId, deliverable);
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function complete(uint256 jobId, bytes32 reason) external nonReentrant {
        Job storage job = _jobs[jobId];

        require(job.state == State.Submitted, "EscrowRail: job not submitted");
        require(msg.sender == job.evaluator, "EscrowRail: only evaluator can complete");

        job.state = State.Completed;

        // Release payment to provider
        (bool success,) = job.provider.call{value: job.budget}("");
        require(success, "EscrowRail: payment failed");

        emit JobCompleted(jobId, reason);
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function reject(uint256 jobId, bytes32 reason) external nonReentrant {
        Job storage job = _jobs[jobId];

        // Determine who can reject based on state
        if (job.state == State.Open) {
            require(msg.sender == job.client, "EscrowRail: only client can reject open job");
        } else if (job.state == State.Funded || job.state == State.Submitted) {
            require(msg.sender == job.evaluator, "EscrowRail: only evaluator can reject");
        } else {
            revert("EscrowRail: cannot reject in this state");
        }

        job.state = State.Rejected;

        // Refund to client if funded
        if (job.budget > 0) {
            (bool success,) = job.client.call{value: job.budget}("");
            require(success, "EscrowRail: refund failed");
        }

        emit JobRejected(jobId, reason);
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function claimRefund(uint256 jobId) external nonReentrant {
        Job storage job = _jobs[jobId];

        require(block.timestamp > job.expiry, "EscrowRail: not expired yet");
        require(
            job.state == State.Open || job.state == State.Funded || job.state == State.Submitted,
            "EscrowRail: invalid state for refund"
        );

        job.state = State.Expired;

        // Refund to client if funded
        if (job.budget > 0) {
            (bool success,) = job.client.call{value: job.budget}("");
            require(success, "EscrowRail: refund failed");
        }

        emit JobExpired(jobId);
    }

    // ============ View Functions ============

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function getJob(uint256 jobId) external view returns (Job memory) {
        return _jobs[jobId];
    }

    /**
     * @inheritdoc IEIP8183AgenticCommerce
     */
    function getState(uint256 jobId) external view returns (State) {
        return _jobs[jobId].state;
    }

    // ============ Admin Functions ============

    /**
     * @notice Set a new identity verifier contract
     * @param _newVerifier Address of new verifier (address(0) to disable)
     */
    function setIdentityVerifier(address _newVerifier) external onlyOwner {
        identityVerifier = IIdentityVerifier(_newVerifier);
        emit IdentityVerifierUpdated(_newVerifier);
    }

    /**
     * @notice Set minimum reputation score for providers
     * @param _minimumReputation Minimum score (0 to disable check)
     */
    function setMinimumReputation(uint256 _minimumReputation) external onlyOwner {
        minimumReputation = _minimumReputation;
        emit MinimumReputationUpdated(_minimumReputation);
    }
}
