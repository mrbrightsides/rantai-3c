'use client'
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Cloud, Link, Moon, Sun, Github, ExternalLink, Info, Users, Target, Zap, Shield, BarChart3, RefreshCw, ShoppingCart, Award, Star, Coins, Vote, Activity } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Web3Provider } from '@/components/Web3Provider';
import { WalletConnect } from '@/components/WalletConnect';
import { DataUpload } from '@/components/DataUpload';
import { CarbonAnalysis } from '@/components/CarbonAnalysis';
import { BlockchainCertification } from '@/components/BlockchainCertification';
import { AutomatedDataPulling } from '@/components/AutomatedDataPulling';
import { CarbonOffsetMarketplace } from '@/components/CarbonOffsetMarketplace';
import { NFTCertificateGallery } from '@/components/NFTCertificateGallery';
import { AchievementBadges } from '@/components/AchievementBadges';
import { CarbonCreditWallet } from '@/components/CarbonCreditWallet';
import { DAOGovernance } from '@/components/DAOGovernance';
import { OracleDashboard } from '@/components/OracleDashboard';
import { ContractTester } from '@/components/ContractTester';
import type { EnergyData } from '@/types/carbon';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

interface EmissionData {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

export default function DashboardPage(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  const { theme, setTheme } = useTheme();
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [emissionData, setEmissionData] = useState<EmissionData[]>([]);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [certificationHash, setCertificationHash] = useState<string>('');
  const [isUsingDemoData, setIsUsingDemoData] = useState<boolean>(false);
  const [purchasedOffsets, setPurchasedOffsets] = useState<number>(0);
  
  const isNetZero = purchasedOffsets >= totalEmissions && totalEmissions > 0;

  const generateDemoData = (): void => {
    const demoData: EnergyData[] = [
      { id: 'demo-1', date: '2024-01-15', category: 'Office Lighting', consumption: 120.5, location: 'Jakarta', source: 'Grid' },
      { id: 'demo-2', date: '2024-01-15', category: 'Air Conditioning', consumption: 450.2, location: 'Jakarta', source: 'Grid' },
      { id: 'demo-3', date: '2024-01-15', category: 'Data Center', consumption: 890.7, location: 'Jakarta', source: 'Grid' },
      { id: 'demo-4', date: '2024-01-15', category: 'Manufacturing', consumption: 340.8, location: 'Surabaya', source: 'Solar' },
      { id: 'demo-5', date: '2024-01-15', category: 'Vehicle Charging', consumption: 180.3, location: 'Bandung', source: 'Grid' },
      { id: 'demo-6', date: '2024-01-15', category: 'Warehouse', consumption: 95.6, location: 'Medan', source: 'Hybrid' },
    ];
    
    setIsUsingDemoData(true);
    handleDataUpload(demoData);
  };

  const handleDataUpload = (data: EnergyData[]): void => {
    setEnergyData(data);
    
    // Calculate carbon emissions (simplified calculation)
    const emissionFactor = 0.5; // kg CO₂ per kWh (average)
    const emissions = data.map((item, index) => {
      const emission = item.consumption * emissionFactor;
      return {
        id: `emission-${index}`,
        category: item.category || 'General',
        value: emission,
        percentage: 0 // Will be calculated after total
      };
    });

    const total = emissions.reduce((sum, item) => sum + item.value, 0);
    setTotalEmissions(total);

    // Calculate percentages
    const emissionsWithPercentage = emissions.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
    }));

    setEmissionData(emissionsWithPercentage);
  };

  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900 transition-colors duration-500">
        <div className="container mx-auto px-4 py-8 pt-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Leaf className="h-10 w-10 text-green-600 dark:text-green-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                RANTAI 3C
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Cloud • Climate • Chain
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
              Integrating Technology for a Sustainable Future
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6">
              <Badge variant="outline" className="gap-2 bg-green-50 dark:bg-green-900/20">
                <Cloud className="h-4 w-4" />
                Scalable Infrastructure
              </Badge>
              <Badge variant="outline" className="gap-2 bg-blue-50 dark:bg-blue-900/20">
                <Leaf className="h-4 w-4" />
                Carbon Tracking
              </Badge>
              <Badge variant="outline" className="gap-2 bg-purple-50 dark:bg-purple-900/20">
                <Link className="h-4 w-4" />
                Blockchain Verified
              </Badge>
            </div>

            {/* Demo Data Button */}
            {!isUsingDemoData && energyData.length === 0 && (
              <div className="mb-6">
                <Button
                  onClick={generateDemoData}
                  variant="outline"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 hover:from-green-600 hover:to-blue-600 shadow-lg transition-all duration-300"
                >
                  🚀 Try Demo Data - See RANTAI 3C in Action!
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Explore sample carbon footprint analysis with realistic energy consumption data
                </p>
              </div>
            )}

            {/* Demo Mode Indicator */}
            {isUsingDemoData && (
              <div className="mb-6">
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 gap-2">
                  <span className="animate-pulse">⚡</span>
                  Demo Mode Active - Sample Data Loaded
                </Badge>
                <Button
                  onClick={() => { setIsUsingDemoData(false); setEnergyData([]); setEmissionData([]); setTotalEmissions(0); }}
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-xs"
                >
                  Clear Demo Data
                </Button>
              </div>
            )}

            {/* Theme Toggle & Wallet */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative overflow-hidden"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <WalletConnect />
            </div>
          </div>

          {/* Main Content */}
          <Card className="max-w-6xl mx-auto backdrop-blur-sm bg-white/80 dark:bg-black/80 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900 dark:text-gray-100">
                Carbon Footprint Management System
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Monitor, analyze, and certify your environmental impact with blockchain transparency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-12 mb-8 gap-1">
                  <TabsTrigger value="about" className="gap-1 text-xs md:text-sm">
                    <Info className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">About</span>
                  </TabsTrigger>
                  <TabsTrigger value="cloud" className="gap-1 text-xs md:text-sm">
                    <Cloud className="h-3 w-3 md:h-4 md:w-4" />
                    Cloud
                  </TabsTrigger>
                  <TabsTrigger value="auto-pull" className="gap-1 text-xs md:text-sm">
                    <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Auto Pull</span>
                  </TabsTrigger>
                  <TabsTrigger value="climate" className="gap-1 text-xs md:text-sm">
                    <Leaf className="h-3 w-3 md:h-4 md:w-4" />
                    Climate
                  </TabsTrigger>
                  <TabsTrigger value="offset" className="gap-1 text-xs md:text-sm">
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Offset</span>
                  </TabsTrigger>
                  <TabsTrigger value="chain" className="gap-1 text-xs md:text-sm">
                    <Link className="h-3 w-3 md:h-4 md:w-4" />
                    Chain
                  </TabsTrigger>
                  <TabsTrigger value="nft" className="gap-1 text-xs md:text-sm">
                    <Award className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">NFT</span>
                  </TabsTrigger>
                  <TabsTrigger value="badges" className="gap-1 text-xs md:text-sm">
                    <Star className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Badges</span>
                  </TabsTrigger>
                  <TabsTrigger value="credits" className="gap-1 text-xs md:text-sm">
                    <Coins className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Credits</span>
                  </TabsTrigger>
                  <TabsTrigger value="dao" className="gap-1 text-xs md:text-sm">
                    <Vote className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">DAO</span>
                  </TabsTrigger>
                  <TabsTrigger value="oracle" className="gap-1 text-xs md:text-sm">
                    <Activity className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Oracle</span>
                  </TabsTrigger>
                  <TabsTrigger value="test" className="gap-1 text-xs md:text-sm">
                    <Shield className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline">Test</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <div className="grid gap-6 md:gap-8">
                    {/* App Introduction */}
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl text-green-800 dark:text-green-400">
                          <Leaf className="h-8 w-8" />
                          About RANTAI 3C
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          <strong>RANTAI 3C</strong> is a carbon footprint management platform that combines <strong>Cloud Computing</strong>, <strong>Climate Analysis</strong>, and <strong>Blockchain Technology</strong> to provide a comprehensive solution for monitoring and certifying environmental impact.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <Cloud className="h-12 w-12 text-blue-500 mb-3" />
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cloud</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Scalable cloud infrastructure for energy consumption data storage and processing
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <Leaf className="h-12 w-12 text-green-500 mb-3" />
                            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Climate</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              AI-powered carbon footprint analysis for optimization and sustainability recommendations
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <Link className="h-12 w-12 text-purple-500 mb-3" />
                            <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Chain</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Blockchain certification for transparency and carbon footprint data verification
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Target Users */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-200">
                          <Users className="h-6 w-6 text-blue-500" />
                          Who Uses RANTAI 3C?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                              <Target className="h-5 w-5 text-green-500" />
                              Primary Target
                            </h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                              <li>• <strong>Companies & Organizations</strong> - Monitor energy consumption and carbon emissions</li>
                              <li>• <strong>Sustainability Managers</strong> - Environmental reporting and compliance</li>
                              <li>• <strong>Environmental Consultants</strong> - Client environmental impact analysis</li>
                              <li>• <strong>Regulatory Bodies</strong> - Carbon footprint verification and auditing</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-yellow-500" />
                              Key Benefits
                            </h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                              <li>• <strong>Transparency</strong> - Blockchain-verified data</li>
                              <li>• <strong>Scalability</strong> - Flexible cloud infrastructure</li>
                              <li>• <strong>AI Insights</strong> - Smart optimization recommendations</li>
                              <li>• <strong>Compliance</strong> - Certificates for regulatory audits</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* How to Use */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-200">
                          <BarChart3 className="h-6 w-6 text-purple-500" />
                          How to Use RANTAI 3C
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Step 1 */}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              1
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Upload Data (Cloud Tab)</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                Upload CSV or JSON files containing your energy consumption data. Minimum required format: date, category, and consumption (kWh). 
                                For optimal results, also include location and energy source.
                              </p>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  💡 <strong>Tip:</strong> Download the available CSV/JSON template for proper formatting
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              2
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-green-600 dark:text-green-400">Carbon Analysis (Climate Tab)</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                The system will automatically calculate your carbon footprint based on uploaded data. 
                                You'll receive interactive visualizations, AI insights, and optimization recommendations.
                              </p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <p className="text-sm text-green-700 dark:text-green-300">
                                  🧠 <strong>AI Features:</strong> Pattern analysis, efficiency optimization, predictive analytics, industry benchmarking
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              3
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-purple-600 dark:text-purple-400">Blockchain Certification (Chain Tab)</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                Connect your Ethereum wallet to store carbon footprint analysis results on the Sepolia blockchain. 
                                Data will be permanently stored and verifiable for audit purposes.
                              </p>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                  🔐 <strong>Web3 Security:</strong> SIWE authentication, smart contract verification, downloadable certificate
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-200">
                          <Shield className="h-6 w-6 text-indigo-500" />
                          Technology & Security Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">🔒 Security & Privacy</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                              <li>• <strong>SIWE Authentication</strong> - Secure Sign-In with Ethereum</li>
                              <li>• <strong>Blockchain Immutable</strong> - Permanent data storage on Sepolia</li>
                              <li>• <strong>Client-side Processing</strong> - No server data storage</li>
                              <li>• <strong>MetaMask Integration</strong> - Trusted wallet connection</li>
                            </ul>
                            
                            <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 pt-4">📊 Data Processing</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                              <li>• <strong>Multi-format Support</strong> - CSV & JSON file processing</li>
                              <li>• <strong>Real-time Calculation</strong> - Instant carbon footprint analysis</li>
                              <li>• <strong>Data Validation</strong> - Quality assessment and error handling</li>
                              <li>• <strong>Template Download</strong> - Standardized data format</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">🚀 Performance & Scalability</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                              <li>• <strong>Cloud Infrastructure</strong> - Auto-scaling for high workloads</li>
                              <li>• <strong>Load Balancing</strong> - Optimal load distribution</li>
                              <li>• <strong>Data Redundancy</strong> - Automatic backup for reliability</li>
                              <li>• <strong>24/7 Monitoring</strong> - 99.9% system uptime</li>
                            </ul>
                            
                            <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 pt-4">🧠 AI & Analytics</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                              <li>• <strong>Pattern Recognition</strong> - Energy consumption trend detection</li>
                              <li>• <strong>Predictive Modeling</strong> - Future emission forecasting</li>
                              <li>• <strong>Optimization Engine</strong> - Emission reduction recommendations</li>
                              <li>• <strong>Industry Benchmarking</strong> - Comparison with standards</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Getting Started CTA */}
                    <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                      <CardContent className="text-center py-8">
                        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Sustainability Journey?</h3>
                        <p className="text-green-100 mb-6 text-lg">
                          Start with demo data to explore all RANTAI 3C features, 
                          or directly upload your organization's energy consumption data.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          {!isUsingDemoData && energyData.length === 0 && (
                            <Button
                              onClick={generateDemoData}
                              variant="secondary"
                              size="lg"
                              className="bg-white text-green-600 hover:bg-green-50 font-semibold"
                            >
                              🚀 Try Demo Data
                            </Button>
                          )}
                          <p className="text-sm text-green-100">
                            Or start with the <strong>Cloud</strong> tab to upload your own data
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="cloud" className="space-y-6">
                  <DataUpload onDataUpload={handleDataUpload} isUsingDemoData={isUsingDemoData} energyDataCount={energyData.length} />
                </TabsContent>

                <TabsContent value="auto-pull" className="space-y-6">
                  <AutomatedDataPulling onDataPulled={handleDataUpload} />
                </TabsContent>

                <TabsContent value="climate" className="space-y-6">
                  <CarbonAnalysis
                    emissionData={emissionData}
                    totalEmissions={totalEmissions}
                    energyDataCount={energyData.length}
                    isUsingDemoData={isUsingDemoData}
                  />
                </TabsContent>

                <TabsContent value="offset" className="space-y-6">
                  <CarbonOffsetMarketplace
                    totalEmissions={totalEmissions}
                    emissionData={emissionData}
                  />
                </TabsContent>

                <TabsContent value="chain" className="space-y-6">
                  <BlockchainCertification
                    emissionData={emissionData}
                    totalEmissions={totalEmissions}
                    onCertificationComplete={setCertificationHash}
                  />
                </TabsContent>

                <TabsContent value="nft" className="space-y-6">
                  <NFTCertificateGallery />
                </TabsContent>

                <TabsContent value="badges" className="space-y-6">
                  <AchievementBadges
                    userStats={{
                      totalOffsets: purchasedOffsets > 0 ? 1 : 0,
                      netZeroMonths: isNetZero ? 1 : 0,
                      dataQualityStreak: energyData.length > 0 ? 1 : 0,
                      isEarlyAdopter: true,
                      hasBlockchainCert: certificationHash !== '',
                      trackingMonths: energyData.length > 0 ? 1 : 0,
                      totalReduction: purchasedOffsets,
                    }}
                  />
                </TabsContent>

                <TabsContent value="credits" className="space-y-6">
                  <CarbonCreditWallet />
                </TabsContent>

                <TabsContent value="dao" className="space-y-6">
                  <DAOGovernance />
                </TabsContent>

                <TabsContent value="oracle" className="space-y-6">
                  <OracleDashboard />
                </TabsContent>

                <TabsContent value="test" className="space-y-6">
                  <ContractTester />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Web3 • Built with sustainability in mind
            </p>
            
            {/* Credits */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com/mrbrightsides" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <Github className="h-4 w-4" />
                <span>mrbrightsides</span>
              </a>
              
              <span className="text-gray-300 dark:text-gray-600">•</span>
              
              <a 
                href="https://rantai.elpeef.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span>rantai.elpeef.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Web3Provider>
  );
}
