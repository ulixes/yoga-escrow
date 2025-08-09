// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YogaClassEscrow
 * @author Yoga Escrow Development Team
 * @notice Minimal escrow contract for yoga class bookings with ETH payments
 * @dev Simplified booking system with 3 time slots and yoga type preferences
 *
 * Key features:
 * - Students create bookings with exactly 3 time slots and at least 1 yoga type preference
 * - Teachers confirm bookings by selecting one slot
 * - Payments are held in escrow until class completion or automatic release
 * - Built-in dispute resolution for conflict handling
 */
contract YogaClassEscrow is ReentrancyGuard {
    enum BookingStatus {
        Pending, // Student created booking, awaiting teacher acceptance
        Confirmed, // Teacher accepted the booking
        Completed, // Class completed, payment released
        Cancelled, // Booking cancelled before confirmation
        Disputed // Either party raised a dispute

    }

    enum YogaType {
        Vinyasa, // Flow-based sequences linking breath with movement
        Yin, // Slow, deep stretches held for minutes
        Hatha, // Balanced, foundational poses with breathwork
        Ashtanga, // Structured, vigorous, athletic series
        Restorative, // Passive poses with props for deep relaxation
        Iyengar, // Precise alignment with props
        Kundalini, // Poses, breathwork, chanting, meditation
        Power // Fast-paced, strength-focused Vinyasa

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
        uint32 completionWindow; // Seconds after class to mark complete
        TimeSlot[] availableSlots; // 3 possible time slots
        YogaType[] yogaTypes; // Yoga type preferences (at least 1)
        uint8 selectedSlotIndex; // Which time slot was chosen
    }

    uint8 private constant NOT_SELECTED = 255;
    uint256 private constant MAX_TIME_SLOTS = 3;
    uint256 private constant MAX_YOGA_TYPES = 8;

    mapping(uint256 => ClassBooking) public bookings;
    uint256 public nextBookingId;

    event BookingCreated(
        uint256 indexed bookingId, address indexed student, uint256 paymentAmount, uint32 completionWindow
    );

    event BookingConfirmed(uint256 indexed bookingId, address indexed teacher, uint8 slotIndex);

    event BookingCompleted(uint256 indexed bookingId, address indexed teacher, uint256 paymentReleased);

    event BookingCancelled(uint256 indexed bookingId);
    event BookingDisputed(uint256 indexed bookingId);

    error NotStudent();
    error NotTeacher();
    error InvalidBookingStatus();
    error InvalidTimeSlot();
    error InvalidYogaType();
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

    /**
     * @notice Creates a new minimal yoga class booking with ETH payment
     * @dev Requires exactly 3 time slots and at least 1 yoga type preference
     * @param availableSlots Array of exactly 3 possible time slots for the class
     * @param yogaTypes Array of yoga type preferences (at least 1, max 8)
     * @param completionWindow Seconds after class end to mark as completed
     * @return bookingId Unique identifier for the created booking
     */
    function createBooking(TimeSlot[] calldata availableSlots, YogaType[] calldata yogaTypes, uint32 completionWindow)
        external
        payable
        nonReentrant
        returns (uint256 bookingId)
    {
        require(msg.value > 0, "Payment required");
        require(availableSlots.length == MAX_TIME_SLOTS, "Exactly 3 time slots required");
        require(yogaTypes.length > 0 && yogaTypes.length <= MAX_YOGA_TYPES, "Must have 1-8 yoga type preferences");
        require(completionWindow > 0, "Completion window must be positive");

        bookingId = nextBookingId++;
        ClassBooking storage booking = bookings[bookingId];

        booking.student = msg.sender;
        booking.paymentAmount = msg.value;
        booking.status = BookingStatus.Pending;
        booking.createdTimestamp = uint64(block.timestamp);
        booking.completionWindow = completionWindow;
        booking.selectedSlotIndex = NOT_SELECTED;

        for (uint256 i = 0; i < MAX_TIME_SLOTS; i++) {
            booking.availableSlots.push(availableSlots[i]);
        }

        for (uint256 i = 0; i < yogaTypes.length; i++) {
            booking.yogaTypes.push(yogaTypes[i]);
        }

        emit BookingCreated(bookingId, msg.sender, msg.value, completionWindow);
    }

    /**
     * @notice Teacher confirms a booking by selecting a time slot
     * @dev Only callable for pending bookings
     * @param bookingId The ID of the booking to confirm
     * @param slotIndex Index of selected time slot (0, 1, or 2)
     */
    function confirmBooking(uint256 bookingId, uint8 slotIndex)
        external
        nonReentrant
        onlyBookingStatus(bookingId, BookingStatus.Pending)
    {
        ClassBooking storage booking = bookings[bookingId];

        if (slotIndex >= MAX_TIME_SLOTS) revert InvalidTimeSlot();

        booking.teacher = msg.sender;
        booking.selectedSlotIndex = slotIndex;
        booking.status = BookingStatus.Confirmed;

        emit BookingConfirmed(bookingId, msg.sender, slotIndex);
    }

    /**
     * @notice Student marks class as completed and releases payment to teacher
     * @dev Only callable by student for confirmed bookings
     * @param bookingId The ID of the booking to complete
     */
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

    /**
     * @notice Student cancels a pending booking and receives full refund
     * @dev Only works for bookings in Pending status
     * @param bookingId The ID of the booking to cancel
     */
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

    /**
     * @notice Automatically releases payment after completion window expires
     * @dev Callable by anyone after class end time + completion window
     * @param bookingId The ID of the booking to auto-release
     */
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

    /**
     * @notice Either party can raise a dispute for a confirmed booking
     * @dev Freezes the booking for external resolution
     * @param bookingId The ID of the booking to dispute
     */
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

    function getTimeSlots(uint256 bookingId) external view returns (TimeSlot[] memory) {
        return bookings[bookingId].availableSlots;
    }

    function getYogaTypes(uint256 bookingId) external view returns (YogaType[] memory) {
        return bookings[bookingId].yogaTypes;
    }

    function getYogaTypeName(YogaType yogaType) external pure returns (string memory) {
        if (yogaType == YogaType.Vinyasa) return "Vinyasa";
        if (yogaType == YogaType.Yin) return "Yin";
        if (yogaType == YogaType.Hatha) return "Hatha";
        if (yogaType == YogaType.Ashtanga) return "Ashtanga";
        if (yogaType == YogaType.Restorative) return "Restorative";
        if (yogaType == YogaType.Iyengar) return "Iyengar";
        if (yogaType == YogaType.Kundalini) return "Kundalini";
        if (yogaType == YogaType.Power) return "Power";
        return "Unknown";
    }
}
