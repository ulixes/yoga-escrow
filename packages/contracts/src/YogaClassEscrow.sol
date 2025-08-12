// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YogaClassEscrow
 * @author Yoga Escrow Development Team
 * @notice Pure escrow contract for yoga class payments with ETH
 * @dev Simple escrow system focusing on secure fund holding and release
 *
 * Key features:
 * - Students deposit ETH into escrow for services
 * - Teachers can be assigned to receive payments
 * - Payments held securely until manual release or automatic timeout
 * - Built-in dispute resolution for conflict handling
 */
contract YogaClassEscrow is ReentrancyGuard {
    enum EscrowStatus {
        Created, // Escrow created with funds deposited
        Assigned, // Teacher assigned to this escrow
        Completed, // Service completed, payment released
        Cancelled, // Escrow cancelled, funds returned
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

    struct Location {
        string country; // Country where the class will be held
        string city; // City where the class will be held
        string specificLocation; // Specific location details (e.g., "Vake Park", "Central Gym")
    }

    struct Escrow {
        address payer; // Person who deposited funds
        address payee; // Person who will receive funds (selected teacher)
        uint256 amount; // Amount held in escrow (wei)
        EscrowStatus status; // Current escrow status
        uint64 createdAt; // When escrow was created
        uint64 expiresAt; // When escrow can be auto-released
        string description; // Optional description of service
        string[3] teacherHandles; // 3 unique handles for potential teachers
        YogaType[3] yogaTypes; // 3 yoga type options
        TimeSlot[3] timeSlots; // 3 time slot options
        Location[3] locations; // 3 location options for the class
        uint8 selectedPayeeIndex; // Which teacher was selected (0-2)
        uint8 selectedYogaIndex; // Which yoga type was selected (0-2)
        uint8 selectedTimeIndex; // Which time slot was selected (0-2)
        uint8 selectedLocationIndex; // Which location was selected (0-2)
        string selectedHandle; // The handle of the selected teacher
    }

    uint8 private constant NOT_SELECTED = 255;
    uint8 private constant OPTIONS_COUNT = 3;
    uint32 private constant GRACE_PERIOD_HOURS = 48; // Hours after class ends before auto-release

    mapping(uint256 => Escrow) public escrows;
    uint256 public nextEscrowId;

    event EscrowCreated(uint256 indexed escrowId, address indexed payer, uint256 amount);

    event EscrowAssigned(
        uint256 indexed escrowId,
        address indexed payee,
        uint8 payeeIndex,
        uint8 yogaIndex,
        uint8 timeIndex,
        uint8 locationIndex
    );

    event EscrowCompleted(uint256 indexed escrowId, address indexed payee, uint256 amountReleased);

    event EscrowCancelled(uint256 indexed escrowId, address indexed payer, uint256 amountRefunded);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowAutoReleased(uint256 indexed escrowId, address indexed payee, uint256 amountReleased);

    error NotPayer();
    error NotPayee();
    error NotAuthorized();
    error InvalidEscrowStatus();
    error EscrowNotExpired();
    error NoFundsToRelease();
    error ZeroAmount();
    error InvalidPayeeIndex();
    error InvalidYogaIndex();
    error InvalidTimeIndex();
    error InvalidLocationIndex();
    error DuplicateHandle();
    error EmptyHandle();
    error HandleMismatch();
    error EmptyLocation();

    modifier onlyPayer(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].payer) revert NotPayer();
        _;
    }

    modifier onlyPayee(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].payee) revert NotPayee();
        _;
    }

    modifier onlyEscrowStatus(uint256 escrowId, EscrowStatus requiredStatus) {
        if (escrows[escrowId].status != requiredStatus) revert InvalidEscrowStatus();
        _;
    }

    modifier onlyParties(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].payer && msg.sender != escrows[escrowId].payee) {
            revert NotAuthorized();
        }
        _;
    }

    /**
     * @notice Creates a new escrow with ETH deposit and choice options
     * @dev Funds are held until released. Auto-expiration calculated when teacher assigned. Payer specifies 3 options for each category
     * @param teacherHandles Array of exactly 3 unique teacher handles (e.g., "@yogamaster", "@zenteacher")
     * @param yogaTypes Array of exactly 3 yoga type preferences
     * @param timeSlots Array of exactly 3 possible time slots
     * @param locations Array of exactly 3 possible locations for the class
     * @param description Optional description of the service
     * @return escrowId Unique identifier for the created escrow
     */
    function createEscrow(
        string[3] calldata teacherHandles,
        YogaType[3] calldata yogaTypes,
        TimeSlot[3] calldata timeSlots,
        Location[3] calldata locations,
        string calldata description
    ) external payable nonReentrant returns (uint256 escrowId) {
        if (msg.value == 0) revert ZeroAmount();

        // Validate handles - no empty strings and no duplicates
        for (uint8 i = 0; i < OPTIONS_COUNT; i++) {
            if (bytes(teacherHandles[i]).length == 0) revert EmptyHandle();

            for (uint8 j = i + 1; j < OPTIONS_COUNT; j++) {
                if (keccak256(bytes(teacherHandles[i])) == keccak256(bytes(teacherHandles[j]))) {
                    revert DuplicateHandle();
                }
            }
        }

        // Validate locations - ensure all fields are non-empty
        for (uint8 i = 0; i < OPTIONS_COUNT; i++) {
            if (
                bytes(locations[i].country).length == 0 || bytes(locations[i].city).length == 0
                    || bytes(locations[i].specificLocation).length == 0
            ) {
                revert EmptyLocation();
            }
        }

        escrowId = nextEscrowId++;
        Escrow storage escrow = escrows[escrowId];

        escrow.payer = msg.sender;
        escrow.amount = msg.value;
        escrow.status = EscrowStatus.Created;
        escrow.createdAt = uint64(block.timestamp);
        escrow.expiresAt = 0; // Will be set when teacher assigned
        escrow.description = description;
        escrow.selectedPayeeIndex = NOT_SELECTED;
        escrow.selectedYogaIndex = NOT_SELECTED;
        escrow.selectedTimeIndex = NOT_SELECTED;
        escrow.selectedLocationIndex = NOT_SELECTED;

        // Store the options
        for (uint8 i = 0; i < OPTIONS_COUNT; i++) {
            escrow.teacherHandles[i] = teacherHandles[i];
            escrow.yogaTypes[i] = yogaTypes[i];
            escrow.timeSlots[i] = timeSlots[i];
            escrow.locations[i] = locations[i];
        }

        emit EscrowCreated(escrowId, msg.sender, msg.value);
    }

    /**
     * @notice Assigns a payee (teacher) and selects yoga type, time slot & location from the predefined options
     * @dev Payer provides teacher address and handle - must match one of the preset handles
     * @param escrowId The ID of the escrow to assign
     * @param teacherAddress The actual wallet address of the teacher
     * @param teacherHandle The handle that matches one of the 3 preset handles
     * @param yogaIndex Index (0-2) of which yoga type to select
     * @param timeIndex Index (0-2) of which time slot to select
     * @param locationIndex Index (0-2) of which location to select
     */
    function assignPayee(
        uint256 escrowId,
        address teacherAddress,
        string calldata teacherHandle,
        uint8 yogaIndex,
        uint8 timeIndex,
        uint8 locationIndex
    ) external nonReentrant onlyPayer(escrowId) onlyEscrowStatus(escrowId, EscrowStatus.Created) {
        require(teacherAddress != address(0), "Invalid teacher address");
        require(teacherAddress != msg.sender, "Teacher cannot be payer");
        if (yogaIndex >= OPTIONS_COUNT) revert InvalidYogaIndex();
        if (timeIndex >= OPTIONS_COUNT) revert InvalidTimeIndex();
        if (locationIndex >= OPTIONS_COUNT) revert InvalidLocationIndex();

        Escrow storage escrow = escrows[escrowId];

        // Find matching handle and get its index
        uint8 payeeIndex = NOT_SELECTED;
        for (uint8 i = 0; i < OPTIONS_COUNT; i++) {
            if (keccak256(bytes(escrow.teacherHandles[i])) == keccak256(bytes(teacherHandle))) {
                payeeIndex = i;
                break;
            }
        }

        if (payeeIndex == NOT_SELECTED) revert HandleMismatch();

        // Calculate automatic expiration: class end time + grace period
        TimeSlot memory selectedSlot = escrow.timeSlots[timeIndex];
        uint64 classEndTime = selectedSlot.startTime + (uint64(selectedSlot.durationMinutes) * 60);
        uint64 gracePeriodSeconds = uint64(GRACE_PERIOD_HOURS) * 3600;

        // Assign the selections
        escrow.payee = teacherAddress;
        escrow.selectedPayeeIndex = payeeIndex;
        escrow.selectedYogaIndex = yogaIndex;
        escrow.selectedTimeIndex = timeIndex;
        escrow.selectedLocationIndex = locationIndex;
        escrow.selectedHandle = teacherHandle;
        escrow.expiresAt = classEndTime + gracePeriodSeconds;
        escrow.status = EscrowStatus.Assigned;

        emit EscrowAssigned(escrowId, teacherAddress, payeeIndex, yogaIndex, timeIndex, locationIndex);
    }

    /**
     * @notice Payer releases funds to the assigned payee
     * @dev Only callable by payer for assigned escrows
     * @param escrowId The ID of the escrow to complete
     */
    function releasePayment(uint256 escrowId)
        external
        nonReentrant
        onlyPayer(escrowId)
        onlyEscrowStatus(escrowId, EscrowStatus.Assigned)
    {
        Escrow storage escrow = escrows[escrowId];
        uint256 amount = escrow.amount;
        address payeeAddress = escrow.payee;

        escrow.amount = 0;
        escrow.status = EscrowStatus.Completed;

        (bool success,) = payable(payeeAddress).call{value: amount}("");
        require(success, "Payment transfer failed");

        emit EscrowCompleted(escrowId, payeeAddress, amount);
    }

    /**
     * @notice Cancels escrow and refunds payer (only if not yet assigned)
     * @dev Only works for escrows in Created status
     * @param escrowId The ID of the escrow to cancel
     */
    function cancelEscrow(uint256 escrowId)
        external
        nonReentrant
        onlyPayer(escrowId)
        onlyEscrowStatus(escrowId, EscrowStatus.Created)
    {
        Escrow storage escrow = escrows[escrowId];
        uint256 refundAmount = escrow.amount;

        if (refundAmount == 0) revert NoFundsToRelease();

        escrow.amount = 0;
        escrow.status = EscrowStatus.Cancelled;

        (bool success,) = payable(escrow.payer).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit EscrowCancelled(escrowId, escrow.payer, refundAmount);
    }

    /**
     * @notice Automatically releases payment after expiration time
     * @dev Callable by anyone after escrow expiration time
     * @param escrowId The ID of the escrow to auto-release
     */
    function autoRelease(uint256 escrowId) external nonReentrant onlyEscrowStatus(escrowId, EscrowStatus.Assigned) {
        Escrow storage escrow = escrows[escrowId];

        if (block.timestamp < escrow.expiresAt) {
            revert EscrowNotExpired();
        }

        uint256 amount = escrow.amount;
        address payeeAddress = escrow.payee;

        escrow.amount = 0;
        escrow.status = EscrowStatus.Completed;

        (bool success,) = payable(payeeAddress).call{value: amount}("");
        require(success, "Auto-release transfer failed");

        emit EscrowAutoReleased(escrowId, payeeAddress, amount);
    }

    /**
     * @notice Either party can raise a dispute for an assigned escrow
     * @dev Freezes the escrow for external resolution
     * @param escrowId The ID of the escrow to dispute
     */
    function raiseDispute(uint256 escrowId)
        external
        onlyEscrowStatus(escrowId, EscrowStatus.Assigned)
        onlyParties(escrowId)
    {
        Escrow storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.Disputed;

        emit EscrowDisputed(escrowId);
    }

    /**
     * @notice Get escrow details
     * @param escrowId The ID of the escrow to query
     * @return The escrow struct
     */
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }

    /**
     * @notice Check if escrow is expired and can be auto-released
     * @param escrowId The ID of the escrow to check
     * @return Whether the escrow has expired
     */
    function isExpired(uint256 escrowId) external view returns (bool) {
        return block.timestamp >= escrows[escrowId].expiresAt;
    }

    /**
     * @notice Get total number of escrows created
     * @return The next escrow ID (total count)
     */
    function getTotalEscrows() external view returns (uint256) {
        return nextEscrowId;
    }

    /**
     * @notice Get the teacher handles for an escrow
     * @param escrowId The ID of the escrow to query
     * @return Array of 3 teacher handles
     */
    function getTeacherHandles(uint256 escrowId) external view returns (string[3] memory) {
        return escrows[escrowId].teacherHandles;
    }

    /**
     * @notice Get the yoga type options for an escrow
     * @param escrowId The ID of the escrow to query
     * @return Array of 3 yoga types
     */
    function getYogaTypes(uint256 escrowId) external view returns (YogaType[3] memory) {
        return escrows[escrowId].yogaTypes;
    }

    /**
     * @notice Get the time slot options for an escrow
     * @param escrowId The ID of the escrow to query
     * @return Array of 3 time slots
     */
    function getTimeSlots(uint256 escrowId) external view returns (TimeSlot[3] memory) {
        return escrows[escrowId].timeSlots;
    }

    /**
     * @notice Get the location options for an escrow
     * @param escrowId The ID of the escrow to query
     * @return Array of 3 locations
     */
    function getLocations(uint256 escrowId) external view returns (Location[3] memory) {
        return escrows[escrowId].locations;
    }

    /**
     * @notice Get the selected options for an assigned escrow
     * @param escrowId The ID of the escrow to query
     * @return payeeIndex Selected teacher index, yogaIndex Selected yoga type index, timeIndex Selected time slot index, locationIndex Selected location index
     */
    function getSelectedOptions(uint256 escrowId)
        external
        view
        returns (uint8 payeeIndex, uint8 yogaIndex, uint8 timeIndex, uint8 locationIndex)
    {
        Escrow memory escrow = escrows[escrowId];
        return (
            escrow.selectedPayeeIndex, escrow.selectedYogaIndex, escrow.selectedTimeIndex, escrow.selectedLocationIndex
        );
    }

    /**
     * @notice Get yoga type name as string
     * @param yogaType The yoga type enum value
     * @return The name of the yoga type
     */
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
