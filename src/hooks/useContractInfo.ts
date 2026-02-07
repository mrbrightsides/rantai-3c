import { useMemo } from 'react';

export interface ContractInfo {
  name: string;
  address: string;
  explorerUrl: string;
  description: string;
}

export function useContractInfo(): {
  contracts: ContractInfo[];
  getContractByName: (name: string) => ContractInfo | undefined;
} {
  const contracts: ContractInfo[] = useMemo(() => [
    {
      name: 'NFTCertificate',
      address: '0x1365069a97b3CbcbdeEa977AEBD5e05C78c8E9b5',
      explorerUrl: 'https://sepolia.etherscan.io/address/0x1365069a97b3CbcbdeEa977AEBD5e05C78c8E9b5',
      description: 'ERC-721 NFT for carbon offset certificates',
    },
    {
      name: 'SoulboundBadge',
      address: '0xBf179DD1D426e346A07F8f2F859ABDE3dc5c5436',
      explorerUrl: 'https://sepolia.etherscan.io/address/0xBf179DD1D426e346A07F8f2F859ABDE3dc5c5436',
      description: 'Soulbound NFT badges for sustainability achievements',
    },
    {
      name: 'CarbonCreditToken',
      address: '0x8C24891E019004e7b0E843CA96C870B8dA8d8F3B',
      explorerUrl: 'https://sepolia.etherscan.io/address/0x8C24891E019004e7b0E843CA96C870B8dA8d8F3B',
      description: 'ERC-20 token for carbon credits',
    },
    {
      name: 'CarbonDAO',
      address: '0xE0329Ba866808D89762e8F85774aCa244641C062',
      explorerUrl: 'https://sepolia.etherscan.io/address/0xE0329Ba866808D89762e8F85774aCa244641C062',
      description: 'Decentralized Autonomous Organization for carbon governance',
    },
    {
      name: 'CarbonOracle',
      address: '0xF7dEa9C44708C1d66C0DFAF05d7bdbd48A8A162c',
      explorerUrl: 'https://sepolia.etherscan.io/address/0xF7dEa9C44708C1d66C0DFAF05d7bdbd48A8A162c',
      description: 'Oracle for carbon emission data verification',
    },
  ], []);

  const getContractByName = (name: string): ContractInfo | undefined => {
    return contracts.find((contract: ContractInfo) => contract.name === name);
  };

  return { contracts, getContractByName };
}
