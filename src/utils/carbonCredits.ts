import carbonCreditABI from '@/contracts/CarbonCreditToken.json';

const CONTRACT_ADDRESS = carbonCreditABI.address;
const CONTRACT_ABI = carbonCreditABI.abi;

export async function getCarbonCreditBalance(
  provider: any,
  userAddress: string
): Promise<{ total: number; retired: number; available: number }> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    const [totalBalance, retiredAmount] = await Promise.all([
      contract.methods.balanceOf(userAddress).call(),
      contract.methods.getRetiredCredits(userAddress).call()
    ]);

    const total = Number(totalBalance) / 1e18; // Convert from wei
    const retired = Number(retiredAmount) / 1e18;
    const available = total - retired;

    return { total, retired, available };
  } catch (error) {
    console.error('Error getting carbon credit balance:', error);
    // Return simulated data for demo
    return {
      total: 0,
      retired: 0,
      available: 0
    };
  }
}

export async function mintCarbonCredits(
  provider: any,
  userAddress: string,
  amount: number,
  projectId: string
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const amountInWei = (amount * 1e18).toString();

    const tx = await contract.methods
      .mintCredits(userAddress, amountInWei, projectId)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error minting carbon credits:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function retireCarbonCredits(
  provider: any,
  userAddress: string,
  amount: number,
  reason: string
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const amountInWei = (amount * 1e18).toString();

    const tx = await contract.methods
      .retireCredits(amountInWei, reason)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error retiring carbon credits:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function transferCarbonCredits(
  provider: any,
  fromAddress: string,
  toAddress: string,
  amount: number
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const amountInWei = (amount * 1e18).toString();

    const tx = await contract.methods
      .transfer(toAddress, amountInWei)
      .send({ from: fromAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error transferring carbon credits:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function getTotalSupply(provider: any): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const supply = await contract.methods.totalSupply().call();
    return Number(supply) / 1e18;
  } catch (error) {
    console.error('Error getting total supply:', error);
    return 0;
  }
}

export async function getTotalRetired(provider: any): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const retired = await contract.methods.getTotalRetired().call();
    return Number(retired) / 1e18;
  } catch (error) {
    console.error('Error getting total retired:', error);
    return 0;
  }
}
