# Migration Guide: YogaClassEscrow Security Update

## Critical Security Update - TeacherRegistry Integration

**⚠️ URGENT**: The original YogaClassEscrow contract has a critical vulnerability where any address can impersonate a teacher by providing the correct handle string. This guide covers migrating to the secured version with TeacherRegistry.

## Overview
This guide covers two migrations:
1. **CRITICAL**: Security update with TeacherRegistry integration
2. Historical refactoring from `EscrowOfferETH.sol` to `YogaClassEscrow.sol`

## Part 1: Security Migration (CRITICAL)

### The Vulnerability
In the original implementation, the `acceptClass` function only checks if the provided handle matches one in the escrow:
```solidity
// VULNERABLE CODE - DO NOT USE
if (keccak256(bytes(escrow.teacherHandles[i])) == keccak256(bytes(teacherHandle))) {
    escrow.teacher = msg.sender; // ANY address can become the teacher!
}
```

### The Solution: TeacherRegistry
The new system requires teachers to be registered in a separate TeacherRegistry contract:
```solidity
// SECURE CODE
address registeredTeacher = teacherRegistry.getTeacherAddress(teacherHandle);
require(msg.sender == registeredTeacher, "UnauthorizedTeacher");
```

### Migration Steps

#### Step 1: Deploy New Contracts
```bash
cd packages/contracts
source .env
./Deploy.sh
```
This deploys:
1. TeacherRegistry (deployed first)
2. YogaClassEscrow (with registry address)

#### Step 2: Register All Teachers
```solidity
// Script to register existing teachers
registry.registerTeacher("@yogamaster", 0x123...);
registry.registerTeacher("@zenflow", 0x456...);
// Register all active teachers
```

#### Step 3: Update Frontend
```javascript
// Update contract addresses
const REGISTRY_ADDRESS = "0x...new registry...";
const ESCROW_ADDRESS = "0x...new escrow...";

// No API changes needed - same functions work
```

#### Step 4: Handle Existing Escrows
For escrows on the old contract:
1. **Pending Escrows**: Create new ones on secured contract
2. **Accepted Escrows**: Let them complete on old contract
3. **Set Sunset Date**: Stop accepting new escrows on old contract

### Verification Checklist
- [ ] TeacherRegistry deployed and owner set
- [ ] All teachers registered with correct addresses
- [ ] New YogaClassEscrow deployed with registry address
- [ ] Frontend updated with new addresses
- [ ] Old contract disabled for new escrows
- [ ] Users notified of migration

## Part 2: Historical Refactoring Changes

### 1. Contract Name and Purpose
- **Old**: `EscrowOfferETH` - Generic escrow contract
- **New**: `YogaClassEscrow` - Domain-specific for yoga class bookings

### 2. Terminology Updates

| Old Term | New Term | Rationale |
|----------|----------|-----------|
| `Offer` | `ClassBooking` | More descriptive of the yoga class context |
| `buyer` | `student` | Clear role in yoga class context |
| `teacher` | `teacher` | Unchanged (already clear) |
| `amountWei` | `paymentAmount` | Simpler, still clear it's in wei |
| `createdAt` | `createdTimestamp` | More explicit naming |
| `acceptWindowSecs` | `acceptanceDeadline` | Clearer purpose |
| `completeWindowSecs` | `completionWindow` | Consistent naming pattern |
| `handlesLower` | `teacherHandles` | More specific |
| `slots` | `availableSlots` | Clearer meaning |
| `chosenSlot` | `selectedSlotIndex` | More descriptive |

### 3. Status Enum Changes

```solidity
// Old
enum Status { 
    Created, 
    Accepted, 
    Completed, 
    Cancelled, 
    Disputed 
}

// New  
enum BookingStatus { 
    Pending,     // Was: Created
    Confirmed,   // Was: Accepted
    Completed,   // Unchanged
    Cancelled,   // Unchanged
    Disputed     // Unchanged
}
```

### 4. New Feature: Yoga Types

Added yoga type selection:
```solidity
enum YogaType {
    Hatha,     // Gentle, slow-paced
    Vinyasa,   // Flow-based, dynamic
    Ashtanga   // Structured, athletic
}
```

Each booking now includes:
- `YogaType[] yogaTypes` - 3 yoga type options
- `uint8 selectedYogaType` - Teacher's selection

### 5. Strict Validation Rules

**Old**: Flexible 1-3 options
```solidity
require(handlesLower.length > 0 && handlesLower.length <= 3, "1..3 handles");
require(slots.length > 0 && slots.length <= 3, "1..3 slots");
```

**New**: Exactly 3 options required
```solidity
require(teacherHandles.length == MAX_OPTIONS, "Exactly 3 teacher handles required");
require(availableSlots.length == MAX_OPTIONS, "Exactly 3 time slots required");
require(yogaTypes.length == MAX_OPTIONS, "Exactly 3 yoga types required");
```

### 6. Function Name Changes

| Old Function | New Function | Changes |
|--------------|--------------|---------|
| `createOffer()` | `createBooking()` | Added yoga types parameter |
| `acceptOffer()` | `confirmBooking()` | Added yoga type selection |
| `complete()` | `completeClass()` | More descriptive name |
| `cancelBeforeAccept()` | `cancelBooking()` | Simpler name |
| `autoRelease()` | `automaticPaymentRelease()` | Clearer purpose |
| `dispute()` | `raiseDispute()` | More action-oriented |

### 7. Struct Changes

**Old Offer struct**:
```solidity
struct Offer {
    address buyer;
    address teacher;
    uint256 amountWei;
    Status status;
    uint64 createdAt;
    uint32 acceptWindowSecs;
    uint32 completeWindowSecs;
    string[] handlesLower;
    Slot[] slots;
    uint8 chosenSlot;
}
```

**New ClassBooking struct**:
```solidity
struct ClassBooking {
    address student;              // renamed from buyer
    address teacher;
    uint256 paymentAmount;        // renamed from amountWei
    BookingStatus status;          // new enum type
    uint64 createdTimestamp;      // renamed from createdAt
    uint32 acceptanceDeadline;    // renamed from acceptWindowSecs
    uint32 completionWindow;      // renamed from completeWindowSecs
    string[] teacherHandles;      // renamed from handlesLower
    TimeSlot[] availableSlots;    // renamed from slots
    YogaType[] yogaTypes;         // NEW: yoga type options
    uint8 selectedSlotIndex;      // renamed from chosenSlot
    uint8 selectedYogaType;       // NEW: selected yoga type
}
```

## Integration Changes Required

### 1. Frontend Updates

Update booking creation calls:
```javascript
// Old
await contract.createOffer(
    handles,
    slots,
    acceptWindow,
    completeWindow,
    { value: ethAmount }
);

// New
await contract.createBooking(
    handles,           // Must be exactly 3
    slots,            // Must be exactly 3
    yogaTypes,        // NEW: Must be exactly 3
    acceptWindow,
    completeWindow,
    { value: ethAmount }
);
```

Update booking confirmation:
```javascript
// Old
await contract.acceptOffer(offerId, slotIndex, handle);

// New
await contract.confirmBooking(
    bookingId,
    slotIndex,
    yogaTypeIndex,    // NEW: yoga type selection
    handle
);
```

### 2. Event Listening

Update event names and parameters:
```javascript
// Old events
contract.on("OfferCreated", (offerId, buyer, amount, ...) => {});
contract.on("OfferAccepted", (offerId, teacher, slotIdx, handle) => {});

// New events
contract.on("BookingCreated", (bookingId, student, amount, ...) => {});
contract.on("BookingConfirmed", (bookingId, teacher, slotIdx, yogaTypeIdx, handle) => {});
```

### 3. Status Checks

Update status comparisons:
```javascript
// Old
if (offer.status === 0) // Created
if (offer.status === 1) // Accepted

// New
if (booking.status === 0) // Pending
if (booking.status === 1) // Confirmed
```

## Testing Updates

### Required Test Changes

1. **Update import statements**:
```solidity
// Old
import "../src/EscrowOfferETH.sol";

// New
import "../src/YogaClassEscrow.sol";
```

2. **Add yoga type arrays to test data**:
```solidity
YogaType[] memory yogaTypes = new YogaType[](3);
yogaTypes[0] = YogaType.Hatha;
yogaTypes[1] = YogaType.Vinyasa;
yogaTypes[2] = YogaType.Ashtanga;
```

3. **Update function calls with new parameters**:
```solidity
// Confirmation now requires yoga type selection
escrow.confirmBooking(bookingId, slotIndex, yogaTypeIndex, handle);
```

## Deployment Changes

Update deployment scripts:
```solidity
// Old (Deploy.s.sol)
EscrowOfferETH esc = new EscrowOfferETH();

// New
YogaClassEscrow escrow = new YogaClassEscrow();
```

## Benefits of Migration

1. **Clearer Code**: Domain-specific naming makes code more readable
2. **Enhanced Features**: Yoga type selection adds business value
3. **Stricter Validation**: Exactly 3 options prevents edge cases
4. **Better Documentation**: Comprehensive NatSpec comments
5. **Improved Testing**: More thorough test coverage

## Rollback Considerations

If you need to maintain backward compatibility:
1. Keep both contracts deployed
2. Implement a migration function to move active bookings
3. Maintain dual frontend support during transition
4. Set a sunset date for the old contract

## Questions?

For migration support:
- Review the test files for implementation examples
- Check the README.md for complete documentation
- Test thoroughly on testnet before mainnet deployment