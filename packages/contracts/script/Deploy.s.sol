// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/TeacherRegistry.sol";
import "../src/YogaClassEscrow.sol";

contract Deploy is Script {
    function run() external {
        // Load PRIVATE_KEY from env
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(privateKey);
        vm.startBroadcast(privateKey);

        // Deploy TeacherRegistry first with deployer as initial owner
        TeacherRegistry registry = new TeacherRegistry(deployer);
        console2.log("TeacherRegistry deployed at:", address(registry));

        // Deploy YogaClassEscrow with registry address
        YogaClassEscrow escrow = new YogaClassEscrow(address(registry));
        console2.log("YogaClassEscrow deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}
