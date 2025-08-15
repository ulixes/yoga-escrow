// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/YogaClassEscrow.sol";

contract YogaClassEscrowTest is Test {
    YogaClassEscrow public escrow;

    address payer = makeAddr("payer");
    address teacher1 = makeAddr("teacher1");
    address teacher2 = makeAddr("teacher2");
    address teacher3 = makeAddr("teacher3");
    address other = makeAddr("other");

    uint256 constant ESCROW_AMOUNT = 0.1 ether;

    string constant HANDLE_1 = "@yogamaster";
    string constant HANDLE_2 = "@zenteacher";
    string constant HANDLE_3 = "@vinyasapro";

    function setUp() public {
        escrow = new YogaClassEscrow();
        vm.deal(payer, 10 ether);
        vm.deal(teacher1, 1 ether);
        vm.deal(teacher2, 1 ether);
        vm.deal(teacher3, 1 ether);
        vm.deal(other, 1 ether);
    }

    function createSampleEscrow() internal returns (uint256) {
        string[3] memory teacherHandles = [HANDLE_1, HANDLE_2, HANDLE_3];

        YogaClassEscrow.YogaType[3] memory yogaTypes =
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin];

        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        timeSlots[0] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 2 days),
            durationMinutes: 60,
            timezoneOffset: -300
        });
        timeSlots[1] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 3 days),
            durationMinutes: 90,
            timezoneOffset: -300
        });
        timeSlots[2] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 4 days),
            durationMinutes: 75,
            timezoneOffset: -300
        });

        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Vake Park"});
        locations[1] =
            YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Mtatsminda Park"});
        locations[2] = YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Lisi Lake"});

        vm.prank(payer);
        return escrow.createEscrow{value: ESCROW_AMOUNT}(
            teacherHandles, yogaTypes, timeSlots, locations, "Yoga class payment"
        );
    }

    function test_CreateEscrow() public {
        uint256 escrowId = createSampleEscrow();

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(escrowData.payer, payer);
        assertEq(escrowData.amount, ESCROW_AMOUNT);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Created));
        assertEq(escrowData.description, "Yoga class payment");

        // Check teacher handles
        string[3] memory teacherHandles = escrow.getTeacherHandles(escrowId);
        assertEq(teacherHandles[0], HANDLE_1);
        assertEq(teacherHandles[1], HANDLE_2);
        assertEq(teacherHandles[2], HANDLE_3);

        // Check yoga types
        YogaClassEscrow.YogaType[3] memory yogaTypes = escrow.getYogaTypes(escrowId);
        assertEq(uint8(yogaTypes[0]), uint8(YogaClassEscrow.YogaType.Vinyasa));
        assertEq(uint8(yogaTypes[1]), uint8(YogaClassEscrow.YogaType.Hatha));
        assertEq(uint8(yogaTypes[2]), uint8(YogaClassEscrow.YogaType.Yin));

        // Check locations
        YogaClassEscrow.Location[3] memory locations = escrow.getLocations(escrowId);
        assertEq(locations[0].country, "Georgia");
        assertEq(locations[0].city, "Tbilisi");
        assertEq(locations[0].specificLocation, "Vake Park");
        assertEq(locations[1].country, "Georgia");
        assertEq(locations[1].city, "Tbilisi");
        assertEq(locations[1].specificLocation, "Mtatsminda Park");
        assertEq(locations[2].country, "Georgia");
        assertEq(locations[2].city, "Tbilisi");
        assertEq(locations[2].specificLocation, "Lisi Lake");
    }

    function test_AssignPayee() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher2, HANDLE_2, 0, 2, 1); // Select teacher2 with @zenteacher handle, Vinyasa, timeSlot[2], location[1]

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(escrowData.payee, teacher2);
        assertEq(escrowData.selectedHandle, HANDLE_2);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Assigned));

        // Check that expiration was calculated correctly
        // timeSlot[2] starts at block.timestamp + 4 days, duration 75 minutes
        uint64 expectedClassEnd = uint64(block.timestamp + 4 days) + (75 * 60);
        uint64 expectedExpiration = expectedClassEnd + (48 * 3600); // 48 hours grace period
        assertEq(escrowData.expiresAt, expectedExpiration);

        (uint8 payeeIndex, uint8 yogaIndex, uint8 timeIndex, uint8 locationIndex) = escrow.getSelectedOptions(escrowId);
        assertEq(payeeIndex, 1); // HANDLE_2 is at index 1
        assertEq(yogaIndex, 0);
        assertEq(timeIndex, 2);
        assertEq(locationIndex, 1);
    }

    function test_ReleasePayment() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 1, 0, 0); // Select teacher1 with @yogamaster, Hatha, timeSlot[0], location[0]

        uint256 teacher1BalanceBefore = teacher1.balance;

        vm.prank(payer);
        escrow.releasePayment(escrowId);

        assertEq(teacher1.balance, teacher1BalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Completed));
        assertEq(escrowData.amount, 0);
    }

    function test_CancelEscrow() public {
        uint256 escrowId = createSampleEscrow();

        uint256 payerBalanceBefore = payer.balance;

        vm.prank(payer);
        escrow.cancelEscrow(escrowId);

        assertEq(payer.balance, payerBalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Cancelled));
        assertEq(escrowData.amount, 0);
    }

    function test_AutoRelease() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher3, HANDLE_3, 2, 1, 2); // Select teacher3 with @vinyasapro, Yin, timeSlot[1], location[2]

        // Fast forward past class end time + 48 hour grace period
        // timeSlot[1] starts at block.timestamp + 3 days, duration 90 minutes
        uint64 classEndTime = uint64(block.timestamp + 3 days) + (90 * 60);
        uint64 autoReleaseTime = classEndTime + (48 * 3600); // 48 hours after class ends
        vm.warp(autoReleaseTime + 1);

        uint256 teacher3BalanceBefore = teacher3.balance;

        // Anyone can trigger auto-release
        vm.prank(other);
        escrow.autoRelease(escrowId);

        assertEq(teacher3.balance, teacher3BalanceBefore + ESCROW_AMOUNT);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Completed));
    }

    function test_RaiseDispute() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);

        vm.prank(payer);
        escrow.raiseDispute(escrowId);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Disputed));
    }

    function test_PayeeCanAlsoRaiseDispute() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher2, HANDLE_2, 1, 1, 1);

        vm.prank(teacher2); // teacher2 was assigned
        escrow.raiseDispute(escrowId);

        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.EscrowStatus.Disputed));
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

    // Error condition tests
    function test_RevertCreateEscrowWithZeroValue() public {
        string[3] memory teacherHandles = [HANDLE_1, HANDLE_2, HANDLE_3];
        YogaClassEscrow.YogaType[3] memory yogaTypes =
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin];
        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Vake Park");
        locations[1] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Mtatsminda Park");
        locations[2] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Lisi Lake");

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.ZeroAmount.selector);
        escrow.createEscrow{value: 0}(teacherHandles, yogaTypes, timeSlots, locations, "Test");
    }

    function test_RevertCreateEscrowWithDuplicateHandles() public {
        string[3] memory teacherHandles = [HANDLE_1, HANDLE_1, HANDLE_3]; // Duplicate HANDLE_1
        YogaClassEscrow.YogaType[3] memory yogaTypes =
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin];
        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Vake Park");
        locations[1] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Mtatsminda Park");
        locations[2] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Lisi Lake");

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.DuplicateHandle.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(teacherHandles, yogaTypes, timeSlots, locations, "Test");
    }

    function test_RevertCreateEscrowWithEmptyHandle() public {
        string[3] memory teacherHandles = [HANDLE_1, "", HANDLE_3]; // Empty string
        YogaClassEscrow.YogaType[3] memory yogaTypes =
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin];
        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Vake Park");
        locations[1] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Mtatsminda Park");
        locations[2] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Lisi Lake");

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.EmptyHandle.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(teacherHandles, yogaTypes, timeSlots, locations, "Test");
    }

    function test_RevertAssignPayeeHandleMismatch() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.HandleMismatch.selector);
        escrow.assignPayee(escrowId, teacher1, "@wronghandle", 0, 0, 0); // Wrong handle
    }

    function test_RevertAssignPayeeInvalidYogaIndex() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.InvalidYogaIndex.selector);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 3, 0, 0); // Index 3 is invalid
    }

    function test_RevertAssignPayeeInvalidTimeIndex() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.InvalidTimeIndex.selector);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 3, 0); // Index 3 is invalid
    }

    function test_RevertAssignPayeeZeroAddress() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert("Invalid teacher address");
        escrow.assignPayee(escrowId, address(0), HANDLE_1, 0, 0, 0);
    }

    function test_RevertAssignPayeePayerAsTeacher() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert("Teacher cannot be payer");
        escrow.assignPayee(escrowId, payer, HANDLE_1, 0, 0, 0);
    }

    function test_RevertAssignPayeeNotPayer() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.NotPayer.selector);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);
    }

    function test_RevertReleasePaymentNotPayer() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.NotPayer.selector);
        escrow.releasePayment(escrowId);
    }

    function test_RevertCancelEscrowAfterAssigned() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.InvalidEscrowStatus.selector);
        escrow.cancelEscrow(escrowId);
    }

    function test_RevertAutoReleaseBeforeExpiration() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.EscrowNotExpired.selector);
        escrow.autoRelease(escrowId);
    }

    function test_RevertDisputeUnauthorized() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 0);

        vm.prank(other);
        vm.expectRevert(YogaClassEscrow.NotAuthorized.selector);
        escrow.raiseDispute(escrowId);
    }

    function test_RevertCreateEscrowWithEmptyLocation() public {
        string[3] memory teacherHandles = [HANDLE_1, HANDLE_2, HANDLE_3];
        YogaClassEscrow.YogaType[3] memory yogaTypes =
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin];
        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Vake Park");
        locations[1] = YogaClassEscrow.Location("Georgia", "", "Mtatsminda Park"); // Empty city
        locations[2] = YogaClassEscrow.Location("Georgia", "Tbilisi", "Lisi Lake");

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.EmptyLocation.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(teacherHandles, yogaTypes, timeSlots, locations, "Test");
    }

    function test_RevertAssignPayeeInvalidLocationIndex() public {
        uint256 escrowId = createSampleEscrow();

        vm.prank(payer);
        vm.expectRevert(YogaClassEscrow.InvalidLocationIndex.selector);
        escrow.assignPayee(escrowId, teacher1, HANDLE_1, 0, 0, 3); // Index 3 is invalid
    }

    function test_GetEscrowsByPayer() public {
        // Create multiple escrows with different payers
        uint256 escrow1 = createSampleEscrow(); // payer

        vm.prank(teacher1);
        uint256 escrow2 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            [HANDLE_1, HANDLE_2, HANDLE_3],
            [YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha, YogaClassEscrow.YogaType.Yin],
            getDefaultTimeSlots(),
            getDefaultLocations(),
            "Teacher's escrow"
        );

        vm.prank(payer);
        uint256 escrow3 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            [HANDLE_1, HANDLE_2, HANDLE_3],
            [YogaClassEscrow.YogaType.Yin, YogaClassEscrow.YogaType.Vinyasa, YogaClassEscrow.YogaType.Hatha],
            getDefaultTimeSlots(),
            getDefaultLocations(),
            "Payer's second escrow"
        );

        // Get escrows for payer
        uint256[] memory payerEscrows = escrow.getEscrowsByPayer(payer);
        assertEq(payerEscrows.length, 2);
        assertEq(payerEscrows[0], escrow1);
        assertEq(payerEscrows[1], escrow3);

        // Get escrows for teacher1
        uint256[] memory teacherEscrows = escrow.getEscrowsByPayer(teacher1);
        assertEq(teacherEscrows.length, 1);
        assertEq(teacherEscrows[0], escrow2);
    }

    function test_GetEscrowsByPayee() public {
        uint256 escrow1 = createSampleEscrow();
        uint256 escrow2 = createSampleEscrow();

        // Assign teacher1 to first escrow
        vm.prank(payer);
        escrow.assignPayee(escrow1, teacher1, HANDLE_1, 0, 0, 0);

        // Assign teacher2 to second escrow
        vm.prank(payer);
        escrow.assignPayee(escrow2, teacher2, HANDLE_2, 1, 1, 1);

        // Get escrows for teacher1
        uint256[] memory teacher1Escrows = escrow.getEscrowsByPayee(teacher1);
        assertEq(teacher1Escrows.length, 1);
        assertEq(teacher1Escrows[0], escrow1);

        // Get escrows for teacher2
        uint256[] memory teacher2Escrows = escrow.getEscrowsByPayee(teacher2);
        assertEq(teacher2Escrows.length, 1);
        assertEq(teacher2Escrows[0], escrow2);

        // Teacher3 should have no escrows
        uint256[] memory teacher3Escrows = escrow.getEscrowsByPayee(teacher3);
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
        assertEq(escrows[0].payer, payer);
        assertEq(escrows[1].payer, payer);
        assertEq(escrows[0].amount, ESCROW_AMOUNT);
        assertEq(escrows[1].amount, ESCROW_AMOUNT);
    }

    // Helper function for tests
    function getDefaultTimeSlots() internal view returns (YogaClassEscrow.TimeSlot[3] memory) {
        YogaClassEscrow.TimeSlot[3] memory timeSlots;
        timeSlots[0] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 2 days),
            durationMinutes: 60,
            timezoneOffset: -300
        });
        timeSlots[1] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 3 days),
            durationMinutes: 90,
            timezoneOffset: -300
        });
        timeSlots[2] = YogaClassEscrow.TimeSlot({
            startTime: uint64(block.timestamp + 4 days),
            durationMinutes: 75,
            timezoneOffset: -300
        });
        return timeSlots;
    }

    function getDefaultLocations() internal pure returns (YogaClassEscrow.Location[3] memory) {
        YogaClassEscrow.Location[3] memory locations;
        locations[0] = YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Vake Park"});
        locations[1] =
            YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Mtatsminda Park"});
        locations[2] = YogaClassEscrow.Location({country: "Georgia", city: "Tbilisi", specificLocation: "Lisi Lake"});
        return locations;
    }
}
