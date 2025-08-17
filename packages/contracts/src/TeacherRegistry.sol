// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TeacherRegistry
 * @notice Maps teacher handles (e.g., "@yogamaster") to their verified wallet addresses.
 * @dev Only the owner can add or update teacher mappings to ensure authenticity.
 */
contract TeacherRegistry is Ownable {
    mapping(string => address) private _teacherAddresses;
    mapping(address => string) private _teacherHandles;

    event TeacherRegistered(string indexed handle, address indexed teacherAddress);
    event TeacherUpdated(string indexed handle, address indexed newTeacherAddress);
    event TeacherRemoved(string indexed handle);

    error HandleAlreadyRegistered(string handle);
    error AddressAlreadyRegistered(address teacherAddress);
    error HandleNotRegistered(string handle);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Owner registers a new teacher, linking their handle to their address.
     */
    function registerTeacher(string calldata handle, address teacherAddress) external onlyOwner {
        if (_teacherAddresses[handle] != address(0)) {
            revert HandleAlreadyRegistered(handle);
        }
        if (bytes(_teacherHandles[teacherAddress]).length != 0) {
            revert AddressAlreadyRegistered(teacherAddress);
        }
        
        _teacherAddresses[handle] = teacherAddress;
        _teacherHandles[teacherAddress] = handle;
        emit TeacherRegistered(handle, teacherAddress);
    }
    
    /**
     * @notice Owner updates the address for an existing teacher handle.
     */
    function updateTeacherAddress(string calldata handle, address newTeacherAddress) external onlyOwner {
        address oldAddress = _teacherAddresses[handle];
        if (oldAddress == address(0)) {
            revert HandleNotRegistered(handle);
        }

        delete _teacherHandles[oldAddress];
        _teacherAddresses[handle] = newTeacherAddress;
        _teacherHandles[newTeacherAddress] = handle;
        emit TeacherUpdated(handle, newTeacherAddress);
    }
    
    /**
     * @notice Owner removes a teacher from the registry.
     */
    function removeTeacher(string calldata handle) external onlyOwner {
        address teacherAddress = _teacherAddresses[handle];
        if (teacherAddress == address(0)) {
            revert HandleNotRegistered(handle);
        }

        delete _teacherAddresses[handle];
        delete _teacherHandles[teacherAddress];
        emit TeacherRemoved(handle);
    }
    
    /**
     * @notice Public view function to get the address for a given handle.
     */
    function getTeacherAddress(string calldata handle) external view returns (address) {
        return _teacherAddresses[handle];
    }

    /**
     * @notice Public view function to get the handle for a given address.
     */
    function getTeacherHandle(address teacherAddress) external view returns (string memory) {
        return _teacherHandles[teacherAddress];
    }

    /**
     * @notice Check if a handle is registered
     */
    function isHandleRegistered(string calldata handle) external view returns (bool) {
        return _teacherAddresses[handle] != address(0);
    }

    /**
     * @notice Check if an address is registered as a teacher
     */
    function isTeacherRegistered(address teacherAddress) external view returns (bool) {
        return bytes(_teacherHandles[teacherAddress]).length > 0;
    }
}