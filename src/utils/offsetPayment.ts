import { ethers } from 'ethers';
import CarbonOffsetPaymentABI from '@/contracts/CarbonOffsetPayment.json';

const CONTRACT_ADDRESS = '0x619971f4F2ED840fB0fCD344c95fc90BE1037c44';

export async function purchaseOffsetWithCrypto(
  provider: ethers.providers.Web3Provider,
  projectId: string,
  offsetAmount: number,
  pricePerKg: number,
  ipfsHash: string
) {
  try {

    if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
      throw new Error("Invalid contract address");
    }

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CarbonOffsetPaymentABI.abi,
      signer
    );


    const totalCostUSD = offsetAmount * pricePerKg;

    const ethPrice = 0.0003;

    const paymentAmount = ethers.utils.parseEther(
      (totalCostUSD * ethPrice).toString()
    );


    const tx = await contract.purchaseOffset(
      projectId,
      Math.floor(offsetAmount * 1000),
      ipfsHash,
      {
        value: paymentAmount
      }
    );


    const receipt = await tx.wait();


    return {
      success:true,
      transactionHash: receipt.transactionHash
    };

  } catch(err:any){

    console.error("Crypto payment error:",err);

    return {
      success:false,
      error:err.message
    };
  }
}

/**
 * Get purchase history for connected wallet
 */
export async function getPurchaseHistory(
  provider: ethers.BrowserProvider,
  address: string
): Promise<PurchaseRecord[]> {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CarbonOffsetPaymentABI.abi,
      provider
    );

    const history = await contract.getPurchaseHistory(address);

    return history.map((record: any) => ({
      projectId: record.projectId,
      offsetAmount: Number(record.offsetAmount) / 1000, // Convert back from grams
      amountPaid: Number(ethers.utils.formatEther(record.amountPaid)),
      timestamp: Number(record.timestamp),
      ipfsHash: record.ipfsHash,
    }));
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
}

/**
 * Get total offset amount across all purchases
 */
export async function getTotalOffsetAmount(
  provider: ethers.BrowserProvider
): Promise<number> {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CarbonOffsetPaymentABI.abi,
      provider
    );

    const total = await contract.getTotalOffsetAmount();
    return Number(total) / 1000; // Convert from grams to kg
  } catch (error) {
    console.error('Error fetching total offset:', error);
    return 0;
  }
}

/**
 * Generate PayPal payment link
 */
export function generatePayPalLink(
  amount: number,
  projectName: string,
  offsetAmount: number
): string {
  const paypalMeUsername = 'akhmadkhudri';
  const description = encodeURIComponent(
    `Carbon Offset: ${offsetAmount.toFixed(2)}kg CO₂ via ${projectName}`
  );
  
  // PayPal.me format: https://www.paypal.com/paypalme/username/amount
  return `https://www.paypal.com/paypalme/${paypalMeUsername}/${amount.toFixed(2)}USD`;
}

/**
 * Validate contract address is set
 */
export function isContractDeployed(): boolean {
  return CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}
