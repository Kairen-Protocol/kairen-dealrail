// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EscrowRail.sol";
import "../src/identity/NullVerifier.sol";
import "../src/identity/SignetIDVerifier.sol";

/**
 * @title Deploy
 * @notice Deployment script for EscrowRail and identity verifiers
 *
 * Usage:
 *   # Deploy to Anvil (local)
 *   forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
 *
 *   # Deploy to Base Sepolia
 *   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 *
 *   # Deploy with specific verifier
 *   VERIFIER_TYPE=signetid forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast
 */
contract Deploy is Script {
    // Base Sepolia addresses
    address constant COURT_ACCESS_BASE_SEPOLIA = 0x251026B235Ab65fBC28674984e43F6AC9cF4d79A;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory verifierType = vm.envOr("VERIFIER_TYPE", string("null"));

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy identity verifier based on type
        address verifierAddress;

        if (keccak256(bytes(verifierType)) == keccak256("signetid")) {
            console.log("Deploying SignetIDVerifier...");
            SignetIDVerifier signetVerifier = new SignetIDVerifier(COURT_ACCESS_BASE_SEPOLIA);
            verifierAddress = address(signetVerifier);
            console.log("SignetIDVerifier deployed at:", verifierAddress);
        } else {
            console.log("Deploying NullVerifier (default)...");
            NullVerifier nullVerifier = new NullVerifier();
            verifierAddress = address(nullVerifier);
            console.log("NullVerifier deployed at:", verifierAddress);
        }

        // 2. Deploy EscrowRail with chosen verifier
        console.log("Deploying EscrowRail...");
        EscrowRail escrow = new EscrowRail(verifierAddress);
        console.log("EscrowRail deployed at:", address(escrow));

        // 3. Log deployment info
        console.log("\n=== Deployment Summary ===");
        console.log("Network:", block.chainid);
        console.log("Deployer:", msg.sender);
        console.log("Identity Verifier:", verifierAddress);
        console.log("EscrowRail:", address(escrow));
        console.log("Next Job ID:", escrow.nextJobId());

        vm.stopBroadcast();

        // 4. Save deployment addresses to file
        string memory deploymentInfo = string(
            abi.encodePacked(
                "{\n",
                '  "network": "',
                vm.toString(block.chainid),
                '",\n',
                '  "deployer": "',
                vm.toString(msg.sender),
                '",\n',
                '  "identityVerifier": "',
                vm.toString(verifierAddress),
                '",\n',
                '  "escrowRail": "',
                vm.toString(address(escrow)),
                '",\n',
                '  "timestamp": ',
                vm.toString(block.timestamp),
                "\n}"
            )
        );

        string memory filename = string(
            abi.encodePacked("deployments/", vm.toString(block.chainid), ".json")
        );

        vm.writeFile(filename, deploymentInfo);
        console.log("\nDeployment info saved to:", filename);
    }
}
