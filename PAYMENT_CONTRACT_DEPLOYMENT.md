# Carbon Offset Payment Contract Deployment Guide

## Smart Contract Details

**Contract Name:** CarbonOffsetPayment
**Purpose:** Handle crypto payments for carbon offset purchases
**Network:** Ethereum (or any EVM-compatible chain)

## Contract Features

- ✅ Accept ETH/crypto payments for offset purchases
- ✅ Store purchase records on-chain
- ✅ Link to IPFS certificate hashes
- ✅ Get purchase history per wallet
- ✅ Track total offset amounts globally
- ✅ Owner can withdraw funds

## Deployment Steps

### 1. Prepare Solidity Contract

Create `CarbonOffsetPayment.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CarbonOffsetPayment {
    address public owner;
    uint256 public totalPurchases;
    uint256 public totalOffsetAmount; // in grams (kg * 1000)

    struct Purchase {
        string projectId;
        uint256 offsetAmount; // in grams
        uint256 amountPaid; // in wei
        uint256 timestamp;
        string ipfsHash;
    }

    mapping(address => Purchase[]) public purchaseHistory;

    event OffsetPurchased(
        address indexed buyer,
        string projectId,
        uint256 offsetAmount,
        uint256 amountPaid,
        uint256 timestamp
    );

    event FundsWithdrawn(address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @dev Purchase carbon offset with ETH payment
     * @param projectId ID of the offset project
     * @param offsetAmount Amount of CO₂ to offset (in grams)
     * @param ipfsHash IPFS hash of the certificate
     */
    function purchaseOffset(
        string memory projectId,
        uint256 offsetAmount,
        string memory ipfsHash
    ) external payable returns (uint256) {
        require(msg.value > 0, "Payment required");
        require(offsetAmount > 0, "Offset amount must be positive");

        Purchase memory newPurchase = Purchase({
            projectId: projectId,
            offsetAmount: offsetAmount,
            amountPaid: msg.value,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });

        purchaseHistory[msg.sender].push(newPurchase);
        totalPurchases++;
        totalOffsetAmount += offsetAmount;

        emit OffsetPurchased(
            msg.sender,
            projectId,
            offsetAmount,
            msg.value,
            block.timestamp
        );

        return totalPurchases;
    }

    /**
     * @dev Get purchase history for an address
     */
    function getPurchaseHistory(address buyer)
        external
        view
        returns (Purchase[] memory)
    {
        return purchaseHistory[buyer];
    }

    /**
     * @dev Get total offset amount globally
     */
    function getTotalOffsetAmount() external view returns (uint256) {
        return totalOffsetAmount;
    }

    /**
     * @dev Get total number of purchases
     */
    function getTotalPurchases() external view returns (uint256) {
        return totalPurchases;
    }

    /**
     * @dev Owner can withdraw collected funds
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
```

### 2. Deploy Using Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create new file `CarbonOffsetPayment.sol`
3. Paste the contract code above
4. Compile with Solidity 0.8.9
5. Connect MetaMask to your desired network:
   - **Mainnet** (real money)
   - **Sepolia Testnet** (free test ETH)
   - **Base** (L2 for lower fees)
6. Deploy the contract
7. Copy the deployed contract address

### 3. Update Frontend Configuration

After deployment, update `src/utils/offsetPayment.ts`:

```typescript
// Replace this line:
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// With your deployed contract address:
const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE';
```

### 4. Get Test ETH (if using testnet)

For Sepolia testnet:
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)

### 5. Test the Integration

1. Connect wallet to the app
2. Select an offset project
3. Choose "Pay with Crypto Wallet"
4. Confirm transaction in MetaMask
5. Verify:
   - Transaction appears on Etherscan
   - NFT certificate is minted
   - Purchase history is recorded

## Network Recommendations

| Network | Gas Fees | Speed | Recommendation |
|---------|----------|-------|----------------|
| Ethereum Mainnet | High | Medium | Production (if budget allows) |
| Base | Very Low | Fast | **Recommended for production** |
| Polygon | Low | Fast | Good alternative |
| Sepolia Testnet | Free | Medium | Testing only |

## Contract Interaction Examples

### Purchase Offset
```javascript
await contract.purchaseOffset(
  "reforest-indo",           // projectId
  5200,                       // 5.2 kg = 5200 grams
  "QmXXX...",                // IPFS hash
  { value: ethers.parseEther("0.0015") }  // Payment in ETH
);
```

### Get Purchase History
```javascript
const history = await contract.getPurchaseHistory(userAddress);
console.log(history); // Array of Purchase structs
```

### Get Global Stats
```javascript
const total = await contract.getTotalOffsetAmount();
console.log(`Total offset: ${total / 1000} kg CO₂`);
```

## Security Notes

- ✅ Contract is ownable (only you can withdraw funds)
- ✅ All purchases are permanently recorded on-chain
- ✅ IPFS hashes ensure certificate integrity
- ✅ No upgradability = immutable and trustless
- ⚠️ Consider getting contract audited for mainnet deployment

## After Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract address updated in `offsetPayment.ts`
- [ ] Test purchase with small amount
- [ ] Verify transaction on block explorer
- [ ] Confirm NFT minting works
- [ ] Check purchase history retrieval
- [ ] Test fund withdrawal (owner only)
- [ ] Document contract address for users
- [ ] Add contract address to submission materials

## Support

If you encounter issues:
1. Check MetaMask is connected to correct network
2. Ensure you have enough ETH for gas + payment
3. Verify contract address is correct
4. Check browser console for errors
5. Test on testnet first before mainnet

---

**Ready to deploy?** Follow the steps above and update the contract address in the code! 🚀
