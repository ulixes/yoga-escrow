# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yoga Escrow is a smart contract-based escrow system for booking yoga classes with ETH. It consists of:
- A Solidity smart contract for managing escrow transactions
- Two React frontends (teacher and student apps) 
- Shared UI components library
- Monorepo managed with Turbo and Bun

## Development Commands

### Monorepo Commands (Root Directory)
```bash
bun install                  # Install all dependencies
bun run dev                  # Run both apps (teacher: 5173, student: 5174)
bun run build               # Build all packages
bun run test                # Run tests across all packages
bun run lint                # Lint all packages
bun run format              # Format all packages
```

### Smart Contract Commands (packages/contracts)
```bash
cd packages/contracts
forge build                 # Compile contracts
forge test                  # Run all tests
forge test -vvv            # Run tests with verbose output
forge test --watch         # Run tests in watch mode
forge test --gas-report    # Run tests with gas reporting
forge fmt                  # Format Solidity code
forge snapshot             # Generate gas snapshots
forge clean                # Clean build artifacts
anvil                      # Start local Ethereum node
```

### Deploy Contract
```bash
cd packages/contracts
source .env                # Load environment variables
./Deploy.sh               # Deploy to configured network
```

## Architecture

### Contract Structure
- **Main Contract**: `packages/contracts/src/EscrowOfferETH.sol`
  - Uses OpenZeppelin's ReentrancyGuard for security
  - Manages offer lifecycle: Created → Accepted → Completed/Cancelled/Disputed
  - Auto-release mechanism after completion window expires

### Key Contract Functions
- `createOffer()`: Buyer creates offer with ETH, teacher handles, and time slots
- `acceptOffer()`: Teacher accepts offer by selecting slot and matching handle
- `complete()`: Buyer releases funds to teacher
- `cancelBeforeAccept()`: Buyer cancels before acceptance
- `autoRelease()`: Anyone can trigger after completion window
- `dispute()`: Either party can mark dispute

### Frontend Apps
- **Teacher App** (`apps/teacher`): Port 5173, Vite + React + TypeScript
- **Student App** (`apps/student`): Port 5174, Vite + React + TypeScript
- **Shared UI** (`packages/ui`): Component library used by both apps

### Testing Approach
- Smart contracts use Foundry testing framework
- Test file: `packages/contracts/test/EscrowOfferETH.t.sol`
- Frontend apps currently have placeholder test scripts

## Environment Setup
For contract deployment, create `packages/contracts/.env`:
- `PRIVATE_KEY`: Deployer wallet private key
- `RPC_BASE_SEPOLIA`: RPC endpoint URL
- `ETHERSCAN_API_KEY`: For contract verification (optional)

## Important Notes
- Never commit real private keys or secrets
- Contract uses Solidity 0.8.26 targeting Cancun EVM
- Monorepo uses Bun as package manager (v1.1.14)
- All workspace packages are TypeScript-based