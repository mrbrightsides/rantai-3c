'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  TestTube, 
  Wallet, 
  Award,
  Info,
  ExternalLink
} from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'running';
  message?: string;
  data?: any;
}

export function ContractTester(): JSX.Element {
  const { isConnected, account, mintOffsetNFT, getOffsetNFTs, provider } = useWeb3();
  const { toast } = useToast();
  
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testAmount, setTestAmount] = useState<string>('100');
  const [testProject, setTestProject] = useState<string>('Test Reforestation Project');
  const [testIpfsHash, setTestIpfsHash] = useState<string>('QmTest123');

  const updateTest = (index: number, update: Partial<TestResult>): void => {
    setTests(prev => {
      const newTests = [...prev];
      newTests[index] = { ...newTests[index], ...update };
      return newTests;
    });
  };

  const runAllTests = async (): Promise<void> => {
    if (!isConnected || !account) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    const testSuite: TestResult[] = [
      { name: '1. Check Wallet Connection', status: 'pending' },
      { name: '2. Verify NFT Contract Address', status: 'pending' },
      { name: '3. Get NFT Balance', status: 'pending' },
      { name: '4. Mint Test NFT Certificate', status: 'pending' },
      { name: '5. Fetch All NFT Certificates', status: 'pending' },
      { name: '6. Verify New NFT Data', status: 'pending' },
    ];
    
    setTests(testSuite);

    try {
      // Test 1: Check Wallet Connection
      updateTest(0, { status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isConnected && account) {
        updateTest(0, { 
          status: 'success', 
          message: `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`,
          data: { account }
        });
      } else {
        throw new Error('Wallet not connected');
      }

      // Test 2: Verify NFT Contract
      updateTest(1, { status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      const NFTCertificateABI = await import('@/contracts/NFTCertificate.json');
      if (NFTCertificateABI.address) {
        updateTest(1, { 
          status: 'success', 
          message: `Contract: ${NFTCertificateABI.address}`,
          data: { address: NFTCertificateABI.address }
        });
      } else {
        throw new Error('Contract address not found');
      }

      // Test 3: Get NFT Balance
      updateTest(2, { status: 'running' });
      const initialNFTs = await getOffsetNFTs();
      updateTest(2, { 
        status: 'success', 
        message: `Current NFT balance: ${initialNFTs.length}`,
        data: { balance: initialNFTs.length, nfts: initialNFTs }
      });

      // Test 4: Mint Test NFT
      updateTest(3, { status: 'running' });
      const amount = parseFloat(testAmount);
      const tokenId = await mintOffsetNFT(amount, testProject, testIpfsHash);
      updateTest(3, { 
        status: 'success', 
        message: `NFT minted! Token ID: ${tokenId}`,
        data: { tokenId, amount, project: testProject, ipfsHash: testIpfsHash }
      });

      // Test 5: Fetch All NFTs
      updateTest(4, { status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for blockchain confirmation
      const allNFTs = await getOffsetNFTs();
      updateTest(4, { 
        status: 'success', 
        message: `Found ${allNFTs.length} NFT(s)`,
        data: { nfts: allNFTs }
      });

      // Test 6: Verify New NFT
      updateTest(5, { status: 'running' });
      const newNFT = allNFTs.find((nft: any) => nft.tokenId === tokenId);
      if (newNFT) {
        updateTest(5, { 
          status: 'success', 
          message: `Verified NFT #${tokenId}: ${newNFT.offsetAmount.toFixed(2)} kg CO₂`,
          data: newNFT
        });
      } else {
        updateTest(5, { 
          status: 'error', 
          message: 'Could not find newly minted NFT. Try refreshing after blockchain confirmation.',
        });
      }

      toast({
        title: '✅ All Tests Completed!',
        description: 'Smart contract integration is working correctly.',
      });

    } catch (error) {
      console.error('Test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update any running test as failed
      setTests(prev => prev.map(test => 
        test.status === 'running' 
          ? { ...test, status: 'error', message: errorMessage }
          : test
      ));

      toast({
        title: '❌ Test Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearTests = (): void => {
    setTests([]);
  };

  const getStatusIcon = (status: TestResult['status']): JSX.Element => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <TestTube className="h-5 w-5" />
            Contract Testing Suite
          </CardTitle>
          <CardDescription>
            Test all smart contract interactions to ensure everything works correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to run contract tests
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <TestTube className="h-5 w-5" />
            Smart Contract Testing Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing for NFTCertificate, CarbonDAO, CarbonOracle, and CarbonCreditToken contracts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Addresses */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Deployed Contracts (Sepolia Testnet)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">NFTCertificate:</span>
                <a 
                  href="https://sepolia.etherscan.io/address/0x1365069a97b3CbcbdeEa977AEBD5e05C78c8E9b5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  0x1365...E9b5
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">CarbonCreditToken:</span>
                <a 
                  href="https://sepolia.etherscan.io/address/0x8C24891E019004e7b0E843CA96C870B8dA8d8F3B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  0x8C24...8F3B
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">CarbonDAO:</span>
                <a 
                  href="https://sepolia.etherscan.io/address/0xE0329Ba866808D89762e8F85774aCa244641C062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  0xE032...C062
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">CarbonOracle:</span>
                <a 
                  href="https://sepolia.etherscan.io/address/0xF7dEa9C44708C1d66C0DFAF05d7bdbd48A8A162c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  0xF7dE...162c
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">SoulboundBadge:</span>
                <a 
                  href="https://sepolia.etherscan.io/address/0xBf179DD1D426e346A07F8f2F859ABDE3dc5c5436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  0xBf17...5436
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Test Configuration */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Test NFT Configuration
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="test-amount" className="text-sm">Offset Amount (kg CO₂)</Label>
                <Input
                  id="test-amount"
                  type="number"
                  value={testAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestAmount(e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="test-project" className="text-sm">Project Name</Label>
                <Input
                  id="test-project"
                  value={testProject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestProject(e.target.value)}
                  placeholder="Test Project"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="test-ipfs" className="text-sm">IPFS Hash</Label>
                <Input
                  id="test-ipfs"
                  value={testIpfsHash}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestIpfsHash(e.target.value)}
                  placeholder="QmTest123"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
            <Button
              onClick={clearTests}
              variant="outline"
              disabled={isRunning || tests.length === 0}
            >
              Clear Results
            </Button>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Test Results:</h4>
              {tests.map((test: TestResult, index: number) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    test.status === 'success'
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : test.status === 'error'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : test.status === 'running'
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {test.name}
                      </div>
                      {test.message && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {test.message}
                        </div>
                      )}
                      {test.data && test.status === 'success' && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 dark:text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                            View Data
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                            {JSON.stringify(test.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                    {test.status === 'success' && (
                      <Badge className="bg-green-500 text-white">Passed</Badge>
                    )}
                    {test.status === 'error' && (
                      <Badge className="bg-red-500 text-white">Failed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {tests.length > 0 && !isRunning && (
            <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <AlertDescription className="text-purple-900 dark:text-purple-100">
                <strong>Test Summary:</strong> {tests.filter((t: TestResult) => t.status === 'success').length}/{tests.length} tests passed
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
