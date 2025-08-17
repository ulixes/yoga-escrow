// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/YogaClassEscrow.sol";

contract YogaClassEscrowTest is Test {
    YogaClassEscrow public escrow;

    address student = makeAddr("student");
    address teacher1 = makeAddr("teacher1");
    address teacher2 = makeAddr("teacher2");
    address teacher3 = makeAddr("teacher3");
    address other = makeAddr("other");

    uint256 constant ESCROW_AMOUNT = 0.1 ether;

    string constant HANDLE_1 = "@yogamaster";
    string constant HANDLE_2 = "@zenteacher";
    string constant HANDLE_3 = "@vinyasapro";

    string constant STUDENT_EMAIL = "student@example.com";
    string constant LOCATION = "Vake Park, Tbilisi";
    string constant DESCRIPTION = "Private yoga class booking";

    function setUp() public {
        escrow = new YogaClassEscrow();
        vm.deal(student, 10 ether);
        vm.deal(teacher1, 1 ether);
        vm.deal(teacher2, 1 ether);
        vm.deal(teacher3, 1 ether);
        vm.deal(other, 1 ether);
    }

    function createSampleEscrow() internal returns (uint256) {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = HANDLE_2;
        teacherHandles[2] = HANDLE_3;

        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        return escrow.createEscrow{value: ESCROW_AMOUNT}(
            teacherHandles, timeSlots, LOCATION, DESCRIPTION, STUDENT_EMAIL, student
        );
    }

    function test_CreateEscrow() public {
        uint256 escrowId = createSampleEscrow();

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(escrowData.student, student);
        assertEq(escrowData.amount, ESCROW_AMOUNT);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Pending));
        assertEq(escrowData.description, DESCRIPTION);
        assertEq(escrowData.location, LOCATION);
        assertEq(escrowData.studentEmail, STUDENT_EMAIL);
        assertEq(escrowData.teacher, address(0)); // Not assigned yet
        assertEq(escrowData.selectedTimeIndex, 255); // NOT_SELECTED

        // Check teacher handles
        string[] memory teacherHandles = escrow.getTeacherHandles(escrowId);
        assertEq(teacherHandles[0], HANDLE_1);
        assertEq(teacherHandles[1], HANDLE_2);
        assertEq(teacherHandles[2], HANDLE_3);

        // Check time slots
        uint64[3] memory timeSlots = escrow.getTimeSlots(escrowId);
        assertEq(timeSlots[0], uint64(block.timestamp + 2 days));
        assertEq(timeSlots[1], uint64(block.timestamp + 3 days));
        assertEq(timeSlots[2], uint64(block.timestamp + 4 days));
    }

    function test_AcceptClass() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher2);
        escrow.acceptClass(escrowId, HANDLE_2, 1); // Teacher2 accepts with their handle, time slot 1

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(escrowData.teacher, teacher2);
        assertEq(escrowData.selectedHandle, HANDLE_2);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        assertEq(escrowData.selectedTimeIndex, 1);
        assertEq(escrowData.classTime, uint64(block.timestamp + 3 days)); // timeSlots[1]
    }

    function test_ReleasePayment() public {
        uint256 escrowId = createSampleEscrow();

        // Teacher accepts the class
        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0); // Teacher1 accepts time slot 0

        uint256 teacher1BalanceBefore = teacher1.balance;

        // Student releases payment after class
        vm.prank(student);
        escrow.releasePayment(escrowId);

        assertEq(teacher1.balance, teacher1BalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Delivered));
        assertEq(escrowData.amount, ESCROW_AMOUNT); // Amount kept for history
    }

    function test_CancelClass() public {
        uint256 escrowId = createSampleEscrow();

        uint256 studentBalanceBefore = student.balance;

        vm.prank(student);
        escrow.cancelClass(escrowId);

        assertEq(student.balance, studentBalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Cancelled));
        assertEq(escrowData.amount, ESCROW_AMOUNT); // Amount kept for history
    }

    function test_TeacherRelease() public {
        uint256 escrowId = createSampleEscrow();

        // Teacher accepts the class
        vm.prank(teacher3);
        escrow.acceptClass(escrowId, HANDLE_3, 1); // Time slot 1 (3 days from now)

        // Fast forward past class time + 24 hour grace period
        uint64 classTime = uint64(block.timestamp + 3 days);
        uint64 teacherReleaseTime = classTime + (24 * 3600); // 24 hours after class
        vm.warp(teacherReleaseTime + 1);

        uint256 teacher3BalanceBefore = teacher3.balance;

        // Teacher can release funds after 24hrs
        vm.prank(teacher3);
        escrow.teacherRelease(escrowId);

        assertEq(teacher3.balance, teacher3BalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Delivered));
    }

    function test_CanTeacherRelease() public {
        uint256 escrowId = createSampleEscrow();

        // Initially cannot release
        assertFalse(escrow.canTeacherRelease(escrowId));

        // Teacher accepts
        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        // Still cannot release immediately after class time
        vm.warp(block.timestamp + 2 days + 1);
        assertFalse(escrow.canTeacherRelease(escrowId));

        // Can release 24hrs after class time
        vm.warp(block.timestamp + 2 days + 24 hours + 1);
        assertTrue(escrow.canTeacherRelease(escrowId));
    }

    // Error condition tests
    function test_RevertCreateEscrowWithZeroValue() public {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = HANDLE_2;
        teacherHandles[2] = HANDLE_3;
        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        vm.expectRevert(YogaClassEscrow.ZeroAmount.selector);
        escrow.createEscrow{value: 0}(teacherHandles, timeSlots, LOCATION, DESCRIPTION, STUDENT_EMAIL, student);
    }

    function test_RevertCreateEscrowWithDuplicateHandles() public {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = HANDLE_1; // Duplicate HANDLE_1
        teacherHandles[2] = HANDLE_3;
        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        vm.expectRevert(YogaClassEscrow.DuplicateHandle.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(
            teacherHandles, timeSlots, LOCATION, DESCRIPTION, STUDENT_EMAIL, student
        );
    }

    function test_RevertCreateEscrowWithEmptyHandle() public {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = ""; // Empty string
        teacherHandles[2] = HANDLE_3;
        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        vm.expectRevert(YogaClassEscrow.EmptyHandle.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(
            teacherHandles, timeSlots, LOCATION, DESCRIPTION, STUDENT_EMAIL, student
        );
    }

    function test_RevertAcceptClassHandleMismatch() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        vm.expectRevert(YogaClassEscrow.HandleMismatch.selector);
        escrow.acceptClass(escrowId, "@wronghandle", 0); // Wrong handle
    }

    function test_RevertAcceptClassInvalidTimeIndex() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        vm.expectRevert(YogaClassEscrow.InvalidTimeIndex.selector);
        escrow.acceptClass(escrowId, HANDLE_1, 3); // Index 3 is invalid
    }

    function test_RevertAcceptClassStudentAsTeacher() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(student);
        vm.expectRevert("Student cannot be teacher");
        escrow.acceptClass(escrowId, HANDLE_1, 0);
    }

    function test_RevertReleasePaymentNotStudent() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.NotStudent.selector);
        escrow.releasePayment(escrowId);
    }

    function test_CancelClassAfterAccepted() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        // Student should be able to cancel even after acceptance (full protection)
        uint256 studentBalanceBefore = student.balance;

        vm.prank(student);
        escrow.cancelClass(escrowId);

        // Verify refund
        assertEq(student.balance, studentBalanceBefore + ESCROW_AMOUNT);

        // Verify escrow status
        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Cancelled));
        assertEq(escrowData.amount, ESCROW_AMOUNT); // Amount kept for history
    }

    function test_RevertCancelClassAfterDelivered() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        vm.prank(student);
        escrow.releasePayment(escrowId);

        // Should not be able to cancel after delivery
        vm.prank(student);
        vm.expectRevert("Cannot cancel delivered/cancelled class");
        escrow.cancelClass(escrowId);
    }

    function test_RevertTeacherReleaseTooEarly() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        // Try to release immediately after accepting
        vm.prank(teacher1);
        vm.expectRevert(YogaClassEscrow.TooEarlyToRelease.selector);
        escrow.teacherRelease(escrowId);
    }

    function test_RevertTeacherReleaseNotTeacher() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);

        // Fast forward 24hrs
        vm.warp(block.timestamp + 2 days + 24 hours + 1);

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.NotTeacher.selector);
        escrow.teacherRelease(escrowId);
    }

    function test_RevertCreateEscrowWithEmptyLocation() public {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = HANDLE_2;
        teacherHandles[2] = HANDLE_3;
        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        vm.expectRevert(YogaClassEscrow.EmptyLocation.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(teacherHandles, timeSlots, "", DESCRIPTION, STUDENT_EMAIL, student); // Empty location
    }

    function test_RevertCreateEscrowWithEmptyEmail() public {
        string[] memory teacherHandles = new string[](3);
        teacherHandles[0] = HANDLE_1;
        teacherHandles[1] = HANDLE_2;
        teacherHandles[2] = HANDLE_3;
        uint64[3] memory timeSlots =
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)];

        vm.prank(student);
        vm.expectRevert(YogaClassEscrow.EmptyEmail.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(teacherHandles, timeSlots, LOCATION, DESCRIPTION, "", student); // Empty email
    }

    function test_GetEscrowsByStudent() public {
        // Create multiple escrows with different students
        uint256 escrow1 = createSampleEscrow(); // student

        vm.prank(teacher1);
        string[] memory handles2 = new string[](3);
        handles2[0] = HANDLE_1;
        handles2[1] = HANDLE_2;
        handles2[2] = HANDLE_3;
        uint256 escrow2 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles2,
            [uint64(block.timestamp + 2 days), uint64(block.timestamp + 3 days), uint64(block.timestamp + 4 days)],
            LOCATION,
            "Teacher's escrow",
            "teacher@example.com",
            teacher1
        );

        vm.prank(student);
        string[] memory handles3 = new string[](3);
        handles3[0] = HANDLE_1;
        handles3[1] = HANDLE_2;
        handles3[2] = HANDLE_3;
        uint256 escrow3 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles3,
            [uint64(block.timestamp + 5 days), uint64(block.timestamp + 6 days), uint64(block.timestamp + 7 days)],
            LOCATION,
            "Student's second escrow",
            STUDENT_EMAIL,
            student
        );

        // Get escrows for student
        uint256[] memory studentEscrows = escrow.getEscrowsByStudent(student);
        assertEq(studentEscrows.length, 2);
        assertEq(studentEscrows[0], escrow1);
        assertEq(studentEscrows[1], escrow3);

        // Get escrows for teacher1
        uint256[] memory teacherEscrows = escrow.getEscrowsByStudent(teacher1);
        assertEq(teacherEscrows.length, 1);
        assertEq(teacherEscrows[0], escrow2);
    }

    function test_GetEscrowsByTeacher() public {
        uint256 escrow1 = createSampleEscrow();
        uint256 escrow2 = createSampleEscrow();

        // Teacher1 accepts first escrow
        vm.prank(teacher1);
        escrow.acceptClass(escrow1, HANDLE_1, 0);

        // Teacher2 accepts second escrow
        vm.prank(teacher2);
        escrow.acceptClass(escrow2, HANDLE_2, 1);

        // Get escrows for teacher1
        uint256[] memory teacher1Escrows = escrow.getEscrowsByTeacher(teacher1);
        assertEq(teacher1Escrows.length, 1);
        assertEq(teacher1Escrows[0], escrow1);

        // Get escrows for teacher2
        uint256[] memory teacher2Escrows = escrow.getEscrowsByTeacher(teacher2);
        assertEq(teacher2Escrows.length, 1);
        assertEq(teacher2Escrows[0], escrow2);

        // Teacher3 should have no escrows
        uint256[] memory teacher3Escrows = escrow.getEscrowsByTeacher(teacher3);
        assertEq(teacher3Escrows.length, 0);
    }

    function test_GetMultipleEscrows() public {
        uint256 escrow1 = createSampleEscrow();
        uint256 escrow2 = createSampleEscrow();

        uint256[] memory escrowIds = new uint256[](2);
        escrowIds[0] = escrow1;
        escrowIds[1] = escrow2;

        YogaClassEscrow.Escrow[] memory escrows = escrow.getMultipleEscrows(escrowIds);
        assertEq(escrows.length, 2);
        assertEq(escrows[0].student, student);
        assertEq(escrows[1].student, student);
        assertEq(escrows[0].amount, ESCROW_AMOUNT);
        assertEq(escrows[1].amount, ESCROW_AMOUNT);
    }

    function test_BatchAcceptClass() public {
        // Create 3 escrows for a group class
        uint256 escrow1 = createSampleEscrow();
        uint256 escrow2 = createSampleEscrow();
        uint256 escrow3 = createSampleEscrow();

        // Prepare array of escrow IDs
        uint256[] memory escrowIds = new uint256[](3);
        escrowIds[0] = escrow1;
        escrowIds[1] = escrow2;
        escrowIds[2] = escrow3;

        // Teacher accepts all 3 at once
        vm.prank(teacher1);
        escrow.batchAcceptClass(escrowIds, HANDLE_1, 0);

        // Verify all escrows are accepted
        YogaClassEscrow.Escrow memory escrowData1 = escrow.getEscrow(escrow1);
        YogaClassEscrow.Escrow memory escrowData2 = escrow.getEscrow(escrow2);
        YogaClassEscrow.Escrow memory escrowData3 = escrow.getEscrow(escrow3);

        assertEq(escrowData1.teacher, teacher1);
        assertEq(escrowData2.teacher, teacher1);
        assertEq(escrowData3.teacher, teacher1);
        assertEq(uint8(escrowData1.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        assertEq(uint8(escrowData2.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        assertEq(uint8(escrowData3.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
    }

    function test_BatchAcceptClassSkipsNonPending() public {
        // Create 3 escrows
        uint256 escrow1 = createSampleEscrow();
        uint256 escrow2 = createSampleEscrow();
        uint256 escrow3 = createSampleEscrow();

        // Accept escrow2 individually first
        vm.prank(teacher1);
        escrow.acceptClass(escrow2, HANDLE_1, 0);

        // Prepare array with all 3 escrows
        uint256[] memory escrowIds = new uint256[](3);
        escrowIds[0] = escrow1;
        escrowIds[1] = escrow2; // Already accepted
        escrowIds[2] = escrow3;

        // Batch accept should skip the already accepted one
        vm.prank(teacher2);
        escrow.batchAcceptClass(escrowIds, HANDLE_2, 1);

        // Verify escrow1 and escrow3 accepted by teacher2, escrow2 still by teacher1
        YogaClassEscrow.Escrow memory escrowData1 = escrow.getEscrow(escrow1);
        YogaClassEscrow.Escrow memory escrowData2 = escrow.getEscrow(escrow2);
        YogaClassEscrow.Escrow memory escrowData3 = escrow.getEscrow(escrow3);

        assertEq(escrowData1.teacher, teacher2);
        assertEq(escrowData2.teacher, teacher1); // Still teacher1
        assertEq(escrowData3.teacher, teacher2);
        assertEq(uint8(escrowData1.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        assertEq(uint8(escrowData2.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        assertEq(uint8(escrowData3.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
    }

    function test_RevertBatchAcceptEmptyArray() public {
        uint256[] memory emptyArray = new uint256[](0);

        vm.prank(teacher1);
        vm.expectRevert("Empty escrow list");
        escrow.batchAcceptClass(emptyArray, HANDLE_1, 0);
    }

    function test_RevertBatchAcceptTooManyEscrows() public {
        uint256[] memory tooManyEscrows = new uint256[](21);

        // Just fill with dummy IDs
        for (uint256 i = 0; i < 21; i++) {
            tooManyEscrows[i] = i;
        }

        vm.prank(teacher1);
        vm.expectRevert("Too many escrows");
        escrow.batchAcceptClass(tooManyEscrows, HANDLE_1, 0);
    }
}
