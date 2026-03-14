// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEIP8183AgenticCommerce
 * @notice Interface for EIP-8183 Agentic Commerce standard
 * @dev Implements the minimal escrow protocol for autonomous agent work execution
 *
 * Specification: https://eips.ethereum.org/EIPS/eip-8183
 *
 * State Machine:
 *   Open ─────> Funded ─────> Submitted ─────> Completed ✓
 *     │            │              │
 *     ├─> Rejected │              │
 *     │            ├─> Rejected   │
 *     │            │              ├─> Rejected
 *     │            │              │
 *     └───────────┴──────────────┴─────────> Expired
 *
 * Roles:
 *   - client: Creates job, funds escrow, can reject in Open state
 *   - provider: Submits work via submit(), receives payment on completion
 *   - evaluator: Trusted address; calls complete() or reject() after submission
 */
interface IEIP8183AgenticCommerce {
    // ============ Enums ============

    enum State {
        Open,       // Job created, budget not yet set
        Funded,     // Budget escrowed, awaiting submission
        Submitted,  // Provider delivered work, awaiting evaluation
        Completed,  // Terminal; payment released
        Rejected,   // Terminal; refund to client
        Expired     // Terminal; refund after timeout
    }

    // ============ Structs ============

    struct Job {
        address client;       // Job creator and funder
        address provider;     // Service provider
        address evaluator;    // Trusted evaluator (can be client)
        uint256 budget;       // Escrowed amount
        uint256 expiry;       // Timestamp after which job can be refunded
        State state;          // Current state
        bytes32 deliverable;  // Hash of submitted work (IPFS CID or other)
        address hook;         // Optional hook contract for custom logic
    }

    // ============ Events ============

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

    // ============ Core Functions ============

    /**
     * @notice Create a new job with specified parties and deadline
     * @param provider Address that will deliver the work
     * @param evaluator Address that will approve/reject submission
     * @param expiry Timestamp after which job can be refunded
     * @param hook Optional hook contract address (address(0) for none)
     * @return jobId The unique identifier for this job
     */
    function createJob(
        address provider,
        address evaluator,
        uint256 expiry,
        address hook
    ) external returns (uint256 jobId);

    /**
     * @notice Fund an existing job with the specified budget
     * @dev Must be called by client, moves state from Open to Funded
     * @param jobId The job identifier
     * @param expectedBudget The amount being escrowed (must match msg.value)
     */
    function fund(uint256 jobId, uint256 expectedBudget) external payable;

    /**
     * @notice Submit work deliverable for evaluation
     * @dev Must be called by provider, moves state from Funded to Submitted
     * @param jobId The job identifier
     * @param deliverable Hash of the submitted work (e.g., IPFS CID)
     */
    function submit(uint256 jobId, bytes32 deliverable) external;

    /**
     * @notice Complete the job and release payment to provider
     * @dev Must be called by evaluator, moves state to Completed
     * @param jobId The job identifier
     * @param reason Optional reason hash for audit trail
     */
    function complete(uint256 jobId, bytes32 reason) external;

    /**
     * @notice Reject the job and refund client
     * @dev Can be called by:
     *      - Client in Open state
     *      - Evaluator in Funded or Submitted state
     * @param jobId The job identifier
     * @param reason Optional reason hash for audit trail
     */
    function reject(uint256 jobId, bytes32 reason) external;

    /**
     * @notice Claim refund after job expiry
     * @dev Permissionless; anyone can trigger refund after expiry
     * @param jobId The job identifier
     */
    function claimRefund(uint256 jobId) external;

    // ============ View Functions ============

    /**
     * @notice Get full job details
     * @param jobId The job identifier
     * @return Job struct with all fields
     */
    function getJob(uint256 jobId) external view returns (Job memory);

    /**
     * @notice Get current job state
     * @param jobId The job identifier
     * @return Current state of the job
     */
    function getState(uint256 jobId) external view returns (State);
}
