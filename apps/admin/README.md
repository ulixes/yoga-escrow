# Yoga Escrow Admin Dashboard

A simple admin interface for managing teacher registrations in the YogaClassEscrow platform.

## Setup

1. Update `.env.local` with your values:
   - Your admin private key (the one that deployed the TeacherRegistry)
   - Change the admin secret key from the default

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

The admin dashboard will be available at `http://localhost:5175`

## Features

- **Secret Key Authentication**: Simple login with admin secret key
- **Register Teachers**: Add new teachers to the registry
- **Search Teachers**: Look up teachers by handle
- **Remove Teachers**: Remove teachers from the registry
- **Quick Actions**: Pre-filled demo teacher data for testing

## Security

- Admin private key is required for contract interactions
- Secret key authentication prevents unauthorized access
- All transactions are signed with the admin wallet

## Contract Addresses

- **TeacherRegistry**: `0xb981ead35716c8dd19714415c655996490360406`
- **YogaClassEscrow**: `0x3BB99E200a4Bb21c8EAa2A670C11D264cb0d7874`
- **Network**: Base Sepolia (84532)

## Usage

1. Login with the admin secret key: `yoga-admin-2024`
2. Register teachers using their social media handles (e.g., `@yogamaster`) and wallet addresses
3. Use the search function to verify registrations
4. Remove teachers if needed (this will prevent them from accepting new escrows)

## Environment Variables

- `VITE_TEACHER_REGISTRY_ADDRESS`: Contract address for TeacherRegistry
- `VITE_ESCROW_ADDRESS`: Contract address for YogaClassEscrow  
- `VITE_RPC_URL`: RPC endpoint for Base Sepolia
- `VITE_CHAIN_ID`: Chain ID (84532 for Base Sepolia)
- `VITE_ADMIN_SECRET_KEY`: Secret key for dashboard login
- `VITE_ADMIN_PRIVATE_KEY`: Private key of the registry owner wallet
