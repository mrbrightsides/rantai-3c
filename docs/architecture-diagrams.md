# RANTAI 3C - Architecture Diagrams (Mermaid)

## 1. High-Level System Architecture (3-Pillar Model)

```mermaid
graph TB
    subgraph "RANTAI 3C Platform"
        subgraph "☁️ CLOUD - Data Infrastructure"
            A1[Manual Upload<br/>CSV/JSON]
            A2[Automated Data Pull<br/>AWS/GCP/Azure]
            A3[Data Validation<br/>Quality Scoring]
            A4[Cloud Storage<br/>LocalStorage/Backend]
        end
        
        subgraph "🌡️ CLIMATE - Analytics Engine"
            B1[Carbon Calculator<br/>Emission Factors]
            B2[AI Insights<br/>Pattern Analysis]
            B3[Interactive Charts<br/>Visualization]
            B4[Historical Trends<br/>Progress Tracking]
            B5[Carbon Offset<br/>Marketplace]
        end
        
        subgraph "🔗 CHAIN - Blockchain Layer"
            C1[SIWE Authentication<br/>MetaMask]
            C2[Smart Contract<br/>Sepolia Testnet]
            C3[Immutable Records<br/>On-Chain Storage]
            C4[Certificate Generation<br/>Verification]
        end
    end
    
    subgraph "👥 Users"
        U1[Organizations]
        U2[Sustainability Managers]
        U3[Consultants]
        U4[Regulators]
    end
    
    subgraph "📊 Outputs"
        O1[PDF Reports]
        O2[CSV/Excel Exports]
        O3[Blockchain Certificate]
        O4[JSON Certificate]
    end
    
    U1 --> A1
    U1 --> A2
    U2 --> A1
    U3 --> A1
    
    A1 --> A3
    A2 --> A3
    A3 --> A4
    
    A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    
    B5 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> C4
    
    B3 --> O1
    B3 --> O2
    C4 --> O3
    C4 --> O4
    
    O1 --> U4
    O2 --> U2
    O3 --> U4
    
    style A1 fill:#e3f2fd
    style A2 fill:#e3f2fd
    style B1 fill:#e8f5e9
    style B2 fill:#e8f5e9
    style B5 fill:#e8f5e9
    style C1 fill:#fff3e0
    style C2 fill:#fff3e0
    style C3 fill:#fff3e0
```

---

## 2. Detailed Data Flow Diagram

```mermaid
flowchart LR
    subgraph "Input Layer"
        I1[📄 CSV File]
        I2[📋 JSON File]
        I3[☁️ AWS CloudWatch]
        I4[☁️ Google Cloud]
        I5[☁️ Azure Monitor]
    end
    
    subgraph "Processing Layer"
        P1[File Parser<br/>PapaParse]
        P2[Data Validator<br/>Quality Check]
        P3[Carbon Calculator<br/>Emission Factors]
        P4[AI Analysis Engine<br/>Pattern Recognition]
    end
    
    subgraph "Storage Layer"
        S1[LocalStorage<br/>Client-Side]
        S2[Historical Records<br/>Time Series]
    end
    
    subgraph "Analytics Layer"
        A1[📊 Interactive Charts<br/>Bar/Pie/Line]
        A2[🤖 AI Insights<br/>4 Analysis Types]
        A3[📈 Trends<br/>Progress Tracking]
        A4[🌱 Offset Calculator<br/>Net-Zero Path]
    end
    
    subgraph "Blockchain Layer"
        B1[🔐 SIWE Auth<br/>Sign Message]
        B2[📝 Smart Contract<br/>storeRecord Function]
        B3[⛓️ Sepolia Testnet<br/>Transaction Hash]
    end
    
    subgraph "Export Layer"
        E1[📄 PDF Report<br/>jsPDF]
        E2[📊 Excel Export<br/>XLSX]
        E3[📋 CSV Export<br/>Raw Data]
        E4[🎫 JSON Certificate<br/>Blockchain Proof]
    end
    
    I1 --> P1
    I2 --> P1
    I3 --> P1
    I4 --> P1
    I5 --> P1
    
    P1 --> P2
    P2 --> P3
    P3 --> P4
    
    P4 --> S1
    S1 --> S2
    
    S2 --> A1
    S2 --> A2
    S2 --> A3
    S2 --> A4
    
    A1 --> E1
    A1 --> E2
    A1 --> E3
    
    A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> E4
    
    style P3 fill:#c8e6c9
    style P4 fill:#c8e6c9
    style A2 fill:#fff9c4
    style B2 fill:#ffe0b2
    style B3 fill:#ffe0b2
```

---

## 3. Component Architecture (Technical Stack)

```mermaid
graph TB
    subgraph "Frontend - Next.js 14"
        subgraph "UI Components"
            UI1[ShadCN/UI<br/>Button, Card, Tabs]
            UI2[Lucide Icons<br/>Visual Elements]
            UI3[Sonner<br/>Toast Notifications]
        end
        
        subgraph "Data Visualization"
            V1[Recharts<br/>Charts Library]
            V2[Interactive Filters<br/>Category/Sort]
        end
        
        subgraph "Web3 Integration"
            W1[ethers.js v6<br/>Ethereum Provider]
            W2[SIWE<br/>Sign-In With Ethereum]
            W3[MetaMask<br/>Wallet Connection]
        end
        
        subgraph "Data Processing"
            D1[PapaParse<br/>CSV Parser]
            D2[TypeScript<br/>Type Safety]
            D3[LocalStorage API<br/>Data Persistence]
        end
        
        subgraph "Export Modules"
            X1[jsPDF<br/>PDF Generation]
            X2[xlsx<br/>Excel Export]
        end
    end
    
    subgraph "Blockchain Layer"
        BC1[Sepolia Testnet<br/>Ethereum L2]
        BC2[Smart Contract<br/>0x8743...4891]
        BC3[Infura RPC<br/>Node Provider]
    end
    
    subgraph "External Data Sources"
        EXT1[AWS CloudWatch API<br/>Simulated]
        EXT2[Google Cloud API<br/>Simulated]
        EXT3[Azure Monitor API<br/>Simulated]
    end
    
    UI1 --> V1
    UI3 --> W1
    
    D1 --> D2
    D2 --> D3
    
    W1 --> W2
    W2 --> W3
    W3 --> BC3
    BC3 --> BC2
    BC2 --> BC1
    
    D3 --> V1
    V1 --> X1
    V1 --> X2
    
    EXT1 --> D1
    EXT2 --> D1
    EXT3 --> D1
    
    style UI1 fill:#e1f5fe
    style V1 fill:#f3e5f5
    style W1 fill:#fff3e0
    style BC2 fill:#ffecb3
    style X1 fill:#c8e6c9
```

---

## 4. User Journey Flow

```mermaid
journey
    title RANTAI 3C User Journey
    section Discovery
      Visit Website: 5: User
      Read "Tentang App": 4: User
      Click "Try Demo Data": 5: User
    section Data Input
      View Demo Analysis: 5: User
      Upload Own CSV/JSON: 4: User
      Or Connect Cloud Provider: 3: User
    section Analysis
      View Data Quality Score: 4: User
      Explore Interactive Charts: 5: User
      Read AI Insights: 5: User
      Check Historical Trends: 4: User
    section Offset
      Calculate Offset Cost: 4: User
      Select Indonesian Project: 5: User
      Purchase Carbon Offset: 4: User
    section Certification
      Learn About Blockchain: 3: User
      Connect MetaMask Wallet: 3: User
      Sign SIWE Message: 4: User
      Store on Blockchain: 5: User
    section Export
      Download PDF Report: 5: User
      Export CSV/Excel: 4: User
      Download Certificate: 5: User
      Share with Stakeholders: 5: User
```

---

## 5. Blockchain Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as MetaMask
    participant S as SIWE
    participant SC as Smart Contract
    participant B as Sepolia Blockchain
    
    U->>F: Click "Connect Wallet"
    F->>M: Request Account Access
    M->>U: Approve Connection?
    U->>M: Approve
    M->>F: Return Address
    
    F->>U: Display Connected Address
    U->>F: Click "Certify on Blockchain"
    
    F->>S: Generate SIWE Message
    S->>F: Return Message String
    F->>M: Request Signature
    M->>U: Sign Message?
    U->>M: Sign
    M->>F: Return Signature
    
    F->>S: Verify Signature
    S->>F: Verification Success
    
    F->>SC: Call storeRecord(dataHash, carbonValue)
    SC->>B: Submit Transaction
    B->>SC: Transaction Hash
    SC->>F: Return Transaction Details
    
    F->>U: Display Success + Hash
    F->>F: Generate JSON Certificate
    U->>F: Download Certificate
    
    Note over U,B: Immutable record created<br/>on Sepolia testnet
```

---

## 6. Carbon Offset Marketplace Flow

```mermaid
graph LR
    subgraph "User Carbon Data"
        CD[Total Emissions<br/>1000 kgCO₂]
    end
    
    subgraph "Offset Calculation"
        OC1[Calculate Offset Need<br/>1000 kg = 1 ton]
        OC2[Show Available Projects<br/>4 Indonesian Initiatives]
    end
    
    subgraph "Project Selection"
        P1[🌳 Rainforest<br/>$15/ton<br/>Kalimantan]
        P2[☀️ Solar Farm<br/>$12/ton<br/>West Java]
        P3[🌊 Mangrove<br/>$18/ton<br/>Sulawesi]
        P4[🏭 Carbon Capture<br/>$25/ton<br/>Jakarta]
    end
    
    subgraph "Purchase Flow"
        PF1[Select Project]
        PF2[Review Cost<br/>$15 for 1 ton]
        PF3[Confirm Purchase<br/>Simulated]
        PF4[Update Net Emissions<br/>1000 - 1000 = 0]
    end
    
    subgraph "Achievement"
        A1[🏆 Net Zero Badge<br/>Unlocked]
        A2[📊 Progress: 100%<br/>Carbon Neutral]
    end
    
    CD --> OC1
    OC1 --> OC2
    OC2 --> P1
    OC2 --> P2
    OC2 --> P3
    OC2 --> P4
    
    P1 --> PF1
    P2 --> PF1
    P3 --> PF1
    P4 --> PF1
    
    PF1 --> PF2
    PF2 --> PF3
    PF3 --> PF4
    
    PF4 --> A1
    PF4 --> A2
    
    style CD fill:#ffcdd2
    style P1 fill:#c8e6c9
    style P2 fill:#fff9c4
    style P3 fill:#b3e5fc
    style P4 fill:#e1bee7
    style A1 fill:#ffd54f
    style A2 fill:#81c784
```

---

## 7. AI Insights Generation Process

```mermaid
flowchart TD
    Start[Energy Data Input] --> Parse[Parse & Validate Data]
    
    Parse --> Calc[Calculate Carbon Footprint<br/>by Category]
    
    Calc --> Analysis{AI Analysis Engine}
    
    Analysis --> |Pattern Analysis| P1[Identify Peak Usage<br/>Seasonal Trends<br/>Category Distribution]
    
    Analysis --> |Efficiency Optimization| P2[Compare to Benchmarks<br/>Detect Inefficiencies<br/>Calculate Potential Savings]
    
    Analysis --> |Predictive Analytics| P3[Forecast Future Emissions<br/>Predict Reduction Scenarios<br/>Model Interventions]
    
    Analysis --> |Industry Benchmarking| P4[Compare to Industry Avg<br/>Rank Performance<br/>Identify Best Practices]
    
    P1 --> Insights[Generate Actionable Insights]
    P2 --> Insights
    P3 --> Insights
    P4 --> Insights
    
    Insights --> Recommend[Priority Recommendations<br/>High/Medium/Low Impact]
    
    Recommend --> Visual[Visualization<br/>Charts & Metrics]
    
    Visual --> Export[Export Options<br/>PDF/Excel/CSV]
    
    style Start fill:#e3f2fd
    style Analysis fill:#fff3e0
    style P1 fill:#c8e6c9
    style P2 fill:#c8e6c9
    style P3 fill:#c8e6c9
    style P4 fill:#c8e6c9
    style Insights fill:#fff9c4
    style Recommend fill:#ffccbc
```

---

## 8. System Deployment Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Web Browser<br/>Desktop/Mobile]
        C2[MetaMask Extension<br/>Wallet Provider]
    end
    
    subgraph "Frontend Hosting - Vercel"
        V1[Next.js App<br/>Edge Functions]
        V2[Static Assets<br/>CDN]
        V3[API Routes<br/>Serverless]
    end
    
    subgraph "Data Layer"
        D1[Client LocalStorage<br/>Historical Data]
        D2[Future: PostgreSQL<br/>Backend Database]
    end
    
    subgraph "Blockchain Infrastructure"
        B1[Infura RPC Node<br/>Sepolia Access]
        B2[Sepolia Testnet<br/>Ethereum L2]
        B3[Smart Contract<br/>Carbon Records]
    end
    
    subgraph "External APIs"
        E1[AWS CloudWatch<br/>Simulated]
        E2[Google Cloud APIs<br/>Simulated]
        E3[Azure Monitor<br/>Simulated]
    end
    
    C1 --> V1
    C2 --> V1
    V1 --> V2
    V1 --> V3
    
    V1 --> D1
    V1 -.Future.-> D2
    
    V3 --> E1
    V3 --> E2
    V3 --> E3
    
    C2 --> B1
    B1 --> B2
    B2 --> B3
    
    style V1 fill:#000000,color:#ffffff
    style V2 fill:#000000,color:#ffffff
    style B2 fill:#627eea,color:#ffffff
    style B3 fill:#627eea,color:#ffffff
```

---

## 9. Data Quality Validation Pipeline

```mermaid
flowchart LR
    Input[Raw Data Input] --> Check1{Required Fields<br/>Present?}
    
    Check1 -->|No| Error1[❌ Missing Fields Error]
    Check1 -->|Yes| Check2{Date Format<br/>Valid?}
    
    Check2 -->|No| Error2[❌ Date Format Error]
    Check2 -->|Yes| Check3{Consumption<br/>Numeric?}
    
    Check3 -->|No| Error3[❌ Invalid Value Error]
    Check3 -->|Yes| Check4{Category<br/>Recognized?}
    
    Check4 -->|No| Warn1[⚠️ Unknown Category]
    Check4 -->|Yes| Check5{Optional Fields<br/>Present?}
    
    Check5 -->|No| Warn2[⚠️ Incomplete Data]
    Check5 -->|Yes| Score1[✅ 100% Quality Score]
    
    Warn1 --> Score2[✅ 80% Quality Score]
    Warn2 --> Score3[✅ 60% Quality Score]
    
    Error1 --> Reject[Reject Record]
    Error2 --> Reject
    Error3 --> Reject
    
    Score1 --> Accept[Accept & Process]
    Score2 --> Accept
    Score3 --> Accept
    
    Accept --> Calculate[Carbon Calculation]
    
    style Input fill:#e3f2fd
    style Error1 fill:#ffcdd2
    style Error2 fill:#ffcdd2
    style Error3 fill:#ffcdd2
    style Warn1 fill:#fff9c4
    style Warn2 fill:#fff9c4
    style Score1 fill:#c8e6c9
    style Score2 fill:#c8e6c9
    style Score3 fill:#c8e6c9
```

---

## 10. Complete Feature Map

```mermaid
mindmap
  root((RANTAI 3C))
    ☁️ Cloud
      Manual Upload
        CSV Parser
        JSON Parser
        Drag & Drop
      Automated Pull
        AWS Integration
        GCP Integration
        Azure Integration
      Data Validation
        Quality Scoring
        Error Detection
        Format Checking
      Cloud Metrics
        Storage Usage
        Processing Speed
        Scalability Score
    🌡️ Climate
      Carbon Calculator
        Emission Factors
        Category Breakdown
        Total Calculation
      AI Insights
        Pattern Analysis
        Efficiency Tips
        Predictive Models
        Benchmarking
      Visualization
        Interactive Charts
        Filters & Sorting
        Drill-down
        Multiple Chart Types
      Historical Trends
        Progress Tracking
        Trend Analysis
        Percentage Change
      Carbon Offset
        Project Marketplace
        Net-Zero Calculator
        Indonesian Projects
        Impact Metrics
    🔗 Chain
      Authentication
        SIWE Protocol
        MetaMask
        Wallet Connection
      Smart Contract
        storeRecord Function
        getRecord Function
        Event Emission
      Blockchain
        Sepolia Testnet
        Infura RPC
        Transaction Hash
      Certification
        JSON Certificate
        Download Option
        Verification
    📊 Export
      PDF Reports
        Executive Summary
        Detailed Breakdown
        Professional Format
      Excel Export
        Multi-sheet
        Formatted Tables
      CSV Export
        Raw Data
        Analysis Ready
      JSON Certificate
        Blockchain Proof
        Metadata Included
```

---

## Usage Instructions

### For Conference Presentation:
- **Slide 1**: Use Diagram #1 (High-Level Architecture)
- **Slide 2**: Use Diagram #2 (Data Flow)
- **Slide 3**: Use Diagram #5 (Blockchain Integration)
- **Slide 4**: Use Diagram #6 (Offset Marketplace)

### For Technical Documentation:
- **Overview**: Diagram #1
- **Implementation**: Diagram #3 (Component Architecture)
- **Deployment**: Diagram #8

### For Poster:
- **Center**: Diagram #1 or #10 (Feature Map)
- **Side panels**: Diagrams #5, #6, #7

### Converting to Images:
1. Use online tools: mermaid.live, mermaid-js.github.io/mermaid-live-editor
2. Or use VS Code extension: "Markdown Preview Mermaid Support"
3. Export as PNG/SVG for high-quality printing

### Styling Tips:
- For dark backgrounds: Add `%%{init: {'theme':'dark'}}%%` at top
- For light backgrounds: Add `%%{init: {'theme':'default'}}%%`
- Custom colors already applied with `style` statements
