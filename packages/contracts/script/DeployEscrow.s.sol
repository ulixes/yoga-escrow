// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/YogaClassEscrow.sol";

contract DeployEscrow is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        // Get registry address from environment variable
        address registryAddress = vm.envAddress("TEACHER_REGISTRY_ADDRESS");
        console2.log("Using TeacherRegistry at:", registryAddress);

        YogaClassEscrow escrow = new YogaClassEscrow(registryAddress);
        console2.log("YogaClassEscrow deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}