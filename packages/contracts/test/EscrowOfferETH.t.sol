// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/EscrowOfferETH.sol";

contract EscrowOfferETHTest is Test {
    EscrowOfferETH esc;
    address buyer = address(0xBEEF);
    address teacher = address(0xCAFE);
    address rando = address(0xABCD);

    function setUp() public {
        esc = new EscrowOfferETH();
        vm.deal(buyer, 10 ether);
        vm.deal(teacher, 1 ether);
        vm.deal(rando, 1 ether);
    }

    function _createOffer() internal returns (uint256 id) {
        // ✅ Proper declarations
        string[] memory handles = new string[](3);
        handles[0] = "hotyogi.nyc";
        handles[1] = "heatflow.studio";
        handles[2] = "vinyasaqueen";

        EscrowOfferETH.Slot[] memory slots = new EscrowOfferETH.Slot[](3);
        slots[0] = EscrowOfferETH.Slot(uint64(block.timestamp + 1 days), 60, -300);
        slots[1] = EscrowOfferETH.Slot(uint64(block.timestamp + 2 days), 60, -300);
        slots[2] = EscrowOfferETH.Slot(uint64(block.timestamp + 3 days), 60, -300);

        vm.startPrank(buyer);
        id = esc.createOffer{value: 1 ether}(handles, slots, 72 hours, 14 days);
        vm.stopPrank();
    }

    function test_CreateAcceptComplete() public {
        uint256 id = _createOffer();

        vm.prank(teacher);
        esc.acceptOffer(id, 1, "heatflow.studio");

        uint256 balBefore = teacher.balance;
        vm.prank(buyer);
        esc.complete(id);

        assertEq(teacher.balance, balBefore + 1 ether);
    }

    function test_CancelBeforeAccept() public {
        uint256 id = _createOffer();

        vm.prank(buyer);
        esc.cancelBeforeAccept(id);

        EscrowOfferETH.Offer memory ofr = esc.getOffer(id);
        assertEq(uint(ofr.status), uint(EscrowOfferETH.Status.Cancelled));
    }

    function test_AutoReleaseAfterTimeout() public {
        uint256 id = _createOffer();

        vm.prank(teacher);
        esc.acceptOffer(id, 0, "hotyogi.nyc");

        EscrowOfferETH.Slot[] memory slots = esc.getSlots(id);
        uint256 classEnd = uint256(slots[0].start) + uint256(slots[0].durationMin) * 60;
        vm.warp(classEnd + 14 days + 1);

        uint256 balBefore = teacher.balance;
        vm.prank(rando); // anyone can trigger
        esc.autoRelease(id);

        assertEq(teacher.balance, balBefore + 1 ether);
    }
}
