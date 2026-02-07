# Third-Party Integrations

This document provides comprehensive information about all external services, SDKs, APIs, and libraries integrated into RANTAI 3C.

---

## Overview

RANTAI 3C integrates with multiple third-party services to deliver a comprehensive carbon management platform. These integrations span blockchain infrastructure, payment processing, cloud storage, data visualization, and development tools.

**Integration Categories:**
- **Blockchain & Web3**: Ethereum network, IPFS, wallet connections
- **Payment Processors**: PayPal SDK for fiat payments
- **Cloud Storage**: Google Drive, Dropbox, OneDrive APIs
- **UI Libraries**: Recharts, Lucide React, Tailwind CSS
- **Development Tools**: TypeScript, ESLint, build tooling

---

## Blockchain & Web3

### ethers.js (v6.x)

**Purpose**: Ethereum blockchain interaction and smart contract management

**Features Used:**
- Smart contract deployment and interaction
- Wallet connection and transaction signing
- Event listening and blockchain data querying
- Gas estimation and transaction management

**Configuration:**
```typescript
import { ethers } from 'ethers';

// Provider setup
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Contract interaction
const contract = new ethers.Contract(address, abi, signer);
```

**Key Functions:**
- `Contract.connect()` - Smart contract instances
- `Signer.sendTransaction()` - Transaction broadcasting
- `Provider.getBalance()` - Account balance queries
- `Contract.on()` - Event listeners

**Documentation**: https://docs.ethers.org/v6/

**License**: MIT

---

### Web3Modal (v4.x)

**Purpose**: Multi-wallet connection interface

**Features Used:**
- MetaMask integration
- WalletConnect protocol support
- Coinbase Wallet support
- Network switching (Sepolia testnet)

**Configuration:**
```typescript
import { createWeb3Modal } from '@web3modal/wagmi/react';

const modal = createWeb3Modal({
  wagmiConfig,
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [sepolia]
});
```

**Supported Wallets:**
- MetaMask
- WalletConnect-compatible wallets
- Coinbase Wallet
- Browser extension wallets

**Documentation**: https://docs.walletconnect.com/web3modal/about

**License**: Apache 2.0

---

### Ethereum RPC Providers

**Primary Provider**: Alchemy (Sepolia Testnet)

**Configuration:**
```typescript
const RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY';
```

**Usage:**
- Transaction broadcasting
- Smart contract calls
- Event log queries
- Block data retrieval

**Rate Limits:**
- Free tier: 300M compute units/month
- ~3M requests/month (average)

**Alternatives:**
- Infura
- Quicknode
- Public RPC endpoints (lower reliability)

**Documentation**: https://docs.alchemy.com/

---

### IPFS (Pinata)

**Purpose**: Decentralized storage for carbon certificates and data verification

**Features Used:**
- Certificate metadata storage
- Carbon calculation data archival
- Immutable proof generation
- Content addressing (CID)

**API Endpoint:**
```
POST https://api.pinata.cloud/pinning/pinJSONToIPFS
```

**Request Format:**
```typescript
const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PINATA_JWT}`
  },
  body: JSON.stringify({
    pinataContent: data,
    pinataMetadata: { name: filename }
  })
});
```

**Response:**
```json
{
  "IpfsHash": "QmXxxx...",
  "PinSize": 1024,
  "Timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Rate Limits:**
- Free tier: 1GB storage, 100 pins
- Paid tier: Unlimited storage, custom pinning

**Gateway Access:**
```
https://gateway.pinata.cloud/ipfs/{CID}
```

**Documentation**: https://docs.pinata.cloud/

**License**: Commercial (API service)

---

## Payment Processing

### PayPal JavaScript SDK

**Purpose**: Fiat payment processing for carbon offset purchases

**Features Used:**
- Smart payment buttons
- Order creation and capture
- Transaction validation
- Sandbox testing environment

**SDK Integration:**
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

**Implementation:**
```typescript
window.paypal.Buttons({
  createOrder: async (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalCost.toString()
        }
      }]
    });
  },
  onApprove: async (data, actions) => {
    const order = await actions.order.capture();
    // Process completion
  }
}).render('#paypal-button-container');
```

**Environment Configuration:**
- **Sandbox**: `sandbox.paypal.com` - Testing with fake accounts
- **Production**: `paypal.com` - Live transactions

**Transaction Flow:**
1. Create order (client-side)
2. User approves payment (PayPal interface)
3. Capture order (client-side callback)
4. Verify transaction (optional server-side)
5. Issue NFT certificate

**Rate Limits:**
- No specific rate limits for standard integration
- Transaction fees apply (2.9% + $0.30 per transaction)

**Security Considerations:**
- Client IDs are public (safe to expose)
- Order validation happens server-side at PayPal
- No sensitive credentials in frontend code

**Documentation**: https://developer.paypal.com/docs/checkout/

**License**: Commercial (payment service)

---

## Cloud Storage Providers

### Google Drive API (v3)

**Purpose**: Import carbon activity data from spreadsheets and documents

**OAuth 2.0 Scope:**
```
https://www.googleapis.com/auth/drive.readonly
```

**Authentication Flow:**
```typescript
// OAuth URL generation
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=token&
  scope=https://www.googleapis.com/auth/drive.readonly`;

// File listing
const response = await fetch('https://www.googleapis.com/drive/v3/files', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

**Supported File Types:**
- Spreadsheets (`.xlsx`, `.csv`, Google Sheets)
- Documents (`.docx`, Google Docs)
- JSON files (`.json`)

**Rate Limits:**
- 1,000 queries per 100 seconds per user
- 10,000 queries per 100 seconds per project

**Data Extraction:**
- Parses energy consumption logs
- Imports transportation records
- Extracts facility data

**Documentation**: https://developers.google.com/drive/api/v3/about-sdk

**License**: Apache 2.0 (client libraries)

---

### Dropbox API (v2)

**Purpose**: Alternative cloud data import source

**OAuth 2.0 Flow:**
```typescript
const authUrl = `https://www.dropbox.com/oauth2/authorize?
  client_id=${CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=token`;
```

**File Download:**
```typescript
const response = await fetch('https://content.dropboxapi.com/2/files/download', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Dropbox-API-Arg': JSON.stringify({ path: filePath })
  }
});
```

**Supported Operations:**
- List files and folders
- Download file content
- Read metadata

**Rate Limits:**
- Free tier: 2GB storage
- API calls: No specific published limits

**Documentation**: https://www.dropbox.com/developers/documentation/http/documentation

**License**: Proprietary (API service)

---

### Microsoft OneDrive API

**Purpose**: OneDrive/SharePoint data integration

**OAuth 2.0 Scope:**
```
Files.Read
```

**Authentication:**
```typescript
const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
  client_id=${CLIENT_ID}&
  response_type=token&
  redirect_uri=${REDIRECT_URI}&
  scope=Files.Read`;
```

**File Access:**
```typescript
const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

**Supported File Types:**
- Excel files (`.xlsx`)
- CSV files
- JSON documents

**Rate Limits:**
- 10,000 requests per 10 minutes (per user)
- Throttling at high volume

**Documentation**: https://learn.microsoft.com/en-us/onedrive/developer/

**License**: Proprietary (Microsoft Graph API)

---

## UI & Visualization Libraries

### Recharts (v2.x)

**Purpose**: Interactive data visualization and charts

**Components Used:**
- `LineChart` - Emissions trends over time
- `BarChart` - Category-wise carbon breakdown
- `PieChart` - Emission source distribution
- `AreaChart` - Historical carbon trajectory

**Example Configuration:**
```typescript
<LineChart data={emissionsData} width={600} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="emissions" stroke="#8884d8" />
</LineChart>
```

**Customization:**
- Responsive sizing
- Custom tooltips
- Color themes
- Animation effects

**Performance:**
- Efficient for datasets up to 10,000 points
- Virtual rendering for large datasets

**Documentation**: https://recharts.org/

**License**: MIT

---

### Lucide React (v0.x)

**Purpose**: Icon library for UI components

**Icons Used:**
- `Cloud`, `Upload`, `Database` - Cloud data operations
- `TrendingUp`, `BarChart3` - Analytics indicators
- `Shield`, `CheckCircle` - Verification states
- `Leaf`, `Trees` - Sustainability themes
- `Wallet`, `CreditCard` - Payment options

**Usage:**
```typescript
import { Cloud, TrendingUp, Shield } from 'lucide-react';

<Cloud className="w-6 h-6" />
```

**Benefits:**
- Tree-shakeable (only imports used icons)
- Consistent design system
- Customizable size and color
- TypeScript support

**Documentation**: https://lucide.dev/

**License**: ISC

---

### Tailwind CSS (v4.x)

**Purpose**: Utility-first CSS framework

**Configuration:**
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      }
    }
  }
};
```

**Utilities Used:**
- Layout: `flex`, `grid`, `container`
- Spacing: `p-*`, `m-*`, `space-*`
- Typography: `text-*`, `font-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

**Build Optimization:**
- PurgeCSS removes unused styles
- Minified output ~8-12KB gzipped

**Documentation**: https://tailwindcss.com/

**License**: MIT

---

## Development Tools

### TypeScript (v5.x)

**Purpose**: Type-safe JavaScript development

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

**Type Safety Benefits:**
- Smart contract interface types
- API response validation
- Component prop checking
- Build-time error detection

**Documentation**: https://www.typescriptlang.org/

**License**: Apache 2.0

---

### ESLint & Prettier

**Purpose**: Code quality and formatting

**ESLint Rules:**
- TypeScript-specific linting
- React hooks validation
- Unused variable detection

**Prettier Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Documentation**:
- ESLint: https://eslint.org/
- Prettier: https://prettier.io/

**License**: MIT

---

## API Keys & Credentials

### Required API Keys

| Service | Key Type | Required For | Free Tier |
|---------|----------|--------------|-----------|
| Alchemy | API Key | Ethereum RPC | 300M CU/month |
| Pinata | JWT Token | IPFS uploads | 1GB storage |
| PayPal | Client ID | Payments | Sandbox unlimited |
| Google Drive | OAuth Client | Data import | 15GB storage |
| Dropbox | App Key | Data import | 2GB storage |
| OneDrive | Client ID | Data import | 5GB storage |
| WalletConnect | Project ID | Wallet modal | Unlimited |

### Environment Variable Setup

**Production Configuration:**
```bash
# .env.local (never commit to git)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_DROPBOX_APP_KEY=your_dropbox_key
NEXT_PUBLIC_ONEDRIVE_CLIENT_ID=your_onedrive_client_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
```

**Note**: All keys prefixed with `NEXT_PUBLIC_` are exposed to the browser. Ensure these are client-safe credentials only.

### Obtaining API Keys

**Alchemy:**
1. Sign up at https://alchemy.com
2. Create new app (Ethereum Sepolia)
3. Copy API key from dashboard

**Pinata:**
1. Register at https://pinata.cloud
2. Generate new JWT token
3. Copy JWT from API keys section

**PayPal:**
1. Create developer account at https://developer.paypal.com
2. Create REST API app
3. Copy Client ID (sandbox/production)

**Google Drive:**
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Enable Drive API
4. Copy Client ID

**Dropbox:**
1. Create app at https://www.dropbox.com/developers/apps
2. Choose "Scoped access"
3. Copy App key

**OneDrive:**
1. Register app at https://portal.azure.com
2. Add Microsoft Graph permissions
3. Copy Application (client) ID

**WalletConnect:**
1. Sign up at https://cloud.walletconnect.com
2. Create new project
3. Copy Project ID

---

## Rate Limits & Quotas

### Blockchain Services

**Alchemy (Sepolia RPC)**
- **Free Tier**: 300M compute units/month
- **Average Cost**: 
  - `eth_call`: 16 CU
  - `eth_sendRawTransaction`: 250 CU
  - `eth_getLogs`: 75 CU
- **Estimated Capacity**: ~3M requests/month
- **Throttling**: 330 requests/second burst

**Mitigation Strategy:**
- Cache repeated contract calls
- Batch multiple reads with multicall
- Use WebSocket subscriptions for events

---

### Storage Services

**Pinata IPFS**
- **Free Tier**: 1GB storage, 100 pins
- **Bandwidth**: Unlimited reads via gateway
- **Upload Limit**: 100MB per file
- **Concurrency**: 180 requests/minute

**Mitigation Strategy:**
- Compress JSON before upload
- Remove redundant data
- Use IPFS gateway caching

**Google Drive API**
- **Quota**: 1,000 queries per 100 seconds per user
- **Project Limit**: 10,000 queries per 100 seconds
- **Daily Limit**: 1 billion queries per day

**Mitigation Strategy:**
- Paginate large file lists
- Cache file metadata locally
- Use exponential backoff on errors

---

### Payment Services

**PayPal SDK**
- **No Published Rate Limits**: Standard checkout flow
- **Transaction Fees**: 2.9% + $0.30 USD per transaction
- **Minimum**: $0.01 USD
- **Maximum**: $10,000 USD per transaction

**Mitigation Strategy:**
- Validate amounts client-side
- Handle payment errors gracefully
- Log failed transactions for retry

---

## Cost Considerations

### Free Tier Sustainability

**RANTAI 3C can operate entirely on free tiers for:**
- MVP development and testing
- Small-scale production (< 1,000 users)
- Hackathon demonstrations
- Portfolio projects

**Estimated Monthly Costs (Free):**
- Alchemy: $0 (300M CU sufficient)
- Pinata: $0 (1GB sufficient for ~10,000 certificates)
- Vercel: $0 (hobby plan)
- **Total: $0/month**

---

### Scaling Costs

**At 10,000 active users:**

| Service | Free Tier | Paid Plan | Cost |
|---------|-----------|-----------|------|
| Alchemy | 300M CU | Growth (1,500M CU) | $49/mo |
| Pinata | 1GB | Picnic (100GB) | $20/mo |
| Vercel | 100GB | Pro (1TB) | $20/mo |
| PayPal | N/A | Transaction fees | 2.9% + $0.30 |
| **Total** | **$0** | **Base + Tx fees** | **~$89/mo** |

**Revenue Model:**
- Carbon offset sales generate PayPal transaction revenue
- Platform fees can cover infrastructure costs
- Freemium model: Basic free, premium features paid

---

## Security Best Practices

### API Key Management

**Do's:**
✅ Store keys in environment variables  
✅ Use `.gitignore` to exclude `.env.local`  
✅ Rotate keys every 90 days  
✅ Use separate keys for dev/staging/production  
✅ Monitor API usage dashboards  

**Don'ts:**
❌ Hardcode keys in source code  
❌ Commit keys to version control  
❌ Share keys in public channels  
❌ Use production keys in development  
❌ Expose server-side keys to browser  

---

### OAuth Token Security

**Implementation:**
```typescript
// Secure token storage
const saveToken = (token: string) => {
  // Store in memory only (component state)
  // DO NOT use localStorage for sensitive tokens
  setAccessToken(token);
};

// Token expiration handling
const isTokenExpired = (expiresAt: number) => {
  return Date.now() > expiresAt;
};
```

**Best Practices:**
- Request minimum required scopes
- Implement token refresh logic
- Clear tokens on logout
- Use HTTPS for all OAuth redirects

---

### Smart Contract Interaction

**Security Measures:**
```typescript
// Gas limit protection
const tx = await contract.purchaseOffset(projectId, amount, {
  gasLimit: 500000, // Prevent runaway gas
  value: ethers.parseEther(cost.toString())
});

// Transaction verification
const receipt = await tx.wait(2); // Wait for 2 confirmations
if (receipt.status !== 1) {
  throw new Error('Transaction failed');
}
```

**Best Practices:**
- Validate all inputs before sending transactions
- Set reasonable gas limits
- Wait for multiple confirmations
- Handle transaction failures gracefully

---

### Payment Processing

**PayPal Security:**
```typescript
// Verify order on server-side (recommended)
const verifyOrder = async (orderId: string) => {
  const response = await fetch(`/api/verify-paypal-order`, {
    method: 'POST',
    body: JSON.stringify({ orderId })
  });
  return response.json();
};
```

**Best Practices:**
- Validate order amounts match expected values
- Verify transactions server-side for critical operations
- Log all payment attempts
- Implement fraud detection for large amounts

---

## Troubleshooting

### Blockchain Connection Issues

**Problem**: "Could not connect to Ethereum network"

**Solutions:**
1. Verify RPC endpoint is accessible
2. Check Alchemy API key is valid
3. Ensure Sepolia testnet is selected in wallet
4. Try alternative RPC provider (Infura)

**Problem**: "Transaction failed with error: insufficient funds"

**Solutions:**
1. Get Sepolia ETH from faucet: https://sepoliafaucet.com
2. Verify wallet has enough ETH for gas
3. Reduce gas limit if transaction is reverting

---

### IPFS Upload Failures

**Problem**: "Failed to upload to IPFS"

**Solutions:**
1. Check Pinata JWT is correct
2. Verify file size < 100MB
3. Ensure JSON is valid (use validator)
4. Check Pinata dashboard for quota limits

**Problem**: "IPFS gateway timeout"

**Solutions:**
1. Use alternative gateway: `https://ipfs.io/ipfs/{CID}`
2. Wait and retry (IPFS propagation takes time)
3. Check CID is correct

---

### OAuth Authentication

**Problem**: "OAuth redirect_uri_mismatch"

**Solutions:**
1. Verify redirect URI in OAuth app settings
2. Ensure exact match (including protocol)
3. Check for trailing slashes
4. Use `http://localhost:3000` for development

**Problem**: "Access token expired"

**Solutions:**
1. Implement token refresh logic
2. Store expiration timestamp
3. Re-authenticate user when expired
4. Clear invalid tokens from state

---

### Payment Processing

**Problem**: "PayPal button not rendering"

**Solutions:**
1. Check SDK script is loaded
2. Verify client ID is correct
3. Ensure container element exists
4. Check browser console for errors

**Problem**: "Order creation failed"

**Solutions:**
1. Validate amount is numeric and > 0
2. Check currency code is supported
3. Verify PayPal sandbox mode for testing
4. Review PayPal developer logs

---

## Alternative Services

### Blockchain Infrastructure

**If Alchemy is down:**
- **Infura**: https://infura.io (similar features)
- **Quicknode**: https://quicknode.com (faster performance)
- **Public RPC**: https://chainlist.org (free but unreliable)

**Migration:**
```typescript
// Change RPC URL only
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.infura.io/v3/YOUR_KEY');
```

---

### IPFS Storage

**If Pinata is unavailable:**
- **NFT.Storage**: https://nft.storage (free 100GB)
- **Web3.Storage**: https://web3.storage (free unlimited)
- **Infura IPFS**: https://infura.io/product/ipfs (paid)

**Migration:**
```typescript
// Update upload endpoint
const response = await fetch('https://api.nft.storage/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${NFT_STORAGE_KEY}` },
  body: formData
});
```

---

### Payment Processing

**If PayPal is down:**
- **Stripe**: https://stripe.com (card payments)
- **Coinbase Commerce**: https://commerce.coinbase.com (crypto only)
- **Square**: https://squareup.com (card payments)

**Note**: Requires significant integration changes

---

## Version Compatibility

### Tested Versions

| Package | Version | Status |
|---------|---------|--------|
| Next.js | 15.3.8 | ✅ Stable |
| React | 19.x | ✅ Stable |
| TypeScript | 5.x | ✅ Stable |
| ethers.js | 6.13.4 | ✅ Stable |
| @web3modal/wagmi | 4.x | ✅ Stable |
| recharts | 2.15.1 | ✅ Stable |
| lucide-react | 0.468.0 | ✅ Stable |
| tailwindcss | 4.x | ✅ Stable |

### Compatibility Notes

**Node.js:**
- Minimum: 18.17.0
- Recommended: 20.x LTS
- Not tested: 21.x (may work)

**Browsers:**
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 14+, Android 10+

**Web3 Compatibility:**
- MetaMask: 10.0+
- WalletConnect: v2 protocol
- Ledger: Via WalletConnect

---

## License Compliance

### Open Source Dependencies

**MIT Licensed:**
- Next.js, React, TypeScript
- ethers.js, wagmi
- Tailwind CSS, Recharts
- Lucide React

**Apache 2.0:**
- Web3Modal

**ISC:**
- Lucide icons

**Usage Rights:**
- ✅ Commercial use permitted
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed

**Obligations:**
- Include original license text
- State changes made to code
- Preserve copyright notices

---

### Proprietary Services

**PayPal:**
- Subject to PayPal Terms of Service
- Transaction fees apply
- Merchant agreement required

**Cloud Providers (Google, Dropbox, Microsoft):**
- Subject to respective Terms of Service
- API usage limits apply
- Data privacy regulations (GDPR, CCPA)

**Blockchain Services (Alchemy, Pinata):**
- Subject to service agreements
- Quota limits enforced
- Commercial terms may apply

---

## Support & Resources

### Official Documentation

- **Next.js**: https://nextjs.org/docs
- **ethers.js**: https://docs.ethers.org
- **Web3Modal**: https://docs.walletconnect.com
- **Recharts**: https://recharts.org
- **Tailwind CSS**: https://tailwindcss.com/docs

### Community Resources

- **Stack Overflow**: Tag-specific questions
- **GitHub Issues**: Library-specific bugs
- **Discord Communities**: Web3, Next.js, React

### RANTAI 3C Support

- **GitHub**: https://github.com/mrbrightsides/3c
- **Telegram**: @khudriakhmad
- **Discord**: @khudri_61362
- **Email**: support@elpeef.com

---

## Changelog

### v1.0.0 (Current)
- Initial release
- Integrated 7 third-party services
- Implemented dual payment system
- Added blockchain verification
- IPFS storage for certificates

### Future Integrations (Planned)
- Chainlink oracles for carbon price feeds
- The Graph for blockchain data indexing
- Ceramic Network for decentralized identity
- Polygon zkEVM for lower transaction costs

---

*Last Updated: January 2025*  
*Platform: RANTAI 3C - Blockchain Carbon Management*
