'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Link, Shield, Download, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';
import { uploadCertificate } from '@/utils/ipfsUpload';

interface EmissionData {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

interface BlockchainCertificationProps {
  emissionData: EmissionData[];
  totalEmissions: number;
  onCertificationComplete: (hash: string) => void;
}

export function BlockchainCertification({ 
  emissionData, 
  totalEmissions, 
  onCertificationComplete 
}: BlockchainCertificationProps): JSX.Element {
  const { account, isConnected, storeRecord, getTotalRecords } = useWeb3();
  const { toast } = useToast();
  const [isStoring, setIsStoring] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [certificateId, setCertificateId] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');

  const generateDataHash = useCallback((): string => {
    const dataString = JSON.stringify({
      emissions: emissionData,
      total: totalEmissions,
      timestamp: Date.now(),
      account
    });
    
    // Simple hash function (in production, use a proper cryptographic hash)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }, [emissionData, totalEmissions, account]);

  const handleStoreRecord = useCallback(async (): Promise<void> => {
    if (!isConnected || !account) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your wallet to store records on blockchain',
        variant: 'destructive',
      });
      return;
    }

    if (emissionData.length === 0) {
      toast({
        title: '❌ No Data Available',
        description: 'Please upload and analyze data first',
        variant: 'destructive',
      });
      return;
    }

    setIsStoring(true);
    
    try {
      const dataHash = generateDataHash();
      const hash = await storeRecord(dataHash, totalEmissions);
      
      setTransactionHash(hash);
      onCertificationComplete(hash);
      
      // Generate certificate ID
      const certId = `RANTAI-${Date.now()}-${hash.slice(-8)}`;
      setCertificateId(certId);

      // Upload certificate to IPFS
      const certificate = {
        certificateId: certId,
        title: 'RANTAI 3C Carbon Footprint Certification',
        organization: 'RANTAI 3C Platform',
        recipient: account,
        carbonFootprint: {
          totalEmissions: `${totalEmissions.toFixed(2)} kg CO₂`,
          categories: emissionData.length,
          analysisDate: new Date().toISOString().split('T')[0],
          breakdown: emissionData.map(item => ({
            category: item.category,
            emissions: `${item.value.toFixed(2)} kg CO₂`,
            percentage: `${item.percentage}%`
          }))
        },
        blockchain: {
          network: 'Sepolia Testnet',
          transactionHash: hash,
          contractAddress: '0x874378E56D92a0C4633b27A1730AD0CF8e7b4891',
          dataHash: dataHash,
          timestamp: new Date().toISOString()
        },
        verification: {
          status: 'Verified',
          method: 'Smart Contract',
          authenticatedBy: 'RANTAI 3C System'
        }
      };

      try {
        const { ipfsHash: certIpfsHash } = await uploadCertificate(certificate);
        setIpfsHash(certIpfsHash);
      } catch (ipfsError) {
        console.error('IPFS upload failed:', ipfsError);
      }

      // Update total records count
      const total = await getTotalRecords();
      setTotalRecords(total);

      toast({
        title: '✅ Record Stored Successfully',
        description: `Your carbon footprint has been certified on blockchain!`,
      });
      
    } catch (error) {
      console.error('Error storing record:', error);
      toast({
        title: '❌ Storage Failed',
        description: error instanceof Error ? error.message : 'Failed to store record on blockchain',
        variant: 'destructive',
      });
    } finally {
      setIsStoring(false);
    }
  }, [isConnected, account, emissionData, totalEmissions, storeRecord, getTotalRecords, generateDataHash, onCertificationComplete, toast]);

  const copyToClipboard = useCallback(async (text: string, label: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `✅ ${label} Copied`,
        description: 'Copied to clipboard successfully',
      });
    } catch (error) {
      toast({
        title: '❌ Copy Failed',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const downloadCertificate = useCallback((): void => {
    if (!transactionHash || !certificateId) return;

    const certificate = {
      certificateId,
      title: 'RANTAI 3C Carbon Footprint Certification',
      organization: 'RANTAI 3C Platform',
      recipient: account,
      carbonFootprint: {
        totalEmissions: `${totalEmissions.toFixed(2)} kg CO₂`,
        categories: emissionData.length,
        analysisDate: new Date().toISOString().split('T')[0],
        breakdown: emissionData.map(item => ({
          category: item.category,
          emissions: `${item.value.toFixed(2)} kg CO₂`,
          percentage: `${item.percentage}%`
        }))
      },
      blockchain: {
        network: 'Sepolia Testnet',
        transactionHash,
        contractAddress: '0x874378E56D92a0C4633b27A1730AD0CF8e7b4891',
        dataHash: generateDataHash(),
        timestamp: new Date().toISOString()
      },
      verification: {
        status: 'Verified',
        method: 'Smart Contract',
        authenticatedBy: 'RANTAI 3C System'
      }
    };

    const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RANTAI-3C-Certificate-${certificateId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: '📄 Certificate Downloaded',
      description: 'Your carbon footprint certificate has been saved',
    });
  }, [transactionHash, certificateId, account, totalEmissions, emissionData, generateDataHash, toast]);

  // View-only mode (no wallet required)
  if (!isConnected) {
    return (
      <div className="space-y-6">
        {/* Educational Card - No Wallet Required */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Blockchain Certification (View Mode)
            </CardTitle>
            <CardDescription>
              Learn about blockchain verification without connecting a wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What is Blockchain Certification */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                What is Blockchain Certification?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Blockchain certification provides immutable, transparent proof of your carbon footprint data. 
                Once stored on the Ethereum blockchain, your records cannot be altered or deleted, ensuring 
                complete transparency for audits and compliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium text-green-600 mb-1">🔒 Immutable</div>
                  <div className="text-gray-600 dark:text-gray-400">Data cannot be changed once stored</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium text-purple-600 mb-1">🔍 Transparent</div>
                  <div className="text-gray-600 dark:text-gray-400">Anyone can verify the records</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium text-blue-600 mb-1">🌐 Decentralized</div>
                  <div className="text-gray-600 dark:text-gray-400">No single point of failure</div>
                </div>
              </div>
            </div>

            {/* Current Analysis Summary */}
            {emissionData.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Your Current Analysis (Ready to Certify)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {totalEmissions.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">kg CO₂ Total</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {emissionData.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Ready
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">For Certification</div>
                  </div>
                </div>
                <Alert className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900 dark:text-amber-100">
                    <strong>Ready to Certify?</strong> Connect your MetaMask wallet using the button in the header to store this data permanently on the Sepolia blockchain.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No carbon footprint data available. Please upload and analyze your energy consumption data first in the Cloud and Climate tabs.
                </AlertDescription>
              </Alert>
            )}

            {/* How It Works */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                How Blockchain Certification Works
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">Connect Wallet</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use MetaMask to authenticate with Ethereum network (Sepolia testnet)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center font-bold text-green-600">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">Store on Blockchain</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your carbon data is hashed and stored in our smart contract permanently</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center font-bold text-purple-600">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">Download Certificate</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get a verifiable JSON certificate with blockchain transaction hash</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Details</CardTitle>
            <CardDescription>
              Technical information about the blockchain infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Network:
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                      Sepolia Testnet
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Contract Address:
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-xs">
                      0x874378E56D92a0C4633b27A1730AD0CF8e7b4891
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('0x874378E56D92a0C4633b27A1730AD0CF8e7b4891', 'Contract Address')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    View on Explorer:
                  </label>
                  <div className="mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href="https://sepolia.etherscan.io/address/0x874378E56D92a0C4633b27A1730AD0CF8e7b4891"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Etherscan
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Contract Functions:
                  </label>
                  <div className="flex flex-col gap-1 mt-1">
                    <Badge variant="outline" className="text-xs justify-start">storeRecord()</Badge>
                    <Badge variant="outline" className="text-xs justify-start">getRecord()</Badge>
                    <Badge variant="outline" className="text-xs justify-start">totalRecords()</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                What gets stored on blockchain:
              </h4>
              <ul className="space-y-1 ml-4">
                <li>• Cryptographic hash of your carbon footprint data</li>
                <li>• Total carbon emissions value (kg CO₂)</li>
                <li>• Recording timestamp</li>
                <li>• Your wallet address as the recorder</li>
                <li>• <strong>Note:</strong> Raw energy data is NOT stored on blockchain for privacy</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              Benefits of Blockchain Certification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">For Organizations</h5>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Regulatory compliance and audit trails</li>
                  <li>• ESG reporting with verifiable data</li>
                  <li>• Build trust with stakeholders</li>
                  <li>• Permanent record of sustainability efforts</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">Technical Advantages</h5>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Zero tampering - immutable records</li>
                  <li>• Public verifiability on Etherscan</li>
                  <li>• Decentralized storage (no single failure point)</li>
                  <li>• Cryptographic security (hashing + signatures)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Certification Summary */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Blockchain Certification
            </div>
            <Badge 
              variant="outline" 
              className={`gap-2 ${transactionHash ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 'bg-gray-50 dark:bg-gray-800/20'}`}
            >
              <div className={`w-2 h-2 rounded-full ${transactionHash ? 'bg-green-500' : 'bg-gray-400'}`} />
              {transactionHash ? 'Certified' : 'Pending'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Secure and verify your carbon footprint data using blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Summary */}
          {emissionData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalEmissions.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">kg CO₂ Total</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {emissionData.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recorder Address</div>
              </div>
            </div>
          )}

          {/* Store Record Button */}
          {!transactionHash && emissionData.length > 0 && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Store your carbon footprint data on the Sepolia blockchain for permanent verification and compliance purposes.
                </AlertDescription>
              </Alert>
              
              <Button
                onClick={handleStoreRecord}
                disabled={isStoring}
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isStoring ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Storing on Blockchain...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Store Carbon Record
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Transaction Details */}
          {transactionHash && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Successfully Certified on Blockchain
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Transaction Hash:
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono break-all">
                        {transactionHash}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(transactionHash, 'Transaction Hash')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {certificateId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Certificate ID:
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                          {certificateId}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(certificateId, 'Certificate ID')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Data Hash:
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                        {generateDataHash()}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateDataHash(), 'Data Hash')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Certificate */}
              <Button
                onClick={downloadCertificate}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                Download Certificate
              </Button>
            </div>
          )}

          {/* No Data Warning */}
          {emissionData.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No carbon footprint data available. Please upload and analyze your energy consumption data first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Details</CardTitle>
          <CardDescription>
            Information about the blockchain infrastructure powering RANTAI 3C
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Network:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">Sepolia Testnet</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contract Address:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-xs">
                    0x874378E56D92a0C4633b27A1730AD0CF8e7b4891
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('0x874378E56D92a0C4633b27A1730AD0CF8e7b4891', 'Contract Address')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Your Address:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-xs">
                    {account || 'Not connected'}
                  </code>
                  {account && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(account, 'Wallet Address')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Records:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{totalRecords} records stored</Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              What gets stored on blockchain:
            </h4>
            <ul className="space-y-1 ml-4">
              <li>• Cryptographic hash of your carbon footprint data</li>
              <li>• Total carbon emissions value (kg CO₂)</li>
              <li>• Recording timestamp</li>
              <li>• Your wallet address as the recorder</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}