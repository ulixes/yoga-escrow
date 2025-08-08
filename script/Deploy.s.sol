// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/EscrowOfferETH.sol";

contract Deploy is Script {
    function run() external {
        // Load PRIVATE_KEY from env
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        EscrowOfferETH esc = new EscrowOfferETH();
        console2.log("EscrowOfferETH:", address(esc));

        vm.stopBroadcast();
    }
}
