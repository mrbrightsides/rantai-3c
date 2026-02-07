export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface OffsetNFT {
  tokenId: number;
  owner: string;
  offsetAmount: number;
  projectName: string;
  timestamp: number;
  ipfsHash: string;
  tokenURI: string;
}

export interface SoulboundBadge {
  tokenId: number;
  owner: string;
  badgeType: BadgeType;
  mintedAt: number;
  metadata: string;
  locked: boolean;
}

export type BadgeType = 
  | 'FIRST_OFFSET'
  | 'CARBON_NEUTRAL'
  | 'DATA_QUALITY_CHAMPION'
  | 'EARLY_ADOPTER'
  | 'NET_ZERO_HERO'
  | 'BLOCKCHAIN_CERTIFIED'
  | '100_TONNES_REDUCED'
  | 'CONSISTENCY_MASTER';

export interface BadgeDefinition {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export interface IPFSUploadResult {
  ipfsHash: string;
  ipfsUrl: string;
  gatewayUrl: string;
}
