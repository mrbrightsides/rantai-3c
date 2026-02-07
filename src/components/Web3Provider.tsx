'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { SiweMessage } from 'siwe';
import type { Web3ContextType, CarbonRecord } from '@/types/carbon';
import NFTCertificateABI from '@/contracts/NFTCertificate.json';
import SoulboundBadgeABI from '@/contracts/SoulboundBadge.json';

const Web3Context = createContext<Web3ContextType | null>(null);

const CONTRACT_ADDRESS = '0x874378E56D92a0C4633b27A1730AD0CF8e7b4891';
const RPC_URL = 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206';

const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "recordId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "dataHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "carbonValue", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recordedBy", "type": "address" }
    ],
    "name": "RecordStored",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "dataHash", "type": "string" },
      { "internalType": "uint256", "name": "carbonValue", "type": "uint256" }
    ],
    "name": "storeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "recordId", "type": "uint256" }],
    "name": "getRecord",
    "outputs": [
      { "internalType": "string", "type": "string" },
      { "internalType": "uint256", "type": "uint256" },
      { "internalType": "uint256", "type": "uint256" },
      { "internalType": "address", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "records",
    "outputs": [
      { "internalType": "string", "type": "string" },
      { "internalType": "uint256", "type": "uint256" },
      { "internalType": "uint256", "type": "uint256" },
      { "internalType": "address", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRecords",
    "outputs": [{ "internalType": "uint256", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps): JSX.Element {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [badgeContract, setBadgeContract] = useState<Contract | null>(null);

  // Initialize contracts
  useEffect(() => {
    if (provider) {
      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      setContract(contractInstance);
      
      const nftInstance = new Contract(NFTCertificateABI.address, NFTCertificateABI.abi, provider);
      setNftContract(nftInstance);
      
      const badgeInstance = new Contract(SoulboundBadgeABI.address, SoulboundBadgeABI.abi, provider);
      setBadgeContract(badgeInstance);
    }
  }, [provider]);

  // Check for existing connection
  useEffect(() => {
    const checkConnection = async (): Promise<void> => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const browserProvider = new BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          
          if (accounts.length > 0) {
            setProvider(browserProvider);
            setAccount(accounts[0].address);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connect = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    setIsConnecting(true);
    
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      
      // Request accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      // Switch to Sepolia network if needed
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], // Sepolia chain ID
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xAA36A7',
              chainName: 'Sepolia',
              rpcUrls: [RPC_URL],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          });
        }
      }

      // SIWE Authentication
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in to RANTAI 3C to access carbon footprint tracking and blockchain certification.';
      
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 11155111, // Sepolia
        nonce: Math.random().toString(36).substring(2, 15),
      });

      const messageToSign = message.prepareMessage();
      const signature = await signer.signMessage(messageToSign);
      
      // Verify the signature (in a real app, you'd send this to your backend)
      const verificationResult = await message.verify({ signature });
      
      if (verificationResult.success) {
        setProvider(browserProvider);
        setAccount(address);
        setIsConnected(true);
      } else {
        throw new Error('SIWE verification failed');
      }
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback((): void => {
    setProvider(null);
    setAccount(null);
    setIsConnected(false);
    setContract(null);
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  }, [provider, account]);

  const storeRecord = useCallback(async (dataHash: string, carbonValue: number): Promise<string> => {
    if (!provider || !contract || !account) {
      throw new Error('Wallet not connected or contract not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      // Convert carbonValue to wei (multiply by 10^18 for precision)
      const carbonValueWei = BigInt(Math.floor(carbonValue * 1000));
      
      const tx = await contractWithSigner.storeRecord(dataHash, carbonValueWei);
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error) {
      console.error('Error storing record:', error);
      throw error;
    }
  }, [provider, contract, account]);

  const getRecord = useCallback(async (recordId: number): Promise<CarbonRecord> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await contract.getRecord(recordId);
      
      return {
        dataHash: result[0],
        carbonValue: Number(result[1]) / 1000, // Convert from wei back to kg CO₂
        timestamp: Number(result[2]),
        recordedBy: result[3],
      };
    } catch (error) {
      console.error('Error getting record:', error);
      throw error;
    }
  }, [contract]);

  const getTotalRecords = useCallback(async (): Promise<number> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const total = await contract.totalRecords();
      return Number(total);
    } catch (error) {
      console.error('Error getting total records:', error);
      throw error;
    }
  }, [contract]);

  // NFT Certificate Functions
  const mintOffsetNFT = useCallback(async (offsetAmount: number, projectName: string, ipfsHash: string): Promise<number> => {
    if (!provider || !nftContract || !account) {
      throw new Error('Wallet not connected or NFT contract not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = nftContract.connect(signer);
      
      // Convert offsetAmount to wei (multiply by 1000 for precision)
      const offsetAmountWei = BigInt(Math.floor(offsetAmount * 1000));
      
      const tx = await contractWithSigner.mintOffsetNFT(account, offsetAmountWei, projectName, ipfsHash);
      const receipt = await tx.wait();
      
      // Extract tokenId from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          return contractWithSigner.interface.parseLog(log)?.name === 'OffsetCertificateMinted';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedLog = contractWithSigner.interface.parseLog(event);
        return Number(parsedLog?.args?.tokenId || 0);
      }
      
      return 0;
    } catch (error) {
      console.error('Error minting offset NFT:', error);
      throw error;
    }
  }, [provider, nftContract, account]);

  const getOffsetNFTs = useCallback(async (): Promise<Array<{
    tokenId: number;
    offsetAmount: number;
    projectName: string;
    timestamp: number;
    ipfsHash: string;
  }>> => {
    if (!nftContract || !account) {
      throw new Error('NFT contract not initialized or wallet not connected');
    }

    try {
      const balance = await nftContract.balanceOf(account);
      const nftCount = Number(balance);
      const nfts = [];
      
      for (let i = 0; i < nftCount; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(account, i);
        const details = await nftContract.getOffsetDetails(tokenId);
        
        // getOffsetDetails returns [offsetAmount, projectName, timestamp, ipfsHash]
        nfts.push({
          tokenId: Number(tokenId),
          offsetAmount: Number(details[0]) / 1000, // Convert from wei back to kg
          projectName: details[1],
          timestamp: Number(details[2]),
          ipfsHash: details[3],
        });
      }
      
      return nfts;
    } catch (error) {
      console.error('Error getting offset NFTs:', error);
      throw error;
    }
  }, [nftContract, account]);

  // Soulbound Badge Functions
  const mintBadge = useCallback(async (badgeType: string, metadata: string): Promise<number> => {
    if (!provider || !badgeContract || !account) {
      throw new Error('Wallet not connected or badge contract not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = badgeContract.connect(signer);
      
      const tx = await contractWithSigner.mintBadge(account, badgeType, metadata);
      const receipt = await tx.wait();
      
      // Extract tokenId from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          return contractWithSigner.interface.parseLog(log)?.name === 'BadgeMinted';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedLog = contractWithSigner.interface.parseLog(event);
        return Number(parsedLog?.args?.tokenId || 0);
      }
      
      return 0;
    } catch (error) {
      console.error('Error minting badge:', error);
      throw error;
    }
  }, [provider, badgeContract, account]);

  const getBadges = useCallback(async (): Promise<Array<{
    tokenId: number;
    badgeType: string;
    mintedAt: number;
    metadata: string;
  }>> => {
    if (!badgeContract || !account) {
      throw new Error('Badge contract not initialized or wallet not connected');
    }

    try {
      const balance = await badgeContract.balanceOf(account);
      const badgeCount = Number(balance);
      const badges = [];
      
      for (let i = 0; i < badgeCount; i++) {
        const tokenId = await badgeContract.tokenOfOwnerByIndex(account, i);
        const details = await badgeContract.getBadgeDetails(tokenId);
        
        badges.push({
          tokenId: Number(tokenId),
          badgeType: details.badgeType,
          mintedAt: Number(details.mintedAt),
          metadata: details.metadata,
        });
      }
      
      return badges;
    } catch (error) {
      console.error('Error getting badges:', error);
      throw error;
    }
  }, [badgeContract, account]);

  const hasBadge = useCallback(async (badgeType: string): Promise<boolean> => {
    if (!badgeContract || !account) {
      return false;
    }

    try {
      return await badgeContract.hasBadge(account, badgeType);
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  }, [badgeContract, account]);

  const contextValue: Web3ContextType = {
    account,
    isConnected,
    isConnecting,
    provider,
    connect,
    disconnect,
    signMessage,
    storeRecord,
    getRecord,
    getTotalRecords,
    mintOffsetNFT,
    getOffsetNFTs,
    mintBadge,
    getBadges,
    hasBadge,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3(): Web3ContextType {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}