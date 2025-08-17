#!/bin/bash

# Register Teacher Script
# Usage: ./register_teacher.sh @handle 0xaddress

if [ $# -ne 2 ]; then
    echo "Usage: $0 @handle 0xaddress"
    echo "Example: $0 @ulyx.es 0xEfA5E984299DC59dd1e86137a74b152e3CCd019e"
    exit 1
fi

HANDLE="$1"
ADDRESS="$2"
source .env.dev

echo "Registering teacher: $HANDLE -> $ADDRESS"

cast send $TEACHER_REGISTRY_ADDRESS "registerTeacher(string,address)" "$HANDLE" "$ADDRESS" --rpc-url $RPC_BASE_SEPOLIA --private-key $PRIVATE_KEY

echo "Done. Verify with: ./verify_teacher.sh $HANDLE"
