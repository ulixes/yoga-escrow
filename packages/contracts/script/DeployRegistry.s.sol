// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/TeacherRegistry.sol";

contract DeployRegistry is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(privateKey);
        vm.startBroadcast(privateKey);

        TeacherRegistry registry = new TeacherRegistry(deployer);
        console2.log("TeacherRegistry deployed at:", address(registry));

        vm.stopBroadcast();
    }
}