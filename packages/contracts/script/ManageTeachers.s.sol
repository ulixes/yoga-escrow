// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/TeacherRegistry.sol";

/**
 * @title ManageTeachers
 * @notice Helper scripts for managing teachers in the TeacherRegistry
 * @dev Run with: forge script script/ManageTeachers.s.sol:FunctionName --rpc-url $RPC_URL --broadcast
 */
contract ManageTeachers is Script {
    
    // Set your deployed TeacherRegistry address here
    address constant REGISTRY_ADDRESS = address(0); // UPDATE THIS
    
    /**
     * @notice Register a single teacher
     * @dev Run: forge script script/ManageTeachers.s.sol:RegisterSingleTeacher --rpc-url $RPC_URL --broadcast
     */
    function registerSingleTeacher() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        // Example: Register a teacher
        string memory handle = "@yogamaster";
        address teacherAddress = 0x1234567890123456789012345678901234567890; // UPDATE THIS
        
        registry.registerTeacher(handle, teacherAddress);
        console2.log("Registered teacher:", handle, teacherAddress);
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Register multiple teachers in batch
     * @dev Run: forge script script/ManageTeachers.s.sol:RegisterBatchTeachers --rpc-url $RPC_URL --broadcast
     */
    function registerBatchTeachers() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        // Define teachers to register
        string[3] memory handles = [
            "@yogamaster",
            "@zenflow", 
            "@vinyasapro"
        ];
        
        address[3] memory addresses = [
            0x1234567890123456789012345678901234567890, // UPDATE THESE
            0x2345678901234567890123456789012345678901,
            0x3456789012345678901234567890123456789012
        ];
        
        // Register each teacher
        for (uint i = 0; i < handles.length; i++) {
            registry.registerTeacher(handles[i], addresses[i]);
            console2.log("Registered:", handles[i], addresses[i]);
        }
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Update a teacher's address
     * @dev Run: forge script script/ManageTeachers.s.sol:UpdateTeacherAddress --rpc-url $RPC_URL --broadcast
     */
    function updateTeacherAddress() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        string memory handle = "@yogamaster";
        address newAddress = 0x9876543210987654321098765432109876543210; // UPDATE THIS
        
        registry.updateTeacherAddress(handle, newAddress);
        console2.log("Updated teacher address for:", handle, newAddress);
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Remove a teacher from the registry
     * @dev Run: forge script script/ManageTeachers.s.sol:RemoveTeacher --rpc-url $RPC_URL --broadcast
     */
    function removeTeacher() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        string memory handle = "@compromised";
        
        registry.removeTeacher(handle);
        console2.log("Removed teacher:", handle);
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Query teacher information (read-only)
     * @dev Run: forge script script/ManageTeachers.s.sol:QueryTeacher --rpc-url $RPC_URL
     */
    function queryTeacher() external view {
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        string memory handle = "@yogamaster";
        
        address teacherAddr = registry.getTeacherAddress(handle);
        bool isRegistered = registry.isHandleRegistered(handle);
        
        console2.log("Handle:", handle);
        console2.log("Address:", teacherAddr);
        console2.log("Is Registered:", isRegistered);
    }
    
    /**
     * @notice Transfer registry ownership
     * @dev Run: forge script script/ManageTeachers.s.sol:TransferOwnership --rpc-url $RPC_URL --broadcast
     */
    function transferOwnership() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        address newOwner = 0xabCDEF1234567890ABcDEF1234567890aBCDeF12; // UPDATE THIS
        
        registry.transferOwnership(newOwner);
        console2.log("Ownership transferred to:", newOwner);
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Emergency: Pause teacher registrations by removing all
     * @dev Run: forge script script/ManageTeachers.s.sol:EmergencyPause --rpc-url $RPC_URL --broadcast
     */
    function emergencyPause() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        
        TeacherRegistry registry = TeacherRegistry(REGISTRY_ADDRESS);
        
        // List of all registered handles to remove
        string[3] memory handles = [
            "@yogamaster",
            "@zenflow",
            "@vinyasapro"
        ];
        
        for (uint i = 0; i < handles.length; i++) {
            // Check if registered before removing
            if (registry.isHandleRegistered(handles[i])) {
                registry.removeTeacher(handles[i]);
                console2.log("Removed:", handles[i]);
            }
        }
        
        console2.log("Emergency pause complete - all teachers removed");
        
        vm.stopBroadcast();
    }
}