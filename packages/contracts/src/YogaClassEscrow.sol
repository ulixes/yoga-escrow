// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract YogaClassEscrow is ReentrancyGuard {
    enum BookingStatus {
        Pending, // Student created booking, awaiting teacher acceptance
        Confirmed, // Teacher accepted the booking
        Completed, // Class completed, payment released
        Cancelled, // Booking cancelled before confirmation
        Disputed // Either party raised a dispute

    }

    enum YogaType {
        Hatha, // Gentle, slow-paced stretching
        Vinyasa, // Flow-based, dynamic movement
        Ashtanga // Structured, athletic practice

    }

    struct TimeSlot {
        uint64 startTime; // Unix timestamp for class start
        uint32 durationMinutes; // Class duration in minutes
        int16 timezoneOffset; // Timezone offset in minutes from UTC
    }

    struct ClassBooking {
        address student; // Person booking the class
        address teacher; // Teacher who accepts the booking
        uint256 paymentAmount; // Payment amount in wei
        BookingStatus status; // Current booking status
        uint64 createdTimestamp; // When booking was created
        uint32 acceptanceDeadline; // Seconds teacher has to accept
        uint32 completionWindow; // Seconds after class to mark complete
        string[] teacherHandles; // Possible teacher social handles (lowercase)
        TimeSlot[] availableSlots; // 3 possible time slots
        YogaType[] yogaTypes; // 3 yoga type options
        uint8 selectedSlotIndex; // Which time slot was chosen
        uint8 selectedYogaType; // Which yoga type was chosen
    }

    uint8 private constant NOT_SELECTED = 255;
    uint256 private constant MAX_OPTIONS = 3;

    mapping(uint256 => ClassBooking) public bookings;
    uint256 public nextBookingId;

    event BookingCreated(
        uint256 indexed bookingId,
        address indexed student,
        uint256 paymentAmount,
        uint32 acceptanceDeadline,
        uint32 completionWindow
    );

    event BookingConfirmed(
        uint256 indexed bookingId, address indexed teacher, uint8 slotIndex, uint8 yogaTypeIndex, string teacherHandle
    );

    event BookingCompleted(uint256 indexed bookingId, address indexed teacher, uint256 paymentReleased);

    event BookingCancelled(uint256 indexed bookingId);
    event BookingDisputed(uint256 indexed bookingId);

    error NotStudent();
    error NotTeacher();
    error InvalidBookingStatus();
    error InvalidTimeSlot();
    error InvalidYogaType();
    error AcceptanceDeadlinePassed();
    error CompletionWindowNotReached();
    error NoPaymentToRefund();
    error InvalidNumberOfOptions();

    modifier onlyStudent(uint256 bookingId) {
        if (msg.sender != bookings[bookingId].student) revert NotStudent();
        _;
    }

    modifier onlyBookingStatus(uint256 bookingId, BookingStatus requiredStatus) {
        if (bookings[bookingId].status != requiredStatus) revert InvalidBookingStatus();
        _;
    }

    function createBooking(
        string[] calldata teacherHandles,
        TimeSlot[] calldata availableSlots,
        YogaType[] calldata yogaTypes,
        uint32 acceptanceDeadline,
        uint32 completionWindow
    ) external payable nonReentrant returns (uint256 bookingId) {
        require(msg.value > 0, "Payment required");
        require(teacherHandles.length == MAX_OPTIONS, "Exactly 3 teacher handles required");
        require(availableSlots.length == MAX_OPTIONS, "Exactly 3 time slots required");
        require(yogaTypes.length == MAX_OPTIONS, "Exactly 3 yoga types required");
        require(acceptanceDeadline > 0, "Acceptance deadline must be positive");
        require(completionWindow > 0, "Completion window must be positive");

        bookingId = nextBookingId++;
        ClassBooking storage booking = bookings[bookingId];

        booking.student = msg.sender;
        booking.paymentAmount = msg.value;
        booking.status = BookingStatus.Pending;
        booking.createdTimestamp = uint64(block.timestamp);
        booking.acceptanceDeadline = acceptanceDeadline;
        booking.completionWindow = completionWindow;
        booking.selectedSlotIndex = NOT_SELECTED;
        booking.selectedYogaType = NOT_SELECTED;

        for (uint256 i = 0; i < MAX_OPTIONS; i++) {
            booking.teacherHandles.push(teacherHandles[i]);
            booking.availableSlots.push(availableSlots[i]);
            booking.yogaTypes.push(yogaTypes[i]);
        }

        emit BookingCreated(bookingId, msg.sender, msg.value, acceptanceDeadline, completionWindow);
    }

    function confirmBooking(uint256 bookingId, uint8 slotIndex, uint8 yogaTypeIndex, string calldata teacherHandle)
        external
        nonReentrant
        onlyBookingStatus(bookingId, BookingStatus.Pending)
    {
        ClassBooking storage booking = bookings[bookingId];

        if (block.timestamp > booking.createdTimestamp + booking.acceptanceDeadline) {
            revert AcceptanceDeadlinePassed();
        }

        if (slotIndex >= MAX_OPTIONS) revert InvalidTimeSlot();
        if (yogaTypeIndex >= MAX_OPTIONS) revert InvalidYogaType();

        bool handleMatched = false;
        for (uint256 i = 0; i < booking.teacherHandles.length; i++) {
            if (keccak256(bytes(booking.teacherHandles[i])) == keccak256(bytes(teacherHandle))) {
                handleMatched = true;
                break;
            }
        }
        require(handleMatched, "Teacher handle not in approved list");

        booking.teacher = msg.sender;
        booking.selectedSlotIndex = slotIndex;
        booking.selectedYogaType = yogaTypeIndex;
        booking.status = BookingStatus.Confirmed;

        emit BookingConfirmed(bookingId, msg.sender, slotIndex, yogaTypeIndex, teacherHandle);
    }

    function completeClass(uint256 bookingId)
        external
        nonReentrant
        onlyStudent(bookingId)
        onlyBookingStatus(bookingId, BookingStatus.Confirmed)
    {
        ClassBooking storage booking = bookings[bookingId];
        uint256 payment = booking.paymentAmount;
        address teacherAddress = booking.teacher;

        booking.paymentAmount = 0;
        booking.status = BookingStatus.Completed;

        (bool success,) = payable(teacherAddress).call{value: payment}("");
        require(success, "Payment transfer failed");

        emit BookingCompleted(bookingId, teacherAddress, payment);
    }

    function cancelBooking(uint256 bookingId)
        external
        nonReentrant
        onlyStudent(bookingId)
        onlyBookingStatus(bookingId, BookingStatus.Pending)
    {
        ClassBooking storage booking = bookings[bookingId];
        uint256 refundAmount = booking.paymentAmount;

        if (refundAmount == 0) revert NoPaymentToRefund();

        booking.paymentAmount = 0;
        booking.status = BookingStatus.Cancelled;

        (bool success,) = payable(booking.student).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit BookingCancelled(bookingId);
    }

    function automaticPaymentRelease(uint256 bookingId)
        external
        nonReentrant
        onlyBookingStatus(bookingId, BookingStatus.Confirmed)
    {
        ClassBooking storage booking = bookings[bookingId];
        require(booking.selectedSlotIndex != NOT_SELECTED, "No time slot selected");

        TimeSlot memory selectedSlot = booking.availableSlots[booking.selectedSlotIndex];
        uint256 classEndTime = uint256(selectedSlot.startTime) + uint256(selectedSlot.durationMinutes) * 60;

        if (block.timestamp < classEndTime + booking.completionWindow) {
            revert CompletionWindowNotReached();
        }

        uint256 payment = booking.paymentAmount;
        address teacherAddress = booking.teacher;

        booking.paymentAmount = 0;
        booking.status = BookingStatus.Completed;

        (bool success,) = payable(teacherAddress).call{value: payment}("");
        require(success, "Automatic payment release failed");

        emit BookingCompleted(bookingId, teacherAddress, payment);
    }

    function raiseDispute(uint256 bookingId) external onlyBookingStatus(bookingId, BookingStatus.Confirmed) {
        ClassBooking storage booking = bookings[bookingId];
        require(
            msg.sender == booking.student || msg.sender == booking.teacher, "Only student or teacher can raise dispute"
        );

        booking.status = BookingStatus.Disputed;
        emit BookingDisputed(bookingId);
    }

    function getBooking(uint256 bookingId) external view returns (ClassBooking memory) {
        return bookings[bookingId];
    }

    function getTeacherHandles(uint256 bookingId) external view returns (string[] memory) {
        return bookings[bookingId].teacherHandles;
    }

    function getTimeSlots(uint256 bookingId) external view returns (TimeSlot[] memory) {
        return bookings[bookingId].availableSlots;
    }

    function getYogaTypes(uint256 bookingId) external view returns (YogaType[] memory) {
        return bookings[bookingId].yogaTypes;
    }

    function getYogaTypeName(YogaType yogaType) external pure returns (string memory) {
        if (yogaType == YogaType.Hatha) return "Hatha";
        if (yogaType == YogaType.Vinyasa) return "Vinyasa";
        if (yogaType == YogaType.Ashtanga) return "Ashtanga";
        return "Unknown";
    }
}
