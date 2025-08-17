// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/TeacherRegistry.sol";

contract TeacherRegistryTest is Test {
    TeacherRegistry public registry;
    address public owner;
    address public teacher1;
    address public teacher2;
    address public unauthorized;

    string constant TEACHER1_HANDLE = "@yogamaster";
    string constant TEACHER2_HANDLE = "@zenflow";
    string constant NONEXISTENT_HANDLE = "@fake";

    event TeacherRegistered(string indexed handle, address indexed teacherAddress);
    event TeacherUpdated(string indexed handle, address indexed newTeacherAddress);
    event TeacherRemoved(string indexed handle);

    function setUp() public {
        owner = makeAddr("owner");
        teacher1 = makeAddr("teacher1");
        teacher2 = makeAddr("teacher2");
        unauthorized = makeAddr("unauthorized");

        vm.prank(owner);
        registry = new TeacherRegistry(owner);
    }

    function testDeployment() public {
        assertEq(registry.owner(), owner);
    }

    function testRegisterTeacher() public {
        vm.prank(owner);
        vm.expectEmit(true, true, false, false);
        emit TeacherRegistered(TEACHER1_HANDLE, teacher1);
        
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);

        assertEq(registry.getTeacherAddress(TEACHER1_HANDLE), teacher1);
        assertEq(registry.getTeacherHandle(teacher1), TEACHER1_HANDLE);
        assertTrue(registry.isHandleRegistered(TEACHER1_HANDLE));
        assertTrue(registry.isTeacherRegistered(teacher1));
    }

    function testRegisterTeacherOnlyOwner() public {
        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", unauthorized));
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
    }

    function testRegisterDuplicateHandleReverts() public {
        vm.startPrank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
        
        vm.expectRevert(abi.encodeWithSignature("HandleAlreadyRegistered(string)", TEACHER1_HANDLE));
        registry.registerTeacher(TEACHER1_HANDLE, teacher2);
        vm.stopPrank();
    }

    function testRegisterDuplicateAddressReverts() public {
        vm.startPrank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
        
        vm.expectRevert(abi.encodeWithSignature("AddressAlreadyRegistered(address)", teacher1));
        registry.registerTeacher(TEACHER2_HANDLE, teacher1);
        vm.stopPrank();
    }

    function testUpdateTeacherAddress() public {
        vm.startPrank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
        
        vm.expectEmit(true, true, false, false);
        emit TeacherUpdated(TEACHER1_HANDLE, teacher2);
        
        registry.updateTeacherAddress(TEACHER1_HANDLE, teacher2);
        vm.stopPrank();

        assertEq(registry.getTeacherAddress(TEACHER1_HANDLE), teacher2);
        assertEq(registry.getTeacherHandle(teacher2), TEACHER1_HANDLE);
        assertEq(registry.getTeacherHandle(teacher1), "");
        assertFalse(registry.isTeacherRegistered(teacher1));
        assertTrue(registry.isTeacherRegistered(teacher2));
    }

    function testUpdateNonexistentHandleReverts() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSignature("HandleNotRegistered(string)", NONEXISTENT_HANDLE));
        registry.updateTeacherAddress(NONEXISTENT_HANDLE, teacher1);
    }

    function testUpdateTeacherAddressOnlyOwner() public {
        vm.prank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);

        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", unauthorized));
        registry.updateTeacherAddress(TEACHER1_HANDLE, teacher2);
    }

    function testRemoveTeacher() public {
        vm.startPrank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
        
        vm.expectEmit(true, false, false, false);
        emit TeacherRemoved(TEACHER1_HANDLE);
        
        registry.removeTeacher(TEACHER1_HANDLE);
        vm.stopPrank();

        assertEq(registry.getTeacherAddress(TEACHER1_HANDLE), address(0));
        assertEq(registry.getTeacherHandle(teacher1), "");
        assertFalse(registry.isHandleRegistered(TEACHER1_HANDLE));
        assertFalse(registry.isTeacherRegistered(teacher1));
    }

    function testRemoveNonexistentTeacherReverts() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSignature("HandleNotRegistered(string)", NONEXISTENT_HANDLE));
        registry.removeTeacher(NONEXISTENT_HANDLE);
    }

    function testRemoveTeacherOnlyOwner() public {
        vm.prank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);

        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", unauthorized));
        registry.removeTeacher(TEACHER1_HANDLE);
    }

    function testMultipleTeachers() public {
        vm.startPrank(owner);
        registry.registerTeacher(TEACHER1_HANDLE, teacher1);
        registry.registerTeacher(TEACHER2_HANDLE, teacher2);
        vm.stopPrank();

        assertEq(registry.getTeacherAddress(TEACHER1_HANDLE), teacher1);
        assertEq(registry.getTeacherAddress(TEACHER2_HANDLE), teacher2);
        assertEq(registry.getTeacherHandle(teacher1), TEACHER1_HANDLE);
        assertEq(registry.getTeacherHandle(teacher2), TEACHER2_HANDLE);
    }

    function testGetNonexistentData() public {
        assertEq(registry.getTeacherAddress(NONEXISTENT_HANDLE), address(0));
        assertEq(registry.getTeacherHandle(teacher1), "");
        assertFalse(registry.isHandleRegistered(NONEXISTENT_HANDLE));
        assertFalse(registry.isTeacherRegistered(teacher1));
    }

    function testFuzzRegisterTeacher(string calldata handle, address teacherAddr) public {
        vm.assume(bytes(handle).length > 0);
        vm.assume(teacherAddr != address(0));
        
        vm.prank(owner);
        registry.registerTeacher(handle, teacherAddr);

        assertEq(registry.getTeacherAddress(handle), teacherAddr);
        assertEq(registry.getTeacherHandle(teacherAddr), handle);
        assertTrue(registry.isHandleRegistered(handle));
        assertTrue(registry.isTeacherRegistered(teacherAddr));
    }
}