// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/YogaClassEscrow.sol";

contract YogaClassEscrowTest is Test {
    YogaClassEscrow public escrow;

    address student = makeAddr("student");
    address teacher = makeAddr("teacher");
    address other = makeAddr("other");

    uint256 constant PAYMENT_AMOUNT = 0.1 ether;
    uint32 constant COMPLETION_WINDOW = 3 days;

    function setUp() public {
        escrow = new YogaClassEscrow();
        vm.deal(student, 10 ether);
        vm.deal(teacher, 1 ether);
    }

    function createSampleBooking() internal returns (uint256) {
        YogaClassEscrow.TimeSlot[] memory slots = new YogaClassEscrow.TimeSlot[](3);
        slots[0] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 2 days),
            durationMinutes: 60,
            timezoneOffset: -300
        });
        slots[1] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 3 days),
            durationMinutes: 90,
            timezoneOffset: -300
        });
        slots[2] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 4 days),
            durationMinutes: 75,
            timezoneOffset: -300
        });

        YogaClassEscrow.YogaType[] memory yogaTypes = new YogaClassEscrow.YogaType[](2);
        yogaTypes[0] = YogaClassEscrow.YogaType.Vinyasa;
        yogaTypes[1] = YogaClassEscrow.YogaType.Hatha;

        vm.prank(student);
        return escrow.createBooking{value: PAYMENT_AMOUNT}(slots, yogaTypes, COMPLETION_WINDOW);
    }

    function test_CreateBooking() public {
        uint256 bookingId = createSampleBooking();

        YogaClassEscrow.ClassBooking memory booking = escrow.getBooking(bookingId);
        assertEq(booking.student, student);
        assertEq(booking.paymentAmount, PAYMENT_AMOUNT);
        assertEq(uint8(booking.status), uint8(YogaClassEscrow.BookingStatus.Pending));
        assertEq(booking.completionWindow, COMPLETION_WINDOW);
    }

    function test_ConfirmBooking() public {
        uint256 bookingId = createSampleBooking();

        vm.prank(teacher);
        escrow.confirmBooking(bookingId, 1);

        YogaClassEscrow.ClassBooking memory booking = escrow.getBooking(bookingId);
        assertEq(booking.teacher, teacher);
        assertEq(booking.selectedSlotIndex, 1);
        assertEq(uint8(booking.status), uint8(YogaClassEscrow.BookingStatus.Confirmed));
    }

    function test_CompleteClass() public {
        uint256 bookingId = createSampleBooking();

        vm.prank(teacher);
        escrow.confirmBooking(bookingId, 0);

        uint256 teacherBalanceBefore = teacher.balance;

        vm.prank(student);
        escrow.completeClass(bookingId);

        assertEq(teacher.balance, teacherBalanceBefore + PAYMENT_AMOUNT);

        YogaClassEscrow.ClassBooking memory booking = escrow.getBooking(bookingId);
        assertEq(uint8(booking.status), uint8(YogaClassEscrow.BookingStatus.Completed));
        assertEq(booking.paymentAmount, 0);
    }

    function test_CancelBooking() public {
        uint256 bookingId = createSampleBooking();

        uint256 studentBalanceBefore = student.balance;

        vm.prank(student);
        escrow.cancelBooking(bookingId);

        assertEq(student.balance, studentBalanceBefore + PAYMENT_AMOUNT);

        YogaClassEscrow.ClassBooking memory booking = escrow.getBooking(bookingId);
        assertEq(uint8(booking.status), uint8(YogaClassEscrow.BookingStatus.Cancelled));
        assertEq(booking.paymentAmount, 0);
    }

    function test_AutomaticPaymentRelease() public {
        uint256 bookingId = createSampleBooking();

        vm.prank(teacher);
        escrow.confirmBooking(bookingId, 0);

        YogaClassEscrow.TimeSlot[] memory slots = escrow.getTimeSlots(bookingId);
        uint256 classEndTime = uint256(slots[0].startTime) + uint256(slots[0].durationMinutes) * 60;

        vm.warp(classEndTime + COMPLETION_WINDOW + 1);

        uint256 teacherBalanceBefore = teacher.balance;

        vm.prank(other);
        escrow.automaticPaymentRelease(bookingId);

        assertEq(teacher.balance, teacherBalanceBefore + PAYMENT_AMOUNT);
    }

    function test_RaiseDispute() public {
        uint256 bookingId = createSampleBooking();

        vm.prank(teacher);
        escrow.confirmBooking(bookingId, 0);

        vm.prank(student);
        escrow.raiseDispute(bookingId);

        YogaClassEscrow.ClassBooking memory booking = escrow.getBooking(bookingId);
        assertEq(uint8(booking.status), uint8(YogaClassEscrow.BookingStatus.Disputed));
    }

    function test_RevertIfNotExactly3TimeSlots() public {
        YogaClassEscrow.TimeSlot[] memory slots = new YogaClassEscrow.TimeSlot[](2);
        slots[0] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 2 days),
            durationMinutes: 60,
            timezoneOffset: -300
        });
        slots[1] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 3 days),
            durationMinutes: 90,
            timezoneOffset: -300
        });

        YogaClassEscrow.YogaType[] memory yogaTypes = new YogaClassEscrow.YogaType[](1);
        yogaTypes[0] = YogaClassEscrow.YogaType.Vinyasa;

        vm.prank(student);
        vm.expectRevert("Exactly 3 time slots required");
        escrow.createBooking{value: PAYMENT_AMOUNT}(slots, yogaTypes, COMPLETION_WINDOW);
    }

    function test_GetYogaTypeName() public view {
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Vinyasa), "Vinyasa");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Yin), "Yin");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Hatha), "Hatha");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Ashtanga), "Ashtanga");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Restorative), "Restorative");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Iyengar), "Iyengar");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Kundalini), "Kundalini");
        assertEq(escrow.getYogaTypeName(YogaClassEscrow.YogaType.Power), "Power");
    }
}
