// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/YogaClassEscrow.sol";

contract Deploy is Script {
    function run() external {
        // Load PRIVATE_KEY from env
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        YogaClassEscrow escrow = new YogaClassEscrow();
        console2.log("YogaClassEscrow deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}
