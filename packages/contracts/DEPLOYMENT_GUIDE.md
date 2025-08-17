# Contract Deployment Guide

## Environment Files

### Development (.env.dev)
```bash
RPC_BASE_SEPOLIA="https://sepolia.base.org"
PRIVATE_KEY=0xYOUR_DEV_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
TEACHER_REGISTRY_ADDRESS="0xc1FBA830fac6874d111A069688E66a0479f5C785"
```

### Production (.env.prod)
```bash
RPC_BASE_SEPOLIA="https://mainnet.base.org"
PRIVATE_KEY=0xYOUR_PRODUCTION_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
TEACHER_REGISTRY_ADDRESS="0xFC0daa9D632c705Fe4d8280E71B07FE498F909D5"
```

## Current Deployments

### Development (Base Sepolia)
- **TeacherRegistry**: `0xc1FBA830fac6874d111A069688E66a0479f5C785`
- **YogaClassEscrow**: `0xf885c0e3C8a5492E33Db4C79e87635F3e66951Eb`

### Production (Base Mainnet)
- **TeacherRegistry**: `0xFC0daa9D632c705Fe4d8280E71B07FE498F909D5`
- **YogaClassEscrow**: `0x8988250900066488C73e1B7C0075511B83D01057`

## Deployment Commands

### Deploy to Development
```bash
cp .env.dev .env
forge script script/DeployRegistry.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
forge script script/DeployEscrow.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
```

### Deploy to Production
```bash
cp .env.prod .env
forge script script/DeployRegistry.s.sol --rpc-url https://mainnet.base.org --broadcast --verify
forge script script/DeployEscrow.s.sol --rpc-url https://mainnet.base.org --broadcast --verify
```

```bash
PRIVATE_KEY=0xYOUR_PRIVATE_KEY \
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY \
TEACHER_REGISTRY_ADDRESS=0xFC0daa9D632c705Fe4d8280E71B07FE498F909D5 \
forge script script/DeployRegistry.s.sol \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify
```

## Teacher Management

### Register Teacher
```bash
cast send $TEACHER_REGISTRY_ADDRESS "registerTeacher(string,address)" "@handle" 0xAddress --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

**⚠️ Security Note**: Never commit private keys to git. Use secure key management.

### Verify Teacher
```bash
./verify_teacher.sh @handle
```

## Frontend Configuration

Update `.env.local` in both apps:
```bash
VITE_ESCROW_ADDRESS=<YogaClassEscrow_Address>
VITE_NETWORK=baseSepolia  # or "base" for production
VITE_CHAIN_ID=84532       # or 8453 for production
```