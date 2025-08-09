## Yoga Escrow (ETH)

Smart-contract escrow for booking yoga classes with ETH. A buyer creates an offer with candidate teacher handles and up to three time slots, locking ETH in the contract. A teacher accepts by selecting a slot and matching one of the proposed handles. The buyer can mark the class completed to release funds, or funds auto‑release after a completion window. Cancellation is allowed before acceptance; either party can mark a dispute while accepted.

Built with Foundry and OpenZeppelin’s `ReentrancyGuard`. Solidity 0.8.26.

## Monorepo Layout (Turbo + Bun)

- `apps/teacher`: Vite + React + TS app for yoga teachers.
- `apps/student`: Vite + React + TS app for students.
- `packages/ui`: Shared React components used by both apps.
- `packages/contracts`: Foundry smart contracts project.

Run monorepo scripts with Bun and Turbo:

```bash
bun install
bun run dev   # runs both apps in parallel (5173 teacher, 5174 student)
bun run build # builds all workspaces
```

## Developer Paths (choose your role)

### 1) Solidity contract developer

- **Scope**: Own `EscrowOfferETH` design, safety, tests, gas efficiency, and deployment scripts.
- **Focus folders**: `packages/contracts/src`, `packages/contracts/test`, `packages/contracts/script`.
- **Key files**:
  - `packages/contracts/src/EscrowOfferETH.sol`
  - `packages/contracts/test/EscrowOfferETH.t.sol`
  - `packages/contracts/script/Deploy.s.sol`
- **Tasks**:
  - Extend offer lifecycle if needed (escrow fees, partial refunds, mediation flow).
  - Harden invariants and add test coverage (failure paths, disputes, edge timestamps).
  - Maintain events and ABI stability for dApp integration.
  - Coordinate network deployments and address registry for apps.

### 2) dApp developer — Teacher flow

- **Scope**: Build the teacher-facing app UI and wire it to the contract ABI.
- **Focus folders**: `apps/teacher` (Vite + React + TS), `packages/ui` for shared components.
- **Primary flows**:
  1. Teacher logs in and sets up a wallet using Privy; verify ownership of their Instagram handle.
  2. Teacher sees offers addressed to their verified wallet + IG handle.
  3. Teacher accepts or rejects an offer; understands when/how funds are released from escrow.
- **Contract integration (EscrowOfferETH)**:
  - Read offers: `getOffer(offerId)`, `getSlots(offerId)`, `getHandles(offerId)`.
  - Accept offer: `acceptOffer(offerId, slotIdx, handleLower)`.
  - Observe status changes via events: `OfferAccepted`, `OfferCompleted`, `OfferCancelled`, `OfferDisputed`.
- **Recommended stack**: `viem` or `ethers`, `wagmi`, Privy SDK.
- **ABI source**: After `forge build`, import from `packages/contracts/out/EscrowOfferETH.sol/EscrowOfferETH.json`.
- **Example (viem)**:

```ts
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import abi from '@yoga/contracts/out/EscrowOfferETH.sol/EscrowOfferETH.json'

const client = createPublicClient({ chain: baseSepolia, transport: http(process.env.VITE_RPC_URL) })
const escrow = { address: '0xff93f3213a8dfaebb27b28ec1eb146c5db10623a' as `0x${string}`, abi: (abi as any).abi }

// read
const offer = await client.readContract({ ...escrow, functionName: 'getOffer', args: [123n] })

// write (via wallet client)
// await walletClient.writeContract({ ...escrow, functionName: 'acceptOffer', args: [123n, 1, 'heatflow.studio'] })
```

- **Privy**: Implement login + wallet with the Privy SDK, then gate actions by `msg.sender` expectations. See the Privy guides at the official docs.
- **IG handle verification**: Off-chain verification flow (e.g., signed message + IG bio/post containing a verification code) that maps IG handle → wallet address. Contract only matches on `handleLower` strings supplied by the buyer.

### 3) dApp developer — Student flow

- **Scope**: Build the student-facing app UI and connect it to the contract ABI.
- **Focus folders**: `apps/student` (Vite + React + TS), `packages/ui` for shared components.
- **Primary flows**:
  1. Student logs in with Privy and has a wallet.
  2. Student creates an offer by proposing 1–3 IG handles and 1–3 time slots; sends ETH into escrow.
  3. Student views/filters offers, cancels before acceptance, or marks class completed to release funds.
- **Contract integration (EscrowOfferETH)**:
  - Create offer: `createOffer(handlesLower[], slots[], acceptWindowSecs, completeWindowSecs)` with `msg.value`.
  - Cancel before accept: `cancelBeforeAccept(offerId)`.
  - Complete: `complete(offerId)` to pay the teacher immediately.
  - Auto‑release helper: anyone may call `autoRelease(offerId)` after the time window.
- **Slots shape**: `{ start: uint64, durationMin: uint32, tzOffsetMin: int16 }` (seconds since epoch; minutes; minutes offset).
- **Recommended stack**: `viem`/`ethers`, `wagmi`, Privy SDK.

## Repository Structure

- `packages/contracts/src/EscrowOfferETH.sol`: Core escrow contract (SPDX: MIT).
- `packages/contracts/test/EscrowOfferETH.t.sol`: Foundry tests covering create/accept/complete, cancel, auto‑release.
- `packages/contracts/script/Deploy.s.sol`: Foundry script to deploy the contract.
- `packages/contracts/Deploy.sh`: Convenience wrapper for network deploy using env vars.
- `packages/contracts/foundry.toml`: Project configuration (solc version, remappings).
- `packages/contracts/lib/`: Dependencies (e.g., `forge-std`, `openzeppelin-contracts`).
- `packages/contracts/broadcast/`, `cache/`, `out/`: Build and script artifacts generated by Foundry.
- `apps/teacher`, `apps/student`: Vite + React + TS apps.
- `packages/ui`: Shared UI components.

## Contract Overview

Contract: `EscrowOfferETH`

- **Statuses**: `Created`, `Accepted`, `Completed`, `Cancelled`, `Disputed`.
- **Structs**:
  - `Slot { start, durationMin, tzOffsetMin }` — proposed class times.
  - `Offer { buyer, teacher, amountWei, status, createdAt, acceptWindowSecs, completeWindowSecs, handlesLower[], slots[], chosenSlot }`.
- **Key functions**:
  - `createOffer(string[] handlesLower, Slot[] slots, uint32 acceptWindowSecs, uint32 completeWindowSecs)` payable → `offerId`.
  - `acceptOffer(uint256 offerId, uint8 slotIdx, string handleLower)` — teacher selects a slot and matching handle.
  - `complete(uint256 offerId)` — buyer releases funds to teacher.
  - `cancelBeforeAccept(uint256 offerId)` — buyer refunds before any acceptance.
  - `autoRelease(uint256 offerId)` — anyone can trigger after complete window ends.
  - `dispute(uint256 offerId)` — either buyer or teacher can mark dispute.
  - View helpers: `getOffer`, `getHandles`, `getSlots`.

Notes:
- ETH is escrowed per offer; no protocol fees or splits.
- Reentrancy is guarded on state‑changing operations that transfer ETH.
- Auto‑release occurs after `classEnd + completeWindowSecs`. `classEnd = start + durationMin * 60`.

## Quickstart (contracts)

Prerequisites: Foundry (forge, cast, anvil). See the Foundry book for installation.

Build:

```bash
cd packages/contracts
forge build
```

Test:

```bash
cd packages/contracts
forge test -vvv
```

Format:

```bash
cd packages/contracts
forge fmt
```

Gas snapshots:

```bash
cd packages/contracts
forge snapshot
```

## Quickstart (apps)

```bash
bun install
bun run dev
```

- Teacher app on `http://localhost:5173`.
- Student app on `http://localhost:5174`.

Provide `VITE_RPC_URL` and contract address in each app’s `.env` as needed.

## Environment Variables (contracts)

Copy `packages/contracts/.env.dev` to `packages/contracts/.env` and set:

- `PRIVATE_KEY` — Deployer private key (test key for testnets).
- `RPC_BASE_SEPOLIA` — RPC endpoint.
- `ETHERSCAN_API_KEY` — Optional, for verification.

## Deploy

Using the helper script (Base Sepolia example):

```bash
cd packages/contracts
source .env
./Deploy.sh
```

Equivalent Foundry script invocation:

```bash
cd packages/contracts
source .env
forge script script/Deploy.s.sol:Deploy \
  --chain-id 84532 \
  --rpc-url "$RPC_BASE_SEPOLIA" \
  --private-key "$PRIVATE_KEY" \
  --broadcast --verify
```

The script logs the deployed `EscrowOfferETH` address. Artifacts and broadcast metadata are written under `out/` and `broadcast/`.

### Current deployment (testnet)

- Base Sepolia (chainId 84532): `EscrowOfferETH` at `0xff93f3213a8dfaebb27b28ec1eb146c5db10623a` (see broadcast under `packages/contracts/broadcast/`).

## Local Development

- Start a local node: `anvil`
- Use RPC `http://127.0.0.1:8545` for local testing.
- Point the apps to your chosen RPC and contract address via `.env`.

## License

Solidity sources specify `SPDX-License-Identifier: MIT`. If you plan to redistribute, add a top‑level `LICENSE` file to reflect your intended terms.
