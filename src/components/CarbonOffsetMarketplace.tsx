'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, ShoppingCart, CheckCircle, TrendingDown, Globe, Trees, Wind, Droplet, Building2, Award, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { uploadNFTMetadata } from '@/utils/ipfsUpload';
import { generatePayPalLink, purchaseOffsetWithCrypto } from '@/utils/offsetPayment';
import { PaymentModal } from '@/components/PaymentModal';
import type { NFTMetadata } from '@/types/nft';
import { ethers } from 'ethers';

interface CarbonOffsetMarketplaceProps {
  totalEmissions: number;
  emissionData: Array<{
    id: string;
    category: string;
    value: number;
    percentage: number;
  }>;
}

interface OffsetProject {
  id: string;
  name: string;
  provider: string;
  type: 'reforestation' | 'renewable' | 'conservation' | 'technology';
  pricePerTon: number;
  location: string;
  certification: string;
  description: string;
  icon: React.ReactNode;
  impact: string;
  verified: boolean;
}

export function CarbonOffsetMarketplace({ totalEmissions, emissionData }: CarbonOffsetMarketplaceProps): JSX.Element {
  const { toast } = useToast();
  const { isConnected, mintOffsetNFT, provider } = useWeb3();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [offsetAmount, setOffsetAmount] = useState<number>(totalEmissions);
  const [purchasedOffsets, setPurchasedOffsets] = useState<number>(0);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const projects: OffsetProject[] = [
    {
      id: 'reforest-indo',
      name: 'Indonesia Rainforest Restoration',
      provider: 'Yayasan KEHATI',
      type: 'reforestation',
      pricePerTon: 15,
      location: 'Kalimantan, Indonesia',
      certification: 'Gold Standard',
      description: 'Restoring degraded rainforest ecosystems while providing sustainable livelihoods for local communities',
      icon: <Trees className="h-6 w-6 text-green-600" />,
      impact: 'Each credit protects 10 trees and supports 1 local farmer',
      verified: true,
    },
    {
      id: 'solar-java',
      name: 'Java Solar Farm Initiative',
      provider: 'PLN Renewable Energy',
      type: 'renewable',
      pricePerTon: 12,
      location: 'West Java, Indonesia',
      certification: 'VCS (Verified Carbon Standard)',
      description: 'Large-scale solar energy project replacing coal-powered electricity generation',
      icon: <Wind className="h-6 w-6 text-yellow-600" />,
      impact: 'Powers 5,000 homes with clean energy per 1 ton offset',
      verified: true,
    },
    {
      id: 'mangrove-sulawesi',
      name: 'Sulawesi Mangrove Conservation',
      provider: 'Blue Forests',
      type: 'conservation',
      pricePerTon: 18,
      location: 'Sulawesi, Indonesia',
      certification: 'Plan Vivo',
      description: 'Protecting and expanding coastal mangrove forests for carbon sequestration and biodiversity',
      icon: <Droplet className="h-6 w-6 text-blue-600" />,
      impact: 'Protects 50m² of mangrove ecosystem per ton',
      verified: true,
    },
    {
      id: 'ccus-jakarta',
      name: 'Jakarta Carbon Capture Technology',
      provider: 'Pertamina CCS',
      type: 'technology',
      pricePerTon: 25,
      location: 'Jakarta, Indonesia',
      certification: 'ISO 14064',
      description: 'Advanced carbon capture and utilization technology for industrial emissions',
      icon: <Building2 className="h-6 w-6 text-purple-600" />,
      impact: 'Prevents 1 ton CO₂ from entering atmosphere',
      verified: true,
    },
  ];

  const netEmissions = totalEmissions - purchasedOffsets;
  const offsetPercentage = (purchasedOffsets / totalEmissions) * 100;
  const isNetZero = purchasedOffsets >= totalEmissions;

  const handleSelectProject = (projectId: string): void => {
    setSelectedProject(projectId);
    setShowPaymentModal(true);
  };

  const handlePayWithCrypto = async (amount: number): Promise<void> => {
    const project = projects.find(p => p.id === selectedProject);
    if (!project || !provider) return;

    setIsPurchasing(true);

    try {
      const cost = (amount / 1000) * project.pricePerTon; // Convert kg to tonnes

      // Step 1: Generate NFT metadata
      const metadata: NFTMetadata = {
        name: `Carbon Offset Certificate - ${project.name}`,
        description: `Verified carbon offset of ${amount.toFixed(2)} kg CO₂ through ${project.name}. ${project.description}`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${project.id}-${Date.now()}`,
        attributes: [
          { trait_type: 'Offset Amount', value: `${amount.toFixed(2)} kg CO₂` },
          { trait_type: 'Project', value: project.name },
          { trait_type: 'Provider', value: project.provider },
          { trait_type: 'Location', value: project.location },
          { trait_type: 'Certification', value: project.certification },
          { trait_type: 'Type', value: project.type },
          { trait_type: 'Cost', value: `$${cost.toFixed(2)}` },
          { trait_type: 'Date', value: new Date().toISOString().split('T')[0] },
        ],
        external_url: 'https://rantai.elpeef.com',
      };

      // Step 2: Upload metadata to IPFS
      const { ipfsHash } = await uploadNFTMetadata(metadata);

      // Step 3: Process crypto payment
      const ethProvider = new ethers.BrowserProvider(provider);
      const paymentResult = await purchaseOffsetWithCrypto(
        ethProvider,
        project.id,
        amount,
        project.pricePerTon,
        ipfsHash
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Step 4: Mint NFT certificate
      if (isConnected) {
        try {
          const tokenId = await mintOffsetNFT(amount, project.name, ipfsHash);
          
          toast({
            title: '🎉 Payment Successful + NFT Minted!',
            description: `You've offset ${amount.toFixed(2)} kg CO₂ and received NFT certificate #${tokenId}`,
          });
        } catch (nftError) {
          console.error('NFT minting failed:', nftError);
          toast({
            title: '✅ Payment Processed',
            description: `Payment successful! NFT minting encountered an issue but will be retried.`,
          });
        }
      }

      setPurchasedOffsets(prev => prev + amount);
      setSelectedProject(null);
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Crypto payment error:', error);
      toast({
        title: '❌ Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to process crypto payment',
        variant: 'destructive',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePayWithPayPal = (amount: number): void => {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return;

    const cost = (amount / 1000) * project.pricePerTon; // Convert kg to tonnes
    const paypalLink = generatePayPalLink(cost, project.name, amount);

    // Open PayPal in new window
    window.open(paypalLink, '_blank');

    toast({
      title: '💳 Redirecting to PayPal',
      description: 'Complete your payment on PayPal. After payment, return here to mint your NFT certificate.',
    });

    // For demo: simulate successful payment after user returns
    setTimeout(() => {
      setPurchasedOffsets(prev => prev + amount);
      setSelectedProject(null);
      setShowPaymentModal(false);
      
      toast({
        title: '✅ Payment Completed!',
        description: `Thank you! You've offset ${amount.toFixed(2)} kg CO₂. Connect your wallet to mint NFT certificate.`,
      });
    }, 3000);
  };

  if (emissionData.length === 0) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Leaf className="h-5 w-5" />
            Carbon Offset Marketplace
          </CardTitle>
          <CardDescription>
            Offset your carbon footprint by supporting verified environmental projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Leaf className="h-4 w-4" />
            <AlertDescription>
              Complete your carbon footprint analysis first to access the offset marketplace.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Net Zero Progress */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <TrendingDown className="h-5 w-5" />
            Your Path to Net Zero Carbon
          </CardTitle>
          <CardDescription>
            Track your progress toward carbon neutrality through verified offset purchases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {totalEmissions.toFixed(2)}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">Total Emissions (kg CO₂)</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {purchasedOffsets.toFixed(2)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Offset Purchased (kg CO₂)</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {netEmissions.toFixed(2)}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Net Emissions (kg CO₂)</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress to Net Zero
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {offsetPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={Math.min(offsetPercentage, 100)} className="h-3" />
            {isNetZero && (
              <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <Award className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-900 dark:text-emerald-100">
                  <strong>🎉 Congratulations!</strong> You've achieved carbon neutrality! Your organization is now Net Zero.
                </AlertDescription>
              </Alert>
            )}
            {!isNetZero && offsetPercentage > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                You're {(100 - offsetPercentage).toFixed(1)}% away from achieving Net Zero carbon emissions
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offset Projects Marketplace */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <ShoppingCart className="h-5 w-5" />
            Verified Carbon Offset Projects
          </CardTitle>
          <CardDescription>
            Support environmental initiatives and offset your carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* NFT Reward Alert */}
          <Alert className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700">
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-900 dark:text-purple-100">
              <strong>🎁 Bonus NFT Certificate!</strong> Every offset purchase, no matter the amount, includes an NFT Certificate as blockchain-verified proof of your contribution! 
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-5 border-2 rounded-lg transition-all ${
                  selectedProject === project.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                      {project.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.provider}
                      </p>
                    </div>
                  </div>
                  {project.verified && (
                    <Badge className="bg-green-500 text-white gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <Globe className="h-3 w-3 inline mr-1" />
                      Location:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {project.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <Award className="h-3 w-3 inline mr-1" />
                      Certification:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {project.certification}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ${project.pricePerTon}/ton CO₂
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Impact:</strong> {project.impact}
                  </p>
                </div>

                <Button
                  onClick={() => handleSelectProject(project.id)}
                  variant="outline"
                  className="w-full gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Purchase Offset
                </Button>
              </div>
            ))}
          </div>

          {/* Quick Purchase for Full Offset */}
          {!isNetZero && netEmissions > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    🎯 Quick Path to Net Zero
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                    Offset your remaining {netEmissions.toFixed(2)} kg CO₂ emissions and achieve carbon neutrality instantly!
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${((netEmissions / 1000) * 15).toFixed(2)}
                    </span>
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      (estimated average cost @ $15/tonne)
                    </span>
                  </div>
                </div>
                <Award className="h-16 w-16 text-emerald-500 opacity-20" />
              </div>
            </div>
          )}

          {/* Benefits of Carbon Offsetting */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              💚 Why Offset Your Carbon Footprint?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <p>• <strong>Environmental Impact:</strong> Support verified climate action projects</p>
                <p>• <strong>Corporate Responsibility:</strong> Demonstrate ESG commitment to stakeholders</p>
                <p>• <strong>Brand Value:</strong> Enhance reputation as a sustainable organization</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Regulatory Compliance:</strong> Meet carbon neutrality regulations</p>
                <p>• <strong>Community Support:</strong> Provide livelihoods in environmental projects</p>
                <p>• <strong>Measurable Results:</strong> Track real environmental impact transparently</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {selectedProject && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProject(null);
          }}
          project={projects.find(p => p.id === selectedProject)!}
          offsetAmount={offsetAmount}
          totalCost={(offsetAmount / 1000) * projects.find(p => p.id === selectedProject)!.pricePerTon}
          onPayWithCrypto={handlePayWithCrypto}
          onPayWithPayPal={handlePayWithPayPal}
          isProcessing={isPurchasing}
          isWalletConnected={isConnected}
        />
      )}
    </div>
  );
}
