'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Award, ExternalLink, Calendar, Leaf, Image as ImageIcon, Info, Globe } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';

export function NFTCertificateGallery(): JSX.Element {
  const { isConnected, account, getOffsetNFTs } = useWeb3();
  const { toast } = useToast();
  const [nfts, setNfts] = useState<Array<{
    tokenId: number;
    offsetAmount: number;
    projectName: string;
    timestamp: number;
    ipfsHash: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadNFTs = useCallback(async (): Promise<void> => {
    if (!isConnected || !account) return;

    setIsLoading(true);
    try {
      const userNFTs = await getOffsetNFTs();
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      toast({
        title: '❌ Failed to Load NFTs',
        description: 'Could not retrieve your carbon offset certificates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, account, getOffsetNFTs, toast]);

  useEffect(() => {
    if (isConnected && account) {
      loadNFTs();
    }
  }, [isConnected, account, loadNFTs]);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const viewOnIPFS = (ipfsHash: string): void => {
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    window.open(gatewayUrl, '_blank', 'noopener,noreferrer');
  };

  const viewOnOpenSea = (tokenId: number): void => {
    // Use actual NFT contract address
    const contractAddress = '0x1365069a97b3CbcbdeEa977AEBD5e05C78c8E9b5';
    const openSeaUrl = `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`;
    window.open(openSeaUrl, '_blank', 'noopener,noreferrer');
  };

  const viewOnEtherscan = (tokenId: number): void => {
    const contractAddress = '0x1365069a97b3CbcbdeEa977AEBD5e05C78c8E9b5';
    const etherscanUrl = `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`;
    window.open(etherscanUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isConnected) {
    return (
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Award className="h-5 w-5" />
            NFT Certificate Gallery
          </CardTitle>
          <CardDescription>
            View your carbon offset certificates as collectible NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to view your NFT certificates. Each carbon offset you purchase is minted as a unique, verifiable NFT on the blockchain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Award className="h-5 w-5" />
                Your NFT Certificate Collection
              </CardTitle>
              <CardDescription>
                Blockchain-verified proof of your carbon offset contributions
              </CardDescription>
            </div>
            <Button onClick={loadNFTs} variant="outline" size="sm" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No NFT Certificates Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Purchase carbon offsets in the Offset tab to mint your first NFT certificate. Each offset becomes a unique, collectible NFT!
              </p>
              <Alert className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  <strong>How it works:</strong> When you purchase a carbon offset, an NFT certificate is automatically minted and sent to your wallet. 
                  It contains the offset amount, project details, and metadata stored on IPFS.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You own <strong className="text-amber-600 dark:text-amber-400">{nfts.length}</strong> carbon offset certificate{nfts.length !== 1 ? 's' : ''}
                </p>
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                  Total: {nfts.reduce((sum, nft) => sum + nft.offsetAmount, 0).toFixed(2)} kg CO₂
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Card key={nft.tokenId} className="overflow-hidden border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 hover:shadow-lg">
                    <div className="relative h-48 bg-gradient-to-br from-amber-100 to-green-100 dark:from-amber-900/40 dark:to-green-900/40 flex flex-col items-center justify-center p-6">
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700">
                          #{nft.tokenId}
                        </Badge>
                      </div>
                      <Award className="h-16 w-16 text-amber-500 mb-3" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                          {nft.offsetAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                          kg CO₂ Offset
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                          {nft.projectName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(nft.timestamp)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        <Button
                          onClick={() => viewOnIPFS(nft.ipfsHash)}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          title="View metadata on IPFS"
                        >
                          <Leaf className="h-3 w-3" />
                          IPFS
                        </Button>
                        <Button
                          onClick={() => viewOnEtherscan(nft.tokenId)}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          title="View on Etherscan"
                        >
                          <Globe className="h-3 w-3" />
                          Chain
                        </Button>
                        <Button
                          onClick={() => viewOnOpenSea(nft.tokenId)}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          title="View on OpenSea"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Sea
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What are NFT Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Info className="h-5 w-5 text-blue-500" />
            What are NFT Certificates?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">🎨 Collectible & Unique</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each carbon offset you purchase is minted as a unique NFT (ERC-721 token) on the Ethereum blockchain. 
                No two certificates are the same—each has its own token ID and metadata.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">🔗 Blockchain Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your certificates are stored permanently on the Sepolia blockchain with metadata hosted on IPFS, 
                making them tamper-proof and independently verifiable by anyone.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">💼 Transferable Assets</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlike Soulbound Badges, NFT Certificates can be transferred, traded, or sold on NFT marketplaces like OpenSea, 
                creating a secondary market for verified carbon offsets.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">🏆 Social Proof</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Display your collection as proof of your commitment to sustainability. 
                Share your NFTs on social media or use them in your ESG reporting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
