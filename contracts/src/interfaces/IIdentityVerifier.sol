// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IIdentityVerifier
 * @notice Interface for pluggable identity verification systems
 * @dev Allows DealRail to support multiple identity providers (SignetID, ERC-8004, custom)
 *
 * Implementations:
 *   - SignetIDVerifier: Integrates with ForgeID/SignetID on Base
 *   - ERC8004Verifier: Generic ERC-8004 agent identity registry
 *   - NullVerifier: No verification (development/testing)
 */
interface IIdentityVerifier {
    // ============ Structs ============

    /**
     * @notice Result of identity verification
     * @param isVerified Whether the address has a valid identity
     * @param reputationScore Numerical reputation (0-1000 scale)
     * @param tier Human-readable tier/rank (e.g., "Knight", "Verified")
     * @param isSuspended Whether the identity is currently suspended/banned
     */
    struct VerificationResult {
        bool isVerified;
        uint256 reputationScore;
        string tier;
        bool isSuspended;
    }

    // ============ Core Functions ============

    /**
     * @notice Verify an address and return reputation data
     * @param agent The address to verify
     * @return Result struct with verification status and reputation
     */
    function verify(address agent) external view returns (VerificationResult memory);

    /**
     * @notice Get the name of this verifier implementation
     * @return Human-readable verifier name (e.g., "SignetID", "ERC-8004")
     */
    function verifierName() external pure returns (string memory);
}
