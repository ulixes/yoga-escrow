#!/bin/bash

# Verify Teacher Script
# Usage: ./verify_teacher.sh @teacherhandle [expected_address]

if [ $# -eq 0 ]; then
    echo "Usage: $0 @teacherhandle [expected_address]"
    echo "Example: $0 @ulyx.es"
    echo "Example: $0 @ulyx.es 0xEfA5E984299DC59dd1e86137a74b152e3CCd019e"
    exit 1
fi

HANDLE="$1"
EXPECTED_ADDRESS="$2"
source .env.dev

echo "Checking teacher: $HANDLE"
echo "Registry: $TEACHER_REGISTRY_ADDRESS"
echo ""

# Check if registered
IS_REGISTERED=$(cast call $TEACHER_REGISTRY_ADDRESS "isHandleRegistered(string)(bool)" "$HANDLE" --rpc-url $RPC_BASE_SEPOLIA)
echo "Registered: $IS_REGISTERED"

if [ "$IS_REGISTERED" = "true" ]; then
    # Get teacher address
    TEACHER_ADDRESS=$(cast call $TEACHER_REGISTRY_ADDRESS "getTeacherAddress(string)(address)" "$HANDLE" --rpc-url $RPC_BASE_SEPOLIA)
    echo "Address: $TEACHER_ADDRESS"
    
    # If expected address provided, verify match
    if [ -n "$EXPECTED_ADDRESS" ]; then
        if [ "$TEACHER_ADDRESS" = "$EXPECTED_ADDRESS" ]; then
            echo "✅ VERIFIED: Handle matches expected wallet"
        else
            echo "❌ MISMATCH: Handle registered to different wallet"
            echo "Expected: $EXPECTED_ADDRESS"
            echo "Actual:   $TEACHER_ADDRESS"
        fi
    fi
else
    echo "❌ Teacher not found in registry"
fi
