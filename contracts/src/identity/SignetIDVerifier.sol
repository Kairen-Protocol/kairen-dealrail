// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IIdentityVerifier.sol";

/**
 * @title ICourtAccess
 * @notice Interface for SignetID/ForgeID Court Access contract
 * @dev Deployed on Base Sepolia at 0x251026B235Ab65fBC28674984e43F6AC9cF4d79A
 */
interface ICourtAccess {
    function verify(address agent) external view returns (bool valid, uint8 rank, uint256 prestige);
}

/**
 * @title SignetIDVerifier
 * @notice Identity verifier for SignetID/ForgeID (Kairen Protocol)
 * @dev Integrates with ForgeID's CourtAccess contract on Base Sepolia
 *
 * Contract Address (Base Sepolia): 0x251026B235Ab65fBC28674984e43F6AC9cF4d79A
 *
 * Reputation Tiers:
 *   - Rank 0: Squire (0-299 prestige)
 *   - Rank 1: Knight (300-599 prestige)
 *   - Rank 2: Duke (600-899 prestige)
 *   - Rank 3: Sovereign (900-1000 prestige)
 *
 * Prestige Score: 0-1000 (directly maps to reputationScore)
 */
contract SignetIDVerifier is IIdentityVerifier {
    // ============ State Variables ============

    /// @notice CourtAccess contract for verification
    ICourtAccess public immutable courtAccess;

    // ============ Constructor ============

    /**
     * @notice Initialize with CourtAccess contract address
     * @param _courtAccess Address of the CourtAccess contract
     */
    constructor(address _courtAccess) {
        require(_courtAccess != address(0), "SignetIDVerifier: zero address");
        courtAccess = ICourtAccess(_courtAccess);
    }

    // ============ External Functions ============

    /**
     * @notice Verify an address via SignetID
     * @param agent The address to verify
     * @return result VerificationResult with ForgeID data
     */
    function verify(address agent) external view returns (VerificationResult memory result) {
        // Call CourtAccess.verify()
        (bool valid, uint8 rank, uint256 prestige) = courtAccess.verify(agent);

        // Map rank to tier name
        string memory tier;
        if (rank == 0) {
            tier = "Squire";
        } else if (rank == 1) {
            tier = "Knight";
        } else if (rank == 2) {
            tier = "Duke";
        } else if (rank == 3) {
            tier = "Sovereign";
        } else {
            tier = "Unknown"; // Fallback for unexpected ranks
        }

        return
            VerificationResult({
                isVerified: valid,
                reputationScore: prestige, // 0-1000 scale
                tier: tier,
                isSuspended: !valid // If not valid, treat as suspended
            });
    }

    /**
     * @notice Get verifier name
     * @return Verifier implementation name
     */
    function verifierName() external pure returns (string memory) {
        return "SignetID";
    }
}
