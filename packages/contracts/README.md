# Yoga Class Escrow Smart Contract

## Overview

The YogaClassEscrow smart contract is a decentralized escrow system for booking yoga classes with ETH payments. It ensures secure transactions between students and teachers with built-in dispute resolution and automatic payment release mechanisms.

## Contract Architecture

### Main Contract: `YogaClassEscrow.sol`

Located at: `src/YogaClassEscrow.sol`

The contract manages the complete lifecycle of yoga class bookings:
1. **Booking Creation** - Students create bookings with ETH payment
2. **Teacher Confirmation** - Teachers accept bookings by selecting time and yoga type
3. **Payment Release** - Manual or automatic release after class completion
4. **Dispute Resolution** - Either party can raise disputes if needed

## Key Features

### 1. Booking Requirements
Each booking requires exactly:
- **3 Time Slots** - Student provides 3 possible class times
- **3 Yoga Types** - Student selects from Hatha, Vinyasa, or Ashtanga
- **3 Teacher Handles** - Student specifies acceptable teacher social handles

### 2. Yoga Types
```solidity
enum YogaType {
    Hatha,     // Gentle, slow-paced stretching
    Vinyasa,   // Flow-based, dynamic movement
    Ashtanga   // Structured, athletic practice
}
```

### 3. Booking Status Flow
```
Pending → Confirmed → Completed
   ↓         ↓           
Cancelled  Disputed    
```

### 4. Security Features
- Uses OpenZeppelin's `ReentrancyGuard` for reentrancy protection
- Custom modifiers for access control
- Safe ETH transfers with proper error handling

## Development Setup

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Node.js and Bun package manager
- Git

### Installation
```bash
# From the contracts directory
cd packages/contracts

# Install dependencies
forge install

# Build contracts
forge build
```

### Environment Configuration
Create `.env` file in `packages/contracts/`:
```env
PRIVATE_KEY=your_private_key_here
RPC_BASE_SEPOLIA=https://sepolia.base.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Testing

### Run Tests
```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run with gas reporting
forge test --gas-report

# Watch mode for development
forge test --watch
```

### Test Coverage
The test suite (`test/YogaClassEscrow.t.sol`) covers:
- Booking creation with validation
- Teacher confirmation process
- Payment completion and release
- Booking cancellation and refunds
- Automatic payment release after deadline
- Dispute raising mechanism
- Input validation (exactly 3 options required)

## Deployment

### Deploy to Base Sepolia
```bash
# Load environment variables
source .env

# Run deployment script
forge script script/Deploy.s.sol --rpc-url $RPC_BASE_SEPOLIA --broadcast --verify
```

### Deployment Script
The deployment script (`script/Deploy.s.sol`) will:
1. Deploy the YogaClassEscrow contract
2. Log the deployed contract address
3. Verify on Etherscan (if API key provided)

## Contract Interface

### For Students

#### Create Booking
```solidity
function createBooking(
    string[] calldata teacherHandles,  // Exactly 3 handles
    TimeSlot[] calldata availableSlots, // Exactly 3 time slots
    YogaType[] calldata yogaTypes,      // Exactly 3 yoga types
    uint32 acceptanceDeadline,          // Seconds for teacher to accept
    uint32 completionWindow             // Seconds after class to complete
) external payable returns (uint256 bookingId)
```

#### Complete Class
```solidity
function completeClass(uint256 bookingId) external
```

#### Cancel Booking
```solidity
function cancelBooking(uint256 bookingId) external
```

### For Teachers

#### Confirm Booking
```solidity
function confirmBooking(
    uint256 bookingId,
    uint8 slotIndex,        // 0, 1, or 2
    uint8 yogaTypeIndex,    // 0, 1, or 2
    string calldata teacherHandle
) external
```

### For Anyone

#### Automatic Payment Release
```solidity
function automaticPaymentRelease(uint256 bookingId) external
```

#### Raise Dispute
```solidity
function raiseDispute(uint256 bookingId) external
```

## Gas Optimization

The contract is optimized for gas efficiency:
- Uses `uint8` for small values (indices)
- Packs struct fields efficiently
- Constants for repeated values
- Minimal storage operations

## Security Considerations

1. **Reentrancy Protection**: All state-changing functions use `nonReentrant` modifier
2. **Access Control**: Custom modifiers ensure only authorized parties can execute functions
3. **Payment Safety**: Funds are locked in contract until proper conditions are met
4. **Time Constraints**: Deadlines prevent indefinite fund locking

## Migration from Previous Version

### Changes from EscrowOfferETH to YogaClassEscrow

#### Naming Improvements
- `Offer` → `ClassBooking`
- `buyer` → `student`
- `amountWei` → `paymentAmount`
- `createOffer` → `createBooking`
- `acceptOffer` → `confirmBooking`

#### New Features
- Added YogaType enum with 3 yoga styles
- Enforced exactly 3 options for all choices
- Clearer status names (Pending, Confirmed, etc.)
- Helper function for yoga type names

#### Removed Complexity
- Simplified variable names
- More intuitive function names
- Better organized code structure

## Troubleshooting

### Common Issues

1. **"Exactly 3 teacher handles required"**
   - Ensure you're passing exactly 3 handles, not more or less

2. **"Payment required"**
   - Include ETH value when calling `createBooking`

3. **"Acceptance deadline passed"**
   - Teacher must confirm within the specified deadline

4. **Compilation errors**
   - Ensure Solidity version 0.8.26 is installed
   - Run `forge clean` then `forge build`

## Future Improvements

Potential enhancements for next iterations:
- [ ] Multi-token payment support (USDC, DAI)
- [ ] Reputation system for teachers
- [ ] Batch booking functionality
- [ ] On-chain reviews and ratings
- [ ] Integration with calendar protocols
- [ ] Teacher availability management

## Support

For issues or questions:
- Check test files for usage examples
- Review the contract comments
- Open an issue in the repository

## License

MIT License - See LICENSE file for details