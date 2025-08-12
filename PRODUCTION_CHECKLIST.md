# Production Deployment Checklist

## Contract Addresses
- **Base Mainnet**: `0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33`
- **Base Sepolia (Testnet)**: `0x49e0e615583Be1F9457E119BC93e84B85aD63feD`

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Set `VITE_NETWORK=base` in production environment
- [ ] Verify contract address is set to mainnet: `0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33`
- [ ] Ensure `.env.production` is configured correctly

### 2. Build & Deploy
```bash
# Install dependencies
bun install

# Build for production
cd apps/student
bun run build

# Preview production build locally
bun run preview
```

### 3. Network Configuration
The app automatically detects the network based on:
1. `VITE_NETWORK` environment variable (highest priority)
2. Build mode (production = mainnet, development = testnet)

### 4. Pricing
- Current price: **0.003 ETH** per class (~$13.50 at $4500/ETH)
- Target price: **$15 USD** per class
- Update `CLASS_PRICE_ETH` in `constants.ts` if ETH price changes significantly

### 5. Features Status
✅ **Student Can:**
- Create bookings with ETH payment
- Cancel bookings (before teacher assignment)
- Release payment (after class)
- Raise disputes
- View booking history

❌ **Student Cannot:**
- Assign teachers (removed for security)

### 6. Production Testing
Before going live:
1. Test on Base Sepolia testnet first
2. Verify contract functions work correctly
3. Test booking creation with small amount
4. Verify booking history loads properly
5. Test wallet connection (Privy)

### 7. Monitoring
- Monitor contract at: https://basescan.org/address/0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33
- Check for failed transactions
- Monitor gas prices on Base network

## Post-Deployment
- [ ] Verify contract on Basescan
- [ ] Test live booking flow with minimal ETH
- [ ] Monitor first few transactions
- [ ] Set up error tracking/monitoring

## Rollback Plan
If issues occur:
1. Revert to testnet by setting `VITE_NETWORK=baseSepolia`
2. Previous mainnet contract (if needed): `0xa691f1735FD69AacCcFdf57EBD41a3140228941d`