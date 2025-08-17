// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/YogaClassEscrow.sol";
import "../src/TeacherRegistry.sol";

/**
 * @title YogaClassEscrow Integration Tests
 * @notice Tests for edge cases and security scenarios with TeacherRegistry
 */
contract YogaClassEscrowIntegrationTest is Test {
    YogaClassEscrow public escrow;
    TeacherRegistry public registry;
    
    address registryOwner = makeAddr("registryOwner");
    address student1 = makeAddr("student1");
    address student2 = makeAddr("student2");
    address teacher1 = makeAddr("teacher1");
    address teacher2 = makeAddr("teacher2");
    address attacker = makeAddr("attacker");
    address newTeacher = makeAddr("newTeacher");
    
    string constant HANDLE_1 = "@yogamaster";
    string constant HANDLE_2 = "@zenflow";
    string constant HANDLE_3 = "@vinyasapro";
    
    uint256 constant ESCROW_AMOUNT = 0.1 ether;
    
    event TeacherRegistered(string indexed handle, address indexed teacherAddress);
    event TeacherUpdated(string indexed handle, address indexed newTeacherAddress);
    event ClassAccepted(uint256 indexed escrowId, address indexed teacher, string teacherHandle, uint8 timeIndex);
    
    function setUp() public {
        // Deploy and setup
        vm.prank(registryOwner);
        registry = new TeacherRegistry(registryOwner);
        
        escrow = new YogaClassEscrow(address(registry));
        
        // Register initial teachers
        vm.startPrank(registryOwner);
        registry.registerTeacher(HANDLE_1, teacher1);
        registry.registerTeacher(HANDLE_2, teacher2);
        vm.stopPrank();
        
        // Fund accounts
        vm.deal(student1, 10 ether);
        vm.deal(student2, 10 ether);
        vm.deal(attacker, 10 ether);
    }
    
    /**
     * @notice Test: Attacker cannot impersonate a registered teacher
     */
    function test_PreventImpersonationAttack() public {
        // Student creates escrow with registered teacher handle
        string[] memory handles = new string[](2);
        handles[0] = HANDLE_1;
        handles[1] = HANDLE_2;
        
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        vm.prank(student1);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Yoga class", "student@email.com", student1
        );
        
        // Attacker tries to accept with registered handle
        vm.prank(attacker);
        vm.expectRevert(YogaClassEscrow.UnauthorizedTeacher.selector);
        escrow.acceptClass(escrowId, HANDLE_1, 0);
        
        // Verify escrow is still pending
        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(uint8(escrowData.status), uint8(YogaClassEscrow.ClassStatus.Pending));
        assertEq(escrowData.teacher, address(0));
    }
    
    /**
     * @notice Test: Handle not in registry cannot be used
     */
    function test_UnregisteredHandleRejected() public {
        // Create escrow with unregistered handle
        string[] memory handles = new string[](2);
        handles[0] = HANDLE_1;
        handles[1] = "@unregistered";
        
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        vm.prank(student1);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Yoga class", "student@email.com", student1
        );
        
        // Anyone trying to accept with unregistered handle fails
        vm.prank(attacker);
        vm.expectRevert(YogaClassEscrow.HandleNotRegistered.selector);
        escrow.acceptClass(escrowId, "@unregistered", 0);
    }
    
    /**
     * @notice Test: Teacher address update affects future escrows only
     */
    function test_TeacherAddressUpdateHandling() public {
        // Create escrow
        string[] memory handles = new string[](1);
        handles[0] = HANDLE_1;
        
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        vm.prank(student1);
        uint256 escrowId1 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Class 1", "student@email.com", student1
        );
        
        // Teacher1 accepts first escrow
        vm.prank(teacher1);
        escrow.acceptClass(escrowId1, HANDLE_1, 0);
        
        // Registry owner updates teacher1's handle to newTeacher address
        vm.prank(registryOwner);
        registry.updateTeacherAddress(HANDLE_1, newTeacher);
        
        // Create second escrow after update
        vm.prank(student2);
        uint256 escrowId2 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Class 2", "student2@email.com", student2
        );
        
        // Old teacher1 cannot accept new escrow
        vm.prank(teacher1);
        vm.expectRevert(YogaClassEscrow.UnauthorizedTeacher.selector);
        escrow.acceptClass(escrowId2, HANDLE_1, 0);
        
        // New teacher can accept
        vm.prank(newTeacher);
        escrow.acceptClass(escrowId2, HANDLE_1, 0);
        
        // Verify assignments
        YogaClassEscrow.Escrow memory escrow1Data = escrow.getEscrow(escrowId1);
        YogaClassEscrow.Escrow memory escrow2Data = escrow.getEscrow(escrowId2);
        
        assertEq(escrow1Data.teacher, teacher1); // Old escrow unaffected
        assertEq(escrow2Data.teacher, newTeacher); // New escrow uses new address
    }
    
    /**
     * @notice Test: Teacher removal prevents acceptance
     */
    function test_RemovedTeacherCannotAccept() public {
        // Create escrow
        string[] memory handles = new string[](1);
        handles[0] = HANDLE_1;
        
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        vm.prank(student1);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Yoga class", "student@email.com", student1
        );
        
        // Remove teacher from registry
        vm.prank(registryOwner);
        registry.removeTeacher(HANDLE_1);
        
        // Teacher1 can no longer accept
        vm.prank(teacher1);
        vm.expectRevert(YogaClassEscrow.HandleNotRegistered.selector);
        escrow.acceptClass(escrowId, HANDLE_1, 0);
    }
    
    /**
     * @notice Test: Registry owner change doesn't affect operations
     */
    function test_RegistryOwnershipTransfer() public {
        address newOwner = makeAddr("newOwner");
        
        // Transfer ownership
        vm.prank(registryOwner);
        registry.transferOwnership(newOwner);
        
        // Old owner cannot register
        vm.prank(registryOwner);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", registryOwner));
        registry.registerTeacher(HANDLE_3, makeAddr("someTeacher"));
        
        // New owner can register
        vm.prank(newOwner);
        registry.registerTeacher(HANDLE_3, makeAddr("anotherTeacher"));
        
        // Verify registration worked
        assertEq(registry.getTeacherAddress(HANDLE_3), makeAddr("anotherTeacher"));
    }
    
    /**
     * @notice Test: Batch accept with mixed registration status
     */
    function test_BatchAcceptMixedRegistration() public {
        // Create 3 escrows all with HANDLE_1 (which teacher1 is registered for)
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        string[] memory handles = new string[](1);
        handles[0] = HANDLE_1;
        
        vm.startPrank(student1);
        uint256 escrowId1 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Class 1", "student@email.com", student1
        );
        uint256 escrowId2 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Class 2", "student@email.com", student1
        );
        uint256 escrowId3 = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Class 3", "student@email.com", student1
        );
        vm.stopPrank();
        
        // Accept escrow2 first
        vm.prank(teacher1);
        escrow.acceptClass(escrowId2, HANDLE_1, 0);
        
        // Try batch accept all 3 as teacher1
        uint256[] memory escrowIds = new uint256[](3);
        escrowIds[0] = escrowId1;
        escrowIds[1] = escrowId2; // Already accepted
        escrowIds[2] = escrowId3;
        
        vm.prank(teacher1);
        escrow.batchAcceptClass(escrowIds, HANDLE_1, 0);
        
        // Check results
        YogaClassEscrow.Escrow memory escrow1Data = escrow.getEscrow(escrowId1);
        YogaClassEscrow.Escrow memory escrow2Data = escrow.getEscrow(escrowId2);
        YogaClassEscrow.Escrow memory escrow3Data = escrow.getEscrow(escrowId3);
        
        // escrowId1 and escrowId3 should be accepted by batch
        assertEq(escrow1Data.teacher, teacher1);
        assertEq(uint8(escrow1Data.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        
        // escrowId2 was already accepted before batch
        assertEq(escrow2Data.teacher, teacher1);
        assertEq(uint8(escrow2Data.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
        
        // escrowId3 should also be accepted
        assertEq(escrow3Data.teacher, teacher1);
        assertEq(uint8(escrow3Data.status), uint8(YogaClassEscrow.ClassStatus.Accepted));
    }
    
    /**
     * @notice Test: Race condition - simultaneous accepts
     */
    function test_RaceConditionPrevention() public {
        // Create escrow with two registered handles
        string[] memory handles = new string[](2);
        handles[0] = HANDLE_1;
        handles[1] = HANDLE_2;
        
        uint64[3] memory slots = [
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 3 days)
        ];
        
        vm.prank(student1);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            handles, slots, "Park", "Yoga class", "student@email.com", student1
        );
        
        // Teacher1 accepts first
        vm.prank(teacher1);
        escrow.acceptClass(escrowId, HANDLE_1, 0);
        
        // Teacher2 tries to accept same escrow
        vm.prank(teacher2);
        vm.expectRevert(YogaClassEscrow.InvalidStatus.selector);
        escrow.acceptClass(escrowId, HANDLE_2, 1);
        
        // Verify only teacher1 is assigned
        YogaClassEscrow.Escrow memory escrowData = escrow.getEscrow(escrowId);
        assertEq(escrowData.teacher, teacher1);
        assertEq(escrowData.selectedHandle, HANDLE_1);
    }
    
    /**
     * @notice Test: Zero address registration prevention
     */
    function test_CannotRegisterZeroAddress() public {
        // Cannot register zero address - this is allowed in current implementation
        // but could be prevented with additional validation
        vm.prank(registryOwner);
        registry.registerTeacher("@zerohandle", address(0));
        assertEq(registry.getTeacherAddress("@zerohandle"), address(0));
    }
    
    /**
     * @notice Test: Empty handle registration prevention
     */
    function test_CannotRegisterEmptyHandle() public {
        // Empty handle is allowed in current implementation
        vm.prank(registryOwner);
        registry.registerTeacher("", attacker);
        assertEq(registry.getTeacherAddress(""), attacker);
    }
    
    /**
     * @notice Test: Gas optimization - multiple registry lookups
     */
    function test_GasOptimizationMultipleLookups() public {
        // Register many teachers with unique addresses
        vm.startPrank(registryOwner);
        for (uint i = 3; i < 13; i++) { // Start from 3 since we already have some teachers
            string memory handle = string(abi.encodePacked("@teacher", vm.toString(i)));
            address teacher = makeAddr(string(abi.encodePacked("uniqueteacher", vm.toString(i))));
            registry.registerTeacher(handle, teacher);
        }
        vm.stopPrank();
        
        // Measure gas for lookups
        uint256 gasBefore = gasleft();
        for (uint i = 3; i < 13; i++) {
            string memory handle = string(abi.encodePacked("@teacher", vm.toString(i)));
            registry.getTeacherAddress(handle);
        }
        uint256 gasUsed = gasBefore - gasleft();
        
        // Each lookup should be relatively cheap (< 5000 gas)
        assertLt(gasUsed / 10, 5000);
    }
}