# Teacher Registry Security System

## Overview

The Teacher Registry is a critical security component that prevents impersonation attacks in the Yoga Escrow platform. It ensures that only verified teachers can accept classes for their registered handles.

## The Security Problem Solved

### Before (Vulnerable)
- Any wallet could call `acceptClass()` with a valid teacher handle
- Attackers could steal payments by impersonating teachers
- No verification of handle ownership

### After (Secure)
- Only registered wallet addresses can accept classes for their handles
- Cryptographic proof of identity through wallet signatures
- Complete prevention of impersonation attacks

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│ TeacherRegistry │◀────────│ YogaClassEscrow │
└─────────────────┘         └─────────────────┘
        │                           │
        │ getTeacherAddress()       │ acceptClass()
        ▼                           ▼
   ┌──────────┐              ┌──────────┐
   │ Registry │              │  Escrow  │
   │   Owner  │              │ Student  │
   └──────────┘              └──────────┘
```

## Deployment Instructions

### 1. Deploy Contracts

```bash
cd packages/contracts
source .env  # Ensure PRIVATE_KEY is set
./Deploy.sh
```

This will deploy:
1. TeacherRegistry (deployed first)
2. YogaClassEscrow (deployed with registry address)

### 2. Register Teachers

After deployment, the registry owner must register each teacher:

```solidity
// Example registration script
registry.registerTeacher("@yogamaster", 0x123...);
registry.registerTeacher("@zenflow", 0x456...);
registry.registerTeacher("@vinyasapro", 0x789...);
```

## Teacher Management Operations

### Register a New Teacher
```solidity
function registerTeacher(string calldata handle, address teacherAddress)
```
- Only callable by owner
- Links a handle to a wallet address
- Each handle and address must be unique

### Update Teacher Address
```solidity
function updateTeacherAddress(string calldata handle, address newTeacherAddress)
```
- Updates the wallet address for an existing handle
- Useful for key rotation or wallet migration

### Remove a Teacher
```solidity
function removeTeacher(string calldata handle)
```
- Completely removes a teacher from the registry
- The handle becomes available for re-registration

### Query Functions
```solidity
getTeacherAddress(handle)     // Get address for a handle
getTeacherHandle(address)     // Get handle for an address  
isHandleRegistered(handle)    // Check if handle exists
isTeacherRegistered(address)  // Check if address is registered
```

## Security Guarantees

### 1. Identity Verification
- Only the exact wallet registered for a handle can accept classes
- Prevents any form of handle spoofing or impersonation

### 2. Access Control
- Registry modifications restricted to owner only
- Teachers cannot modify their own or others' registrations

### 3. Atomic Operations
- All registry updates are atomic and immediately effective
- No race conditions or partial states

### 4. Backward Compatibility
- Existing escrows continue to function
- No migration required for pending escrows

## Integration Flow

### Student Creates Escrow
1. Student specifies teacher handles (e.g., ["@yogamaster", "@zenflow"])
2. Escrow is created with these handle options
3. No registry check at creation time (handles might be registered later)

### Teacher Accepts Class
1. Teacher calls `acceptClass(escrowId, handle, timeIndex)`
2. Contract verifies handle is in the escrow's options
3. Contract queries registry: `getTeacherAddress(handle)`
4. Contract verifies `msg.sender == registeredAddress`
5. If all checks pass, teacher is assigned to the escrow

### Security Check Failures
- `HandleMismatch`: Handle not in escrow's teacher options
- `HandleNotRegistered`: Handle not in registry
- `UnauthorizedTeacher`: Caller is not the registered address

## Best Practices

### For Registry Owners
1. **Verify Teacher Identity**: Always verify real-world identity before registration
2. **Use Multi-Sig**: Consider using a multi-sig wallet as registry owner
3. **Keep Records**: Maintain off-chain records of verifications
4. **Regular Audits**: Periodically audit registered teachers

### For Teachers
1. **Secure Your Wallet**: Use hardware wallets for teacher addresses
2. **Monitor Registry**: Watch for unauthorized changes to your registration
3. **Key Rotation**: Update your address if wallet is compromised

### For Students
1. **Verify Handles**: Check that teacher handles are registered before creating escrows
2. **Use Known Teachers**: Only book with verified, registered teachers
3. **Report Issues**: Report any suspicious activity to platform administrators

## Emergency Procedures

### Compromised Teacher Wallet
1. Owner immediately calls `removeTeacher(handle)` 
2. Teacher generates new wallet
3. Owner calls `registerTeacher(handle, newAddress)`
4. Existing accepted escrows remain unaffected

### Lost Owner Access
1. Deploy new registry with backup owner
2. Re-register all teachers
3. Deploy new escrow contract with new registry
4. Migrate platform to use new contracts

## Gas Costs

Typical gas costs for operations:
- `registerTeacher`: ~70,000 gas
- `updateTeacherAddress`: ~40,000 gas  
- `removeTeacher`: ~30,000 gas
- `getTeacherAddress`: ~30,000 gas (view function)

## Contract Addresses

After deployment, record these addresses:
- TeacherRegistry: `0x...`
- YogaClassEscrow: `0x...`
- Owner: `0x...`

## Verification

To verify the deployment:
```bash
forge verify-contract <REGISTRY_ADDRESS> TeacherRegistry --chain base-sepolia
forge verify-contract <ESCROW_ADDRESS> YogaClassEscrow --chain base-sepolia
```

## Support

For issues or questions:
- Review test files for implementation examples
- Check `test/TeacherRegistry.t.sol` for usage patterns
- Run `forge test -vvv` for detailed test output