# 🌱 RANTAI 3C
### Cloud. Climate. Chain.
**Integrating Technology for a Sustainable Future**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

RANTAI 3C is a Web3-based carbon management platform that integrates cloud infrastructure monitoring, AI-powered carbon emission analysis, and blockchain certification for environmental transparency and accountability. With decentralized storage (IPFS), NFT certificates, tokenized carbon credits, and dual payment options (crypto & PayPal), RANTAI 3C offers a comprehensive solution for businesses and individuals committed to sustainability.

---

## 🎯 **Vision & Purpose**

RANTAI 3C dirancang untuk memberikan individu dan organisasi antarmuka yang seamless untuk memantau dan mensertifikasi jejak karbon mereka menggunakan infrastruktur cloud yang scalable dikombinasikan dengan kekuatan blockchain yang immutable.

Platform ini melayani bisnis yang peduli lingkungan, analis keberlanjutan, dan organisasi yang ingin mengoptimalkan pelaporan dampak lingkungan mereka.

---

## ✨ **Core Features**

### **☁️ Cloud - Data Management**
- **Manual Upload**: Import data konsumsi energi melalui CSV/JSON files
- **Automated Data Pulling**: Integrasi dengan cloud providers (AWS, Google Cloud, Azure)
- **Cloud Infrastructure Dashboard**: Real-time metrics untuk storage, processing, dan scalability
- **Data Validation System**: Quality scoring dengan detailed error detection
- **Template Downloads**: Sample CSV & JSON templates dengan data Indonesia

### **🌍 Climate - Carbon Analysis**
- **Carbon Footprint Calculation**: Estimasi emisi berbasis data konsumsi energi
- **AI-Powered Insights**: 4 tipe analisis (Pattern Analysis, Efficiency Optimization, Predictive Analytics, Benchmarking)
- **Interactive Visualizations**: Bar, Pie, dan Line charts dengan drill-down capabilities
- **Historical Tracking**: Progress monitoring over time dengan trend analysis
- **Smart Recommendations**: Actionable steps dengan priority classification
- **Multiple Export Options**: PDF, CSV, Excel, JSON formats

### **⛓️ Chain - Blockchain Certification**
- **SIWE Authentication**: Secure Sign-In With Ethereum
- **Smart Contract Integration**: Multiple contracts (Carbon Records, NFT Certificates, Carbon Credits, DAO Governance)
- **Immutable Records**: Permanent carbon footprint certification on Sepolia testnet
- **NFT Achievement Certificates**: Blockchain-verified NFTs for sustainability milestones
- **IPFS Storage**: Decentralized storage for carbon data and certificates
- **ERC-20 Carbon Credit Tokens**: Tokenized carbon credits for businesses
- **DAO Governance**: Community voting on offset projects and platform decisions
- **Real-time Oracle Integration**: Live market data for carbon credit pricing
- **View-Only Mode**: Educational blockchain content without wallet requirement
- **Certificate Downloads**: JSON certificates for compliance

### **🌱 Carbon Offset Marketplace**
- **Verified Indonesian Projects**: 4 sustainability initiatives (Reforestation, Solar, Mangrove, CCUS)
- **Flexible Offset Amounts**: Purchase any amount of carbon offsets (0.01 - 1000 tons)
- **Dual Payment System**: Crypto payments (ETH) and PayPal integration for accessibility
- **Dynamic Pricing**: Real-time cost calculation with live market rates
- **NFT Rewards**: Every offset purchase includes a blockchain-verified NFT certificate
- **Net-Zero Tracking**: Visual progress toward carbon neutrality
- **Transparent Pricing**: $12-25 per ton CO₂ with live updates
- **Impact Metrics**: Specific environmental impact per project
- **Achievement System**: NFT badges for sustainability milestones

### **📊 Advanced Analytics**
- **Data Quality Scoring**: 0-100 quality metrics dengan improvement recommendations
- **Interactive Charts**: Click, filter, sort dengan enhanced tooltips
- **Historical Trends**: LocalStorage persistence dengan percentage change tracking
- **Professional Reports**: Executive-ready PDF exports dengan visual metrics

### **🎮 Gamification**
- **Sustainability Levels**: Eco Champion, Carbon Conscious, Environmental Explorer
- **Achievement Badges**: Carbon Tracker, Data Collector, Blockchain Pioneer, Offset Champion
- **Progress Goals**: Visual tracking menuju sustainability targets

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React

### **Web3 & Blockchain**
- **Wallet Integration**: ethers.js v6
- **Authentication**: SIWE (Sign-In With Ethereum)
- **Network**: Ethereum Sepolia Testnet
- **Smart Contracts**: 
  - Carbon Records (0x874378E56D92a0C4633b27A1730AD0CF8e7b4891)
  - NFT Achievement Certificates (ERC-721)
  - Carbon Credit Tokens (ERC-20)
  - DAO Governance Contract
  - Carbon Offset Contract with dual payments
- **Decentralized Storage**: IPFS integration for data and certificates
- **Oracle**: Chainlink-style price feeds for real-time market data

### **Data Processing**
- **CSV Parsing**: PapaParse
- **PDF Generation**: jsPDF
- **Excel Export**: xlsx (SheetJS)

### **Payment Integration**
- **Crypto Payments**: ETH payments via MetaMask
- **PayPal Integration**: Traditional payment option for wider accessibility
- **Payment Modal**: Unified interface for payment method selection

### **State Management**
- **Local Storage**: Historical data persistence
- **React Hooks**: useState, useEffect, useCallback

---

## 📦 **Installation**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet (optional)

### **Setup**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rantai-3c.git
cd rantai-3c
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

---

## 🚀 **Usage Guide**

### **Quick Start with Demo Data**
1. Navigate to **"About"** tab to understand the platform
2. Click **"Try Demo Data"** for instant exploration
3. Explore features across all 6 tabs

### **Manual Data Upload**
1. Go to **"Cloud"** tab
2. Click **"Choose File"** dan upload CSV/JSON
3. View data validation results dan quality score
4. Proceed to **"Climate"** tab untuk analysis

### **Automated Data Pulling**
1. Navigate to **"Auto Pull"** tab
2. Select cloud provider (AWS/GCP/Azure)
3. Enter API credentials (simulated)
4. Choose date range
5. Click **"Pull Data"** untuk automated import

### **Carbon Analysis**
1. **"Climate"** tab shows calculated emissions
2. Interact with charts (click, filter, sort)
3. Review AI insights dan recommendations
4. View historical trends
5. Export reports (PDF/CSV/Excel)

### **Carbon Offsetting**
1. Go to **"Offset"** tab
2. Review net-zero progress
3. Browse verified Indonesian projects
4. Select project dan purchase offsets
5. Track achievement badges

### **Blockchain Certification**
1. Navigate to **"Chain"** tab
2. **View Mode**: Learn about blockchain benefits
3. **Certify Mode**: Connect MetaMask wallet
4. Sign SIWE message
5. Store carbon record on Sepolia
6. Download JSON certificate

---

## 📁 **Project Structure**

```
rantai-3c/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components
│   │   ├── AboutApp.tsx          # About section
│   │   ├── DataUpload.tsx        # Cloud tab - manual upload
│   │   ├── AutomatedDataPulling.tsx  # Auto pull tab
│   │   ├── CarbonAnalysis.tsx    # Climate analysis
│   │   ├── BlockchainCertification.tsx  # Chain certification
│   │   ├── CarbonOffsetMarketplace.tsx  # Offset marketplace
│   │   ├── DataValidation.tsx    # Validation system
│   │   ├── InteractiveCharts.tsx # Advanced charts
│   │   ├── HistoricalTrends.tsx  # Progress tracking
│   │   └── ExportManager.tsx     # Export utilities
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🔧 **Development**

### **Available Scripts**

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### **Code Quality**
- TypeScript strict mode enabled
- ESLint configured
- Zero console errors
- Mobile-responsive design
- Accessibility best practices

### **Adding New Features**
1. Create component in `src/components/`
2. Define TypeScript interfaces in `src/types/`
3. Import dan integrate in `src/app/page.tsx`
4. Test across devices dan browsers

---

## 🌐 **Smart Contract Details**

### **Network**: Ethereum Sepolia Testnet

### **RPC Endpoint**:
```
https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206
```

### **1. Carbon Records Contract**
**Address**: `0x874378E56D92a0C4633b27A1730AD0CF8e7b4891`

**Functions**:
- `storeRecord(string dataHash, uint256 carbonValue)`: Store carbon record with IPFS hash
- `getRecord(uint256 recordId)`: Retrieve record details
- `totalRecords()`: Get total records count

**Events**:
- `RecordStored(uint256 recordId, address user, uint256 carbonValue, string dataHash)`

### **2. NFT Achievement Certificates (ERC-721)**
**Purpose**: Mint NFT certificates for sustainability achievements and offset purchases

**Functions**:
- `mintAchievement(address to, string achievementType)`: Mint achievement NFT
- `mintOffsetCertificate(address to, uint256 offsetAmount)`: Mint offset NFT with metadata
- `tokenURI(uint256 tokenId)`: Get NFT metadata from IPFS

**Features**:
- On-chain achievement tracking
- IPFS metadata storage
- Permanent proof of contribution
- Every offset purchase includes an NFT certificate

### **3. Carbon Credit Tokens (ERC-20)**
**Purpose**: Tokenized carbon credits for businesses

**Functions**:
- `mint(address to, uint256 amount)`: Issue new carbon credits
- `burn(uint256 amount)`: Retire carbon credits
- `transfer(address to, uint256 amount)`: Transfer credits

**Token Details**:
- Symbol: CRB
- Decimals: 18
- 1 CRB = 1 ton CO₂ equivalent

### **4. DAO Governance Contract**
**Purpose**: Democratic voting on offset projects and platform decisions

**Functions**:
- `createProposal(string description, uint256 votingPeriod)`: Create new proposal
- `vote(uint256 proposalId, bool support)`: Vote on proposal
- `executeProposal(uint256 proposalId)`: Execute passed proposal

**Features**:
- Token-weighted voting
- Transparent proposal system
- On-chain execution

### **5. Carbon Offset Payment Contract**
**Purpose**: Handle dual payment system (Crypto + PayPal)

**Functions**:
- `purchaseOffsetCrypto(uint256 offsetAmount, uint256 projectId)`: Pay with ETH
- `recordPayPalPurchase(address buyer, uint256 offsetAmount, string paypalId)`: Record PayPal payment
- `mintOffsetNFT(address buyer, uint256 offsetAmount)`: Auto-mint NFT after purchase

**Features**:
- Flexible offset amounts (0.01 - 1000 tons)
- Dynamic pricing with Oracle integration
- Automatic NFT certificate minting
- Payment tracking for both crypto and fiat

---

## 📊 **Data Format Specification**

### **Required Fields**
- `date`: Date of consumption (YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY)
- `category`: Energy category (Office, Manufacturing, Data Center, Vehicle, HVAC, Lighting)
- `consumption`: Energy consumption in kWh

### **Optional Fields**
- `location`: Geographic location (e.g., Jakarta, Surabaya)
- `source`: Energy source (Grid, Solar, Wind, Diesel)

### **Supported Formats**
- **CSV**: Comma-separated values
- **JSON**: Array of objects

### **Example CSV**:
```csv
date,category,consumption,location,source
2024-01-15,Office,450,Jakarta,Grid
2024-01-16,Manufacturing,1200,Surabaya,Grid
```

### **Example JSON**:
```json
[
  {
    "date": "2024-01-15",
    "category": "Office",
    "consumption": 450,
    "location": "Jakarta",
    "source": "Grid"
  }
]
```

---

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Green shades (sustainability theme)
- **Secondary**: Blue tones (technology theme)
- **Accent**: Orange/Yellow (energy theme)
- **Neutral**: Gray scale

### **Typography**
- **Font**: System fonts (optimized for performance)
- **Headings**: Bold weights
- **Body**: Regular weights

### **Components**
- ShadCN UI for consistency
- Custom carbon-themed components
- Responsive grid layouts
- Interactive charts dan visualizations

---

## 🚢 **Deployment**

### **Vercel (Recommended)**
1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables (if needed)
4. Deploy

### **Other Platforms**
- Netlify
- AWS Amplify
- Digital Ocean App Platform

### **Build Command**:
```bash
npm run build
```

### **Output Directory**:
```
.next
```

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Contribution Guidelines**
- Follow TypeScript strict mode
- Maintain code quality
- Write descriptive commit messages
- Test across devices
- Update documentation

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Credits**

**Developed by**: [mrbrightsides](https://github.com/mrbrightsides)

**Website**: [rantai.elpeef.com](https://rantai.elpeef.com)

---

## 🌟 **Roadmap**

### **Phase 1: MVP** ✅ (Current)
- [x] Manual data upload
- [x] Carbon footprint calculation
- [x] Blockchain certification
- [x] Basic visualizations

### **Phase 2: Enhanced Analytics** ✅ (Current)
- [x] AI-powered insights
- [x] Historical tracking
- [x] Interactive charts
- [x] Multiple export formats
- [x] Data quality validation

### **Phase 3: Automation & Marketplace** ✅ (Completed)
- [x] Automated data pulling (simulated)
- [x] Carbon offset marketplace
- [x] Gamification system
- [x] Professional PDF reports
- [x] NFT achievement certificates (ERC-721)
- [x] IPFS decentralized storage
- [x] ERC-20 Carbon Credit Tokens
- [x] DAO governance system
- [x] Real-time Oracle integration
- [x] Dual payment system (Crypto + PayPal)
- [x] Flexible offset amounts
- [x] NFT rewards for every purchase

### **Phase 4: Enterprise Features** 🔜 (Future)
- [ ] Real API integrations (AWS, GCP, Azure)
- [ ] Backend database (PostgreSQL/MongoDB)
- [ ] User authentication system
- [ ] Multi-user/team features
- [ ] Role-based access control
- [ ] Payment processing untuk offsets
- [ ] API layer untuk external integrations

### **Phase 5: Scale & Optimize** 🔜 (Future)
- [ ] Mainnet deployment (Base blockchain)
- [ ] Real ML models untuk predictions
- [ ] Mobile app (React Native)
- [ ] Advanced analytics suite
- [ ] Regulatory compliance templates
- [ ] Public transparency dashboard

---

## 📞 **Support**

For questions, issues, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/mrbrightsides/rantai-3c/issues)
- **GitHub Repository**: [github.com/mrbrightsides/3c](https://github.com/mrbrightsides/rantai-3c)
- **Telegram**: [@khudriakhmad](https://t.me/khudriakhmad)
- **Discord**: [@khudri_61362](https://discord.com/channels/@khudri_61362)
- **Email**: support@rantai.elpeef.com
- **Website**: [rantai.elpeef.com](https://rantai.elpeef.com)

---

## 🙏 **Acknowledgments**

- **Next.js Team**: For amazing React framework
- **ShadCN**: For beautiful UI components
- **Ethereum Foundation**: For blockchain infrastructure
- **Indonesian Sustainability Projects**: For verified offset opportunities
- **Open Source Community**: For incredible tools dan libraries

---

## 📈 **Statistics**

- **Total Lines of Code**: ~5,000+
- **Components**: 20+ custom components
- **Features**: 40+ major features
- **Supported Formats**: CSV, JSON, PDF, Excel
- **Blockchain Network**: Ethereum Sepolia Testnet
- **Smart Contracts**: 5 deployed contracts
- **Carbon Projects**: 4 verified Indonesian initiatives
- **Payment Methods**: 2 (Crypto & PayPal)
- **NFT Types**: Achievement badges & offset certificates

---

## 🎯 **Use Cases**

### **For Organizations**
- ESG compliance reporting
- Carbon footprint monitoring
- Sustainability goal tracking
- Stakeholder reporting

### **For Sustainability Managers**
- Data-driven decision making
- Progress tracking over time
- Identify high-emission areas
- Carbon offset planning

### **For Consultants**
- Client demonstrations
- Carbon audit tools
- Report generation
- Advisory services

### **For Educators**
- Environmental awareness
- Blockchain education
- Sustainability training
- Data analysis teaching

---

## 🌍 **Impact**

RANTAI 3C aims to contribute to:
- **UN Sustainable Development Goals**: Climate Action (SDG 13)
- **Paris Agreement**: Net-zero emissions by 2050
- **Indonesian Climate Targets**: 29% emission reduction by 2030
- **Corporate ESG Goals**: Transparent environmental reporting

---

<div align="center">

**Built with ❤️ for a sustainable future**

🌱 **RANTAI 3C** - Integrating Technology for a Sustainable Future 🌍

[Website](https://rantai.elpeef.com) • [GitHub](https://github.com/mrbrightsides) • [Documentation](#)

</div>
