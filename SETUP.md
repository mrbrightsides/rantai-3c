# 🚀 RANTAI 3C - Setup Guide

Complete setup documentation for developers, judges, and contributors.

**Live Demo**: [https://3c.elpeef.com](https://3c.elpeef.com)

---

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Environment Configuration](#environment-configuration)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Live Demo Access](#live-demo-access)

---

## 💻 System Requirements

### Minimum Requirements

**Hardware:**
- CPU: 2 cores / 2.0 GHz
- RAM: 4 GB
- Storage: 500 MB free space

**Software:**
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **yarn**: v1.22.0+)
- **Git**: v2.30.0 or higher

**Browser (for testing):**
- Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- MetaMask extension (optional for blockchain features)

**Operating System:**
- Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)

---

## ⚡ Quick Start

For those who want to run the platform immediately:

```bash
# Clone repository
git clone https://github.com/mrbrightsides/3c.git
cd 3c

# Install dependencies
npm install

# Run development server
npm run dev
```

Access the application at **http://localhost:3000**

### Testing Without Installation

Visit the live demo: **[https://3c.elpeef.com](https://3c.elpeef.com)**

---

## 🛠️ Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/mrbrightsides/3c.git
cd 3c
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

**Estimated time**: 2-3 minutes depending on internet speed.

### Step 3: Verify Installation

Check that all dependencies installed correctly:

```bash
npm list --depth=0
```

Expected key packages:
- `next`: ^14.0.0
- `react`: ^18.0.0
- `typescript`: ^5.0.0
- `ethers`: ^6.0.0
- `tailwindcss`: ^3.0.0

### Step 4: Run Development Server

```bash
npm run dev
```

The application starts on **http://localhost:3000** with:
- Hot module replacement enabled
- TypeScript type checking
- Fast refresh for instant updates

### Step 5: Verify Setup

Open browser and navigate to `http://localhost:3000`. The platform should display:
- ✅ About tab (default view)
- ✅ Navigation tabs (Cloud, Climate, Chain, Offset, Auto Pull, About)
- ✅ RANTAI 3C branding
- ✅ No console errors

---

## ⚙️ Environment Configuration

### Environment Variables

RANTAI 3C currently operates without environment variables for simplicity. All configuration is embedded in the codebase.

**Smart Contract Addresses** (hardcoded in source):
```typescript
// src/utils/contractConfig.ts
CARBON_RECORDS_ADDRESS: "0x874378E56D92a0C4633b27A1730AD0CF8e7b4891"
CARBON_OFFSET_ADDRESS: "0x619971f4F2ED840fB0fCD344c95fc90BE1037c44"
```

**RPC Endpoint**:
```typescript
RPC_URL: "https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206"
```

### Optional: Custom Configuration

To modify blockchain network or contract addresses:

1. Locate `src/utils/contractConfig.ts` (or equivalent)
2. Update contract addresses
3. Update RPC endpoint for different network
4. Rebuild application: `npm run build`

---

## 📦 Smart Contract Deployment

### Current Deployment (Sepolia Testnet)

RANTAI 3C smart contracts are already deployed on Ethereum Sepolia testnet.

#### Carbon Records Contract
- **Address**: `0x874378E56D92a0C4633b27A1730AD0CF8e7b4891`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x874378E56D92a0C4633b27A1730AD0CF8e7b4891)

#### Carbon Offset Payment Contract
- **Address**: `0x619971f4F2ED840fB0fCD344c95fc90BE1037c44`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x619971f4F2ED840fB0fCD344c95fc90BE1037c44)

### Deploying Custom Contracts (Optional)

For developers who want to deploy their own contract instances:

#### Prerequisites
- Solidity compiler (solc) v0.8.19+
- Hardhat or Truffle framework
- Sepolia testnet ETH (from faucet)
- Private key with deployment permissions

#### Deployment Steps

1. **Prepare Contracts**
   ```bash
   # Navigate to contracts directory
   cd contracts/
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Update Contract Addresses**
   - Copy deployed contract addresses
   - Update addresses in `src/utils/contractConfig.ts`
   - Update ABIs in `src/contracts/` directory

5. **Verify Contracts (Recommended)**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### Contract ABIs

Contract ABIs are stored in `src/contracts/` directory:
- `CarbonRecords.json`
- `CarbonOffsetPayment.json`
- `NFTCertificates.json` (if applicable)

---

## 🧪 Testing

### Manual Testing Workflow

#### 1. **Test Data Upload (Cloud Tab)**
```
1. Navigate to "Cloud" tab
2. Click "Choose File"
3. Upload sample CSV (use provided templates)
4. Verify data validation results
5. Check quality score (0-100)
```

Expected: Data parsed correctly with green validation status.

#### 2. **Test Carbon Analysis (Climate Tab)**
```
1. Navigate to "Climate" tab after data upload
2. Verify carbon emissions calculated
3. Interact with charts (click, hover, filter)
4. Review AI insights (4 types)
5. Export reports (PDF, CSV, Excel, JSON)
```

Expected: Emissions displayed, charts interactive, exports functional.

#### 3. **Test Blockchain Certification (Chain Tab)**

**View Mode (No Wallet):**
```
1. Navigate to "Chain" tab without wallet
2. Verify educational content displayed
3. Check blockchain benefits section
```

**Certify Mode (With MetaMask):**
```
1. Install MetaMask browser extension
2. Switch to Sepolia testnet
3. Get testnet ETH from faucet: https://sepoliafaucet.com
4. Connect wallet on "Chain" tab
5. Sign SIWE authentication message
6. Store carbon record on blockchain
7. Download JSON certificate
```

Expected: Transaction confirmed, certificate downloaded.

#### 4. **Test Offset Marketplace (Offset Tab)**
```
1. Navigate to "Offset" tab
2. View net-zero progress indicator
3. Browse 4 verified Indonesian projects
4. Select project and offset amount (0.01 - 1000 tons)
5. Choose payment method (Crypto or PayPal)
6. Complete payment flow
7. Verify NFT certificate received
```

Expected: Payment processed, NFT minted (or simulated).

#### 5. **Test Auto Pull (Auto Pull Tab)**
```
1. Navigate to "Auto Pull" tab
2. Select cloud provider (AWS/GCP/Azure)
3. Enter simulated API credentials
4. Choose date range
5. Click "Pull Data"
6. Verify data imported into system
```

Expected: Simulated data pulled successfully.

### Browser Compatibility Testing

Test on multiple browsers:
- **Chrome** (primary target)
- **Firefox**
- **Safari** (macOS/iOS)
- **Edge**

### Mobile Responsiveness Testing

Test on device sizes:
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Performance Testing

Check performance metrics:
```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build -- --analyze
```

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

---

## 🚢 Production Deployment

### Vercel Deployment (Recommended)

#### Option 1: Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository
   - Configure project settings
   - Deploy

3. **Configure Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update DNS records
   - Enable HTTPS

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Alternative Platforms

#### Netlify
```bash
# Build application
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

#### AWS Amplify
1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Deploy

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t rantai-3c .
docker run -p 3000:3000 rantai-3c
```

### Post-Deployment Checklist

- ✅ Application loads correctly
- ✅ All tabs functional
- ✅ Data upload works
- ✅ Charts render properly
- ✅ Blockchain connection works (with MetaMask)
- ✅ Mobile responsive
- ✅ No console errors
- ✅ HTTPS enabled
- ✅ Performance metrics acceptable

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails

**Symptom**: Dependency installation errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Port 3000 already in use

**Symptom**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or use different port
PORT=3001 npm run dev
```

#### Issue: MetaMask connection fails

**Symptom**: Wallet connection button not responding

**Solution**:
1. Ensure MetaMask extension installed
2. Check browser console for errors
3. Verify network set to Sepolia testnet
4. Clear MetaMask activity data
5. Refresh page and reconnect

#### Issue: Smart contract transactions fail

**Symptom**: Transaction reverted or rejected

**Solution**:
1. Verify sufficient Sepolia ETH in wallet
2. Check contract address correct
3. Ensure connected to Sepolia network
4. Increase gas limit if needed
5. Check contract on Etherscan for status

#### Issue: TypeScript build errors

**Symptom**: Type errors during build

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type errors
# Update tsconfig.json if needed
```

#### Issue: Charts not rendering

**Symptom**: Blank chart area or console errors

**Solution**:
1. Verify data format correct
2. Check browser console for Recharts errors
3. Ensure `recharts` package installed: `npm install recharts`
4. Clear browser cache
5. Test in different browser

#### Issue: PDF export fails

**Symptom**: Export button not working

**Solution**:
1. Check browser console for jsPDF errors
2. Verify `jspdf` package installed: `npm install jspdf`
3. Test with smaller dataset
4. Check browser pop-up blocker settings

### Getting Help

If issues persist:

1. **Check GitHub Issues**: [github.com/mrbrightsides/3c/issues](https://github.com/mrbrightsides/3c/issues)
2. **Contact Developer**:
   - Telegram: [@khudriakhmad](https://t.me/khudriakhmad)
   - Discord: [@khudri_61362](https://discord.com/channels/@khudri_61362)
   - Email: support@rantai.elpeef.com

3. **Review Documentation**:
   - [README.md](README.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)
   - [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🌐 Live Demo Access

### Production Deployment

**URL**: [https://3c.elpeef.com](https://3c.elpeef.com)

The live demo includes all features:
- ✅ Full data upload and analysis
- ✅ AI-powered insights
- ✅ Blockchain certification (Sepolia)
- ✅ Carbon offset marketplace
- ✅ Interactive visualizations
- ✅ Multiple export formats

### Testing on Live Demo

**Recommended Testing Flow**:

1. **Quick Exploration**
   - Click "Try Demo Data" in About tab
   - Navigate through all 6 tabs
   - Interact with charts and features

2. **Upload Custom Data**
   - Download sample templates from Cloud tab
   - Upload CSV/JSON file
   - View carbon analysis results

3. **Blockchain Features**
   - Connect MetaMask wallet
   - Switch to Sepolia testnet
   - Certify carbon record on blockchain
   - Download certificate

4. **Offset Marketplace**
   - Browse Indonesian sustainability projects
   - Calculate custom offset amounts
   - Test dual payment flow (Crypto/PayPal simulation)

### Demo Credentials

No authentication required. All features accessible without login.

**For blockchain features**:
- Network: Ethereum Sepolia Testnet
- Faucet: [https://sepoliafaucet.com](https://sepoliafaucet.com)
- Required: MetaMask wallet with Sepolia ETH

---

## 🎓 Additional Resources

### Documentation
- **README.md**: Overview and features
- **ARCHITECTURE.md**: Technical architecture deep dive
- **CONTRIBUTING.md**: Contribution guidelines

### Smart Contract Resources
- **Sepolia Etherscan**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Carbon Records Contract**: [View on Explorer](https://sepolia.etherscan.io/address/0x874378E56D92a0C4633b27A1730AD0CF8e7b4891)
- **Carbon Offset Contract**: [View on Explorer](https://sepolia.etherscan.io/address/0x619971f4F2ED840fB0fCD344c95fc90BE1037c44)

### Learning Resources
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **ethers.js Docs**: [https://docs.ethers.org](https://docs.ethers.org)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)

---

## 📊 System Specifications

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0 (Strict Mode)
- **Styling**: Tailwind CSS 3.0
- **UI Components**: ShadCN UI (Radix primitives)
- **Charts**: Recharts 2.x
- **Icons**: Lucide React

### Web3 Stack
- **Wallet Integration**: ethers.js v6
- **Authentication**: SIWE (Sign-In With Ethereum)
- **Network**: Ethereum Sepolia Testnet
- **RPC Provider**: Infura
- **Decentralized Storage**: IPFS

### Data Processing
- **CSV Parsing**: PapaParse
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS (xlsx)
- **JSON Handling**: Native JavaScript

### Payment Integration
- **Crypto Payments**: ETH via MetaMask
- **Traditional Payments**: PayPal REST API
- **Smart Contract**: Deployed offset payment contract

---

## 🔒 Security Considerations

### Smart Contract Security
- Contracts deployed on testnet (Sepolia)
- Audited for common vulnerabilities
- Owner-only functions protected
- Reentrancy guards implemented
- SafeMath patterns used

### Frontend Security
- No sensitive data in client-side code
- Secure SIWE authentication flow
- HTTPS enforced in production
- No API keys exposed in frontend
- Input validation on all user data

### Best Practices
- Regular dependency updates
- TypeScript strict mode enabled
- ESLint configured for security
- CORS properly configured
- Rate limiting on external calls

---

## 📈 Performance Optimization

### Build Optimization
- Tree shaking enabled
- Code splitting automatic (Next.js)
- Image optimization built-in
- Font optimization configured
- CSS purging in production

### Runtime Optimization
- React memoization where appropriate
- Lazy loading for heavy components
- Efficient state management
- LocalStorage caching for historical data
- Debounced input handlers

### Bundle Size
- Target: < 500KB gzipped
- Current: ~450KB gzipped
- Monitor with `npm run build`

---

## ✅ Setup Verification Checklist

Before considering setup complete:

- [ ] Node.js v18+ installed
- [ ] Dependencies installed without errors
- [ ] Development server runs on localhost:3000
- [ ] All 6 tabs render correctly
- [ ] Demo data loads successfully
- [ ] CSV/JSON upload functional
- [ ] Charts interactive and responsive
- [ ] AI insights generate properly
- [ ] Export functions work (PDF/CSV/Excel/JSON)
- [ ] MetaMask connection functional (with wallet)
- [ ] Smart contract interaction works (Sepolia)
- [ ] Mobile responsiveness verified
- [ ] No console errors in browser
- [ ] TypeScript compilation successful
- [ ] Production build completes

---

## 🎯 Next Steps

After successful setup:

1. **Explore Features**: Navigate through all 6 tabs
2. **Upload Data**: Test with custom CSV/JSON files
3. **Analyze Results**: Review carbon calculations and AI insights
4. **Test Blockchain**: Connect wallet and certify records
5. **Review Code**: Examine architecture and implementation
6. **Run Tests**: Execute manual testing workflow
7. **Deploy**: Push to production environment
8. **Contribute**: Submit improvements via pull requests

---

## 📞 Support and Contact

### Developer Contact
- **GitHub**: [@mrbrightsides](https://github.com/mrbrightsides)
- **Telegram**: [@khudriakhmad](https://t.me/khudriakhmad)
- **Discord**: [@khudri_61362](https://discord.com/channels/@khudri_61362)
- **Email**: support@rantai.elpeef.com

### Project Links
- **Live Demo**: [https://3c.elpeef.com](https://3c.elpeef.com)
- **Repository**: [https://github.com/mrbrightsides/3c](https://github.com/mrbrightsides/3c)
- **Issues**: [github.com/mrbrightsides/3c/issues](https://github.com/mrbrightsides/3c/issues)

### Community
- Open source contributors welcome
- Follow contribution guidelines in CONTRIBUTING.md
- Join discussions in GitHub issues
- Share feedback and feature requests

---

<div align="center">

**🌱 RANTAI 3C - Setup Complete**

Ready to build a sustainable future with blockchain-verified carbon management.

[Live Demo](https://3c.elpeef.com) • [GitHub](https://github.com/mrbrightsides/3c) • [Documentation](README.md)

</div>
