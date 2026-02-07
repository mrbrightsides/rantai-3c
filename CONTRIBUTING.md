# Contributing to RANTAI 3C

Thank you for considering contributing to RANTAI 3C! This platform aims to make carbon management accessible and transparent for Indonesian SMEs through blockchain technology. All contributions, whether code, documentation, or ideas, are valuable to the project.

## Ways to Contribute

### 1. Code Contributions
- Fix bugs and issues
- Implement new features
- Optimize performance
- Improve smart contracts
- Enhance UI/UX

### 2. Documentation
- Improve README and guides
- Add code comments
- Create tutorials
- Translate documentation (especially to Bahasa Indonesia)

### 3. Bug Reports
- Report issues you encounter
- Provide detailed reproduction steps
- Include screenshots when relevant

### 4. Feature Requests
- Suggest new features
- Propose improvements
- Share use case ideas

### 5. Testing
- Test new features
- Verify bug fixes
- Perform security reviews

### 6. Translations
- Translate UI elements to Bahasa Indonesia
- Localize documentation
- Adapt content for regional audiences

### 7. Design
- Create UI mockups
- Design icons and graphics
- Improve accessibility

## Development Setup

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **pnpm**: Latest version
- **Git**: For version control
- **MetaMask** or compatible Web3 wallet
- **Ethereum Testnet**: Sepolia testnet ETH for testing

### Local Setup

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/3c.git
   cd 3c
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set Up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

   **Getting API Keys**:
   - **Pinata**: Sign up at [pinata.cloud](https://pinata.cloud) for IPFS storage
   - **PayPal**: Create sandbox account at [developer.paypal.com](https://developer.paypal.com)
   - **Alchemy**: Get API key at [alchemy.com](https://alchemy.com) for Ethereum access

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Connect Wallet**
   - Install MetaMask browser extension
   - Switch to Sepolia testnet
   - Get testnet ETH from [sepoliafaucet.com](https://sepoliafaucet.com)

## Project Structure

Understanding the codebase organization:

```
3c/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main dashboard
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── AutomatedDataPulling.tsx
│   │   ├── BlockchainCertification.tsx
│   │   ├── CarbonAnalysis.tsx
│   │   └── ... (other feature components)
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript type definitions
│   ├── contracts/             # Smart contract ABIs
│   └── lib/                   # Configuration & libraries
│
├── public/                    # Static assets
├── ARCHITECTURE.md           # Technical documentation
├── CONTRIBUTING.md           # This file
└── README.md                 # Project overview
```

### Key Directories

- **`src/app/`**: Next.js 15 app router pages and API routes
- **`src/components/`**: React components organized by feature
- **`src/hooks/`**: Custom hooks for reusable logic
- **`src/utils/`**: Utility functions for blockchain, IPFS, calculations
- **`src/types/`**: TypeScript interfaces and types
- **`src/contracts/`**: Smart contract ABIs (JSON format)

## Code Standards

### TypeScript Guidelines

- **Strict Typing**: All variables and functions must have explicit types
- **No Implicit Any**: Avoid `any` type; use specific types or `unknown`
- **Interface Definitions**: Define interfaces for all data structures
- **Type Imports**: Use `import type` for type-only imports

**Example**:
```typescript
// ✅ Good
interface CarbonRecord {
  amount: number;
  timestamp: number;
  source: string;
}

const addRecord = (record: CarbonRecord): void => {
  // implementation
};

// ❌ Bad
const addRecord = (record: any) => {
  // implementation
};
```

### Component Patterns

- **Functional Components**: Use function components with hooks
- **Props Interface**: Define props interface for every component
- **Default Props**: Use destructuring with default values
- **Component Organization**: One component per file

**Example**:
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
};
```

### Styling Conventions

- **Tailwind CSS**: Use Tailwind utility classes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation, color contrast
- **Dark Mode**: Support dark mode where applicable (not yet implemented)

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(offset): add PayPal payment integration

Implemented PayPal REST API integration for carbon offset purchases.
Users can now pay with PayPal in addition to crypto wallets.

Closes #42
```

```
fix(ipfs): handle upload timeout errors

Added retry logic and better error handling for IPFS uploads.
Displays user-friendly error messages on timeout.
```

## Smart Contract Development

### Solidity Guidelines

- **Compiler Version**: Solidity ^0.8.0
- **Security**: Follow OpenZeppelin patterns
- **Gas Optimization**: Minimize storage operations
- **Events**: Emit events for all state changes
- **Access Control**: Use modifiers for restricted functions

**Example**:
```solidity
// ✅ Good
contract CarbonRecord {
    event EmissionRecorded(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    function recordEmission(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        
        // ... logic
        
        emit EmissionRecorded(msg.sender, amount, block.timestamp);
    }
}
```

### Testing Smart Contracts

- **Framework**: Hardhat or Foundry
- **Coverage**: Aim for >90% code coverage
- **Test Cases**: Include edge cases and error conditions
- **Gas Reports**: Include gas usage reports

### Deployment Process

1. **Test on Local Network**: Hardhat network or Ganache
2. **Deploy to Testnet**: Sepolia for Ethereum
3. **Verify Contracts**: Verify on Etherscan
4. **Update Frontend**: Update contract addresses and ABIs
5. **Document Changes**: Update ARCHITECTURE.md

## Testing Guidelines

### Unit Tests

- **Framework**: Jest + React Testing Library
- **Coverage**: Target >80% coverage
- **Mocking**: Mock external dependencies
- **Assertions**: Clear and descriptive assertions

**Example**:
```typescript
import { render, screen } from '@testing-library/react';
import { CarbonAnalysis } from '@/components/CarbonAnalysis';

describe('CarbonAnalysis', () => {
  it('displays total emissions correctly', () => {
    render(<CarbonAnalysis data={mockData} />);
    expect(screen.getByText('1,234 kg CO2')).toBeInTheDocument();
  });
});
```

### Integration Tests

- Test component interactions
- Verify API integrations
- Test Web3 wallet connections
- Validate smart contract interactions

### End-to-End Tests

- **Framework**: Playwright or Cypress
- **Scenarios**: Complete user workflows
- **Network**: Test on local blockchain fork

## Pull Request Process

### Before Submitting

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow code standards
   - Add tests for new features

3. **Test Locally**
   ```bash
   npm run dev
   npm run build
   npm run test  # if tests exist
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting PR

1. **Create Pull Request** on GitHub
2. **Fill Out Template**:
   - Description of changes
   - Related issue number
   - Screenshots (if UI changes)
   - Testing performed

3. **Request Review** from maintainers

4. **Address Feedback**:
   - Make requested changes
   - Push updates to same branch
   - Respond to comments

5. **Merge**:
   - Maintainer will merge when approved
   - Delete feature branch after merge

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Local development server
- [ ] Build production bundle
- [ ] Testnet deployment
- [ ] Unit tests
- [ ] Integration tests

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
```

## Issue Reporting

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Wallet: [e.g., MetaMask 11.0]
- Network: [e.g., Sepolia]

**Additional Context**
Any other relevant information.
```

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Mockups, examples, or references.
```

## Review Process

### Code Review Criteria

Reviewers will evaluate:

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Clean, readable, maintainable?
3. **Performance**: No unnecessary performance impacts?
4. **Security**: No vulnerabilities introduced?
5. **Testing**: Adequate test coverage?
6. **Documentation**: Clear comments and docs?
7. **Standards**: Follows project conventions?

### Review Timeline

- **Initial Review**: Within 48 hours
- **Follow-up**: Within 24 hours of updates
- **Merge**: When all reviewers approve

### Approval Requirements

- **Code Changes**: 1 maintainer approval
- **Smart Contracts**: 2 maintainer approvals + security review
- **Breaking Changes**: Team discussion + consensus

## Community Guidelines

### Code of Conduct

- **Respectful**: Treat everyone with respect
- **Inclusive**: Welcome diverse perspectives
- **Constructive**: Provide helpful feedback
- **Professional**: Maintain professional communication
- **Collaborative**: Work together toward common goals

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Telegram**: [@khudriakhmad](https://t.me/khudriakhmad)
- **Discord**: @khudri_61362
- **Email**: support@rantai3c.com

### Getting Help

- **Documentation**: Check README and ARCHITECTURE.md
- **Issues**: Search existing issues first
- **Discussions**: Ask questions in GitHub Discussions
- **Contact**: Reach out via Telegram or Discord

## Recognition

### Contributor Credits

All contributors will be:
- Listed in project README
- Mentioned in release notes
- Acknowledged in documentation

### Significant Contributions

Major contributors may:
- Become project maintainers
- Get special recognition badges
- Be featured in project highlights

---

## License

By contributing to RANTAI 3C, you agree that your contributions will be licensed under the same license as the project.

## Questions?

If you have questions about contributing, reach out through any of the communication channels listed above. The team is happy to help!

---

**Thank you for contributing to RANTAI 3C and helping make carbon management accessible to everyone!** 🌱

---

*Last Updated: January 2025*
