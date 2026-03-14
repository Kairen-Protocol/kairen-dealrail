// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IIdentityVerifier.sol";

/**
 * @title NullVerifier
 * @notice Default identity verifier that passes all addresses
 * @dev Used for development, testing, or when identity verification is not required
 *
 * Behavior:
 *   - All addresses are marked as verified
 *   - Default reputation score: 500 (neutral)
 *   - Tier: "Unverified"
 *   - Never suspended
 */
contract NullVerifier is IIdentityVerifier {
    /**
     * @notice Verify an address (always passes)
     * @param agent The address to verify (unused)
     * @return result VerificationResult with default values
     */
    function verify(address agent) external pure returns (VerificationResult memory result) {
        // Silence unused variable warning
        agent;

        return
            VerificationResult({
                isVerified: true, // Always pass
                reputationScore: 500, // Neutral score
                tier: "Unverified",
                isSuspended: false
            });
    }

    /**
     * @notice Get verifier name
     * @return Verifier implementation name
     */
    function verifierName() external pure returns (string memory) {
        return "NullVerifier";
    }
}
