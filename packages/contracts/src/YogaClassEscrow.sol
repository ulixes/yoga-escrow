// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YogaClassEscrow
 * @author Yoga Escrow Development Team
 * @notice Clean escrow contract for yoga class payments with ETH
 * @dev Simple 4-state escrow: Pending → Accepted → Delivered/Cancelled
 *
 * States:
 * - Pending: Escrow created, waiting for teacher acceptance
 * - Accepted: Teacher accepted, class scheduled
 * - Delivered: Class completed, payment released
 * - Cancelled: Student cancelled, funds refunded
 *
 * Rules:
 * - Student can ALWAYS cancel and get refund (even after acceptance)
 * - Teacher can release funds 24hrs after class time (if student forgets)
 * - Simple validation on all inputs
 */
contract YogaClassEscrow is ReentrancyGuard {
    enum ClassStatus {
        Pending,   // Created, waiting for teacher
        Accepted,  // Teacher accepted the class
        Delivered, // Class completed, payment released
        Cancelled  // Student cancelled, refunded
    }

    struct Escrow {
        address student;           // Student who created the escrow
        address teacher;           // Teacher (set when accepted)
        uint256 amount;            // Amount in escrow (wei)
        ClassStatus status;        // Current status
        uint64 createdAt;          // Creation timestamp
        uint64 classTime;          // When class happens (from selected slot)
        string description;        // Class description
        string location;           // Class location
        string studentEmail;       // Student contact
        string[] teacherHandles;   // 1-3 teacher options
        uint64[3] timeSlots;       // 3 time options (unix timestamps)
        uint8 selectedTimeIndex;   // Which time was selected (when accepted)
        string selectedHandle;     // Which teacher was selected
    }

    uint8 private constant NOT_SELECTED = 255;
    uint32 private constant AUTO_RELEASE_HOURS = 24; // Hours after class time teacher can release

    mapping(uint256 => Escrow) public escrows;
    uint256 public nextEscrowId;

    event EscrowCreated(uint256 indexed escrowId, address indexed student, uint256 amount);
    event ClassAccepted(uint256 indexed escrowId, address indexed teacher, string teacherHandle, uint8 timeIndex);
    event ClassDelivered(uint256 indexed escrowId, address indexed teacher, uint256 amount);
    event ClassCancelled(uint256 indexed escrowId, address indexed student, uint256 refund);
    event TeacherAutoRelease(uint256 indexed escrowId, address indexed teacher, uint256 amount);

    error NotStudent();
    error NotTeacher();
    error InvalidStatus();
    error TooEarlyToRelease();
    error ZeroAmount();
    error InvalidTimeIndex();
    error DuplicateHandle();
    error EmptyHandle();
    error HandleMismatch();
    error EmptyLocation();
    error EmptyEmail();

    modifier onlyStudent(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].student) revert NotStudent();
        _;
    }

    modifier onlyTeacher(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].teacher) revert NotTeacher();
        _;
    }

    modifier onlyStatus(uint256 escrowId, ClassStatus requiredStatus) {
        if (escrows[escrowId].status != requiredStatus) revert InvalidStatus();
        _;
    }

    /**
     * @notice Creates a new escrow with ETH deposit and 3 teacher/time options
     * @dev Clean function matching client payload: teachers, times, location, description, student info
     * @param teacherHandles Array of 1-3 unique teacher handles (e.g., "@yogamaster")
     * @param timeSlots Array of exactly 3 unix timestamps for possible class times
     * @param location Single location string (e.g., "Vake Park, Tbilisi")
     * @param description Class description (e.g., "Private yoga class booking")
     * @param studentEmail Student email for contact
     * @param studentWallet Student wallet address (for validation)
     * @return escrowId Unique identifier for the created escrow
     */
    function createEscrow(
        string[] calldata teacherHandles,
        uint64[3] calldata timeSlots,
        string calldata location,
        string calldata description,
        string calldata studentEmail,
        address studentWallet
    ) external payable nonReentrant returns (uint256 escrowId) {
        if (msg.value == 0) revert ZeroAmount();
        if (bytes(location).length == 0) revert EmptyLocation();
        if (bytes(studentEmail).length == 0) revert EmptyEmail();
        require(studentWallet == msg.sender, "Student wallet mismatch");

        // Validate teacher handles - must have 1-3, no empty strings, no duplicates
        require(teacherHandles.length >= 1 && teacherHandles.length <= 3, "Must have 1-3 teachers");
        
        for (uint8 i = 0; i < teacherHandles.length; i++) {
            if (bytes(teacherHandles[i]).length == 0) revert EmptyHandle();

            for (uint8 j = i + 1; j < teacherHandles.length; j++) {
                if (keccak256(bytes(teacherHandles[i])) == keccak256(bytes(teacherHandles[j]))) {
                    revert DuplicateHandle();
                }
            }
        }

        // Validate time slots - must be in future
        for (uint8 i = 0; i < 3; i++) {
            require(timeSlots[i] > block.timestamp, "Time slot must be in future");
        }

        escrowId = nextEscrowId++;
        Escrow storage escrow = escrows[escrowId];

        escrow.student = msg.sender;
        escrow.amount = msg.value;
        escrow.status = ClassStatus.Pending;
        escrow.createdAt = uint64(block.timestamp);
        escrow.description = description;
        escrow.location = location;
        escrow.studentEmail = studentEmail;
        escrow.selectedTimeIndex = NOT_SELECTED;

        // Store teacher handles
        for (uint8 i = 0; i < teacherHandles.length; i++) {
            escrow.teacherHandles.push(teacherHandles[i]);
        }
        
        // Store time options
        for (uint8 i = 0; i < 3; i++) {
            escrow.timeSlots[i] = timeSlots[i];
        }

        emit EscrowCreated(escrowId, msg.sender, msg.value);
    }

    /**
     * @notice Teacher accepts a class by selecting their handle and preferred time
     * @dev Teacher must be one of the 3 proposed handles and pick one of 3 time slots
     * @param escrowId The ID of the escrow to accept
     * @param teacherHandle The handle that matches one of the 3 preset handles
     * @param timeIndex Index (0-2) of which time slot to select
     */
    function acceptClass(
        uint256 escrowId,
        string calldata teacherHandle,
        uint8 timeIndex
    ) external nonReentrant onlyStatus(escrowId, ClassStatus.Pending) {
        require(msg.sender != address(0), "Invalid teacher address");
        if (timeIndex >= 3) revert InvalidTimeIndex();

        Escrow storage escrow = escrows[escrowId];
        require(msg.sender != escrow.student, "Student cannot be teacher");

        // Find matching handle
        bool handleFound = false;
        for (uint8 i = 0; i < escrow.teacherHandles.length; i++) {
            if (keccak256(bytes(escrow.teacherHandles[i])) == keccak256(bytes(teacherHandle))) {
                handleFound = true;
                break;
            }
        }
        if (!handleFound) revert HandleMismatch();

        // Accept the class
        escrow.teacher = msg.sender;
        escrow.selectedTimeIndex = timeIndex;
        escrow.selectedHandle = teacherHandle;
        escrow.classTime = escrow.timeSlots[timeIndex];
        escrow.status = ClassStatus.Accepted;

        emit ClassAccepted(escrowId, msg.sender, teacherHandle, timeIndex);
    }

    /**
     * @notice Student releases payment after class completion
     * @dev Only callable by student for accepted classes
     * @param escrowId The ID of the escrow to complete
     */
    function releasePayment(uint256 escrowId)
        external
        nonReentrant
        onlyStudent(escrowId)
        onlyStatus(escrowId, ClassStatus.Accepted)
    {
        Escrow storage escrow = escrows[escrowId];
        uint256 amount = escrow.amount;
        address teacherAddress = escrow.teacher;

        // Keep amount for UI display, just change status
        escrow.status = ClassStatus.Delivered;

        (bool success,) = payable(teacherAddress).call{value: amount}("");
        require(success, "Payment transfer failed");

        emit ClassDelivered(escrowId, teacherAddress, amount);
    }

    /**
     * @notice Student cancels class and gets full refund (ALWAYS ALLOWED)
     * @dev Student protection - can cancel anytime unless already delivered/cancelled
     * @param escrowId The ID of the escrow to cancel
     */
    function cancelClass(uint256 escrowId)
        external
        nonReentrant
        onlyStudent(escrowId)
    {
        Escrow storage escrow = escrows[escrowId];
        
        // Can only cancel if not already delivered or cancelled
        require(
            escrow.status != ClassStatus.Delivered && 
            escrow.status != ClassStatus.Cancelled,
            "Cannot cancel delivered/cancelled class"
        );
        
        uint256 refundAmount = escrow.amount;
        require(refundAmount > 0, "No funds to refund");

        // Keep amount for UI display, just change status
        escrow.status = ClassStatus.Cancelled;

        (bool success,) = payable(escrow.student).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit ClassCancelled(escrowId, escrow.student, refundAmount);
    }

    /**
     * @notice Teacher can release payment 24hrs after class time (if student forgets)
     * @dev Only callable by assigned teacher after 24hr grace period
     * @param escrowId The ID of the escrow to auto-release
     */
    function teacherRelease(uint256 escrowId) 
        external 
        nonReentrant 
        onlyTeacher(escrowId) 
        onlyStatus(escrowId, ClassStatus.Accepted) 
    {
        Escrow storage escrow = escrows[escrowId];

        // Must wait 24hrs after class time
        uint64 releaseTime = escrow.classTime + (AUTO_RELEASE_HOURS * 3600);
        if (block.timestamp < releaseTime) {
            revert TooEarlyToRelease();
        }

        uint256 amount = escrow.amount;
        address teacherAddress = escrow.teacher;

        // Keep amount for UI display, just change status
        escrow.status = ClassStatus.Delivered;

        (bool success,) = payable(teacherAddress).call{value: amount}("");
        require(success, "Teacher release failed");

        emit TeacherAutoRelease(escrowId, teacherAddress, amount);
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
     * @notice Check if teacher can release payment (24hrs after class)
     * @param escrowId The ID of the escrow to check
     * @return Whether teacher can auto-release
     */
    function canTeacherRelease(uint256 escrowId) external view returns (bool) {
        Escrow memory escrow = escrows[escrowId];
        if (escrow.status != ClassStatus.Accepted) return false;
        
        uint64 releaseTime = escrow.classTime + (AUTO_RELEASE_HOURS * 3600);
        return block.timestamp >= releaseTime;
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
     * @return Array of 1-3 teacher handles
     */
    function getTeacherHandles(uint256 escrowId) external view returns (string[] memory) {
        return escrows[escrowId].teacherHandles;
    }

    /**
     * @notice Get the time slot options for an escrow
     * @param escrowId The ID of the escrow to query
     * @return Array of 3 unix timestamps
     */
    function getTimeSlots(uint256 escrowId) external view returns (uint64[3] memory) {
        return escrows[escrowId].timeSlots;
    }

    /**
     * @notice Get all escrow IDs for a specific student
     * @param student The address of the student to get escrows for
     * @return Array of escrow IDs belonging to the student
     */
    function getEscrowsByStudent(address student) external view returns (uint256[] memory) {
        uint256 count = 0;

        // First pass: count matching escrows
        for (uint256 i = 0; i < nextEscrowId; i++) {
            if (escrows[i].student == student) {
                count++;
            }
        }

        // Second pass: collect IDs
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextEscrowId; i++) {
            if (escrows[i].student == student) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }

    /**
     * @notice Get all escrow IDs for a specific teacher
     * @param teacher The address of the teacher to get escrows for
     * @return Array of escrow IDs assigned to the teacher
     */
    function getEscrowsByTeacher(address teacher) external view returns (uint256[] memory) {
        uint256 count = 0;

        // First pass: count matching escrows
        for (uint256 i = 0; i < nextEscrowId; i++) {
            if (escrows[i].teacher == teacher) {
                count++;
            }
        }

        // Second pass: collect IDs
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextEscrowId; i++) {
            if (escrows[i].teacher == teacher) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }

    /**
     * @notice Get full escrow details for multiple escrow IDs
     * @param escrowIds Array of escrow IDs to fetch
     * @return Array of escrow structs
     */
    function getMultipleEscrows(uint256[] calldata escrowIds) external view returns (Escrow[] memory) {
        Escrow[] memory result = new Escrow[](escrowIds.length);

        for (uint256 i = 0; i < escrowIds.length; i++) {
            result[i] = escrows[escrowIds[i]];
        }

        return result;
    }
}
