export interface EnergyData {
  id?: string;
  date: string;
  category: string;
  consumption: number; // kWh
  location?: string;
  source?: string;
}

export interface EmissionData {
  id: string;
  category: string;
  value: number; // kg CO₂
  percentage: number;
}

export interface CarbonRecord {
  dataHash: string;
  carbonValue: number;
  timestamp: number;
  recordedBy: string;
}

export interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  storeRecord: (dataHash: string, carbonValue: number) => Promise<string>;
  getRecord: (recordId: number) => Promise<CarbonRecord>;
  getTotalRecords: () => Promise<number>;
  // NFT Certificate functions
  mintOffsetNFT: (offsetAmount: number, projectName: string, ipfsHash: string) => Promise<number>;
  getOffsetNFTs: () => Promise<Array<{
    tokenId: number;
    offsetAmount: number;
    projectName: string;
    timestamp: number;
    ipfsHash: string;
  }>>;
  // Soulbound Badge functions
  mintBadge: (badgeType: string, metadata: string) => Promise<number>;
  getBadges: () => Promise<Array<{
    tokenId: number;
    badgeType: string;
    mintedAt: number;
    metadata: string;
  }>>;
  hasBadge: (badgeType: string) => Promise<boolean>;
}

export interface UploadedFileData {
  file: File;
  content: string;
  data: EnergyData[];
  processed: boolean;
}