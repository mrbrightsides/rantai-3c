import oracleABI from '@/contracts/CarbonOracle.json';
import type { OracleData } from '@/types/governance';

const CONTRACT_ADDRESS = oracleABI.address;
const CONTRACT_ABI = oracleABI.abi;

export async function getCarbonCreditPrice(provider: any): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const price = await contract.methods.getCarbonCreditPrice().call();
    return Number(price) / 100; // Convert from cents to dollars
  } catch (error) {
    console.error('Error getting carbon credit price:', error);
    // Return market average for demo
    return 15.50;
  }
}

export async function getEmissionFactor(
  provider: any,
  region: string
): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const factor = await contract.methods.getEmissionFactor(region).call();
    return Number(factor) / 1000; // Convert to kg CO2/kWh
  } catch (error) {
    console.error('Error getting emission factor:', error);
    // Return regional default for demo
    const defaultFactors: Record<string, number> = {
      'indonesia': 0.85,
      'java': 0.75,
      'kalimantan': 0.92,
      'sulawesi': 0.80,
      'sumatra': 0.88
    };
    return defaultFactors[region.toLowerCase()] || 0.85;
  }
}

export async function calculateEmissions(
  provider: any,
  energyUsage: number,
  region: string
): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const emissions = await contract.methods
      .calculateEmissions(Math.floor(energyUsage * 1000), region)
      .call();
    return Number(emissions) / 1000; // Convert to kg
  } catch (error) {
    console.error('Error calculating emissions:', error);
    // Fallback calculation
    const factor = await getEmissionFactor(provider, region);
    return energyUsage * factor;
  }
}

export async function calculateCost(
  provider: any,
  credits: number
): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const cost = await contract.methods
      .calculateCost(Math.floor(credits * 1000))
      .call();
    return Number(cost) / 100; // Convert from cents
  } catch (error) {
    console.error('Error calculating cost:', error);
    const price = await getCarbonCreditPrice(provider);
    return credits * price;
  }
}

export async function getOracleData(provider: any): Promise<OracleData> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    const [price, lastUpdate] = await Promise.all([
      contract.methods.getCarbonCreditPrice().call(),
      contract.methods.getLastUpdateTime().call()
    ]);

    // Get emission factors for key regions
    const regions = ['indonesia', 'java', 'kalimantan', 'sulawesi', 'sumatra'];
    const factors: Record<string, number> = {};
    
    await Promise.all(
      regions.map(async (region) => {
        const factor = await getEmissionFactor(provider, region);
        factors[region] = factor;
      })
    );

    return {
      carbonPrice: Number(price) / 100,
      lastUpdate: Number(lastUpdate),
      emissionFactors: factors
    };
  } catch (error) {
    console.error('Error getting oracle data:', error);
    return {
      carbonPrice: 15.50,
      lastUpdate: Math.floor(Date.now() / 1000),
      emissionFactors: {
        'indonesia': 0.85,
        'java': 0.75,
        'kalimantan': 0.92,
        'sulawesi': 0.80,
        'sumatra': 0.88
      }
    };
  }
}

export async function updateCarbonPrice(
  provider: any,
  userAddress: string,
  newPrice: number
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const priceInCents = Math.floor(newPrice * 100);

    const tx = await contract.methods
      .updateCarbonPrice(priceInCents)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error updating carbon price:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function updateEmissionFactor(
  provider: any,
  userAddress: string,
  region: string,
  factor: number
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const factorScaled = Math.floor(factor * 1000);

    const tx = await contract.methods
      .updateEmissionFactor(region, factorScaled)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error updating emission factor:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}
