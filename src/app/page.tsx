'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cloud, Leaf, Link as LinkIcon, Sparkles, Shield, Zap, TrendingUp, Award, Check, Github, ExternalLink } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function LandingPage(): JSX.Element {
    const router = useRouter();
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
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }
            })
          }
          
          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }
          }, 1000)
        }
      }
      
      initializeFarcaster()
    }, [])

    const handleLaunchApp = () => {
      router.push('/dashboard');
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 pt-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Leaf className="h-16 w-16 text-green-600 dark:text-green-400" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                RANTAI 3C
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Chain Your Climate Action
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Cloud • Climate • Chain
            </p>

            {/* Description */}
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              The blockchain-powered carbon management platform that makes sustainability <strong>accessible, transparent, and rewarding</strong> for Indonesian SMEs.
            </p>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                type="button"
                size="lg" 
                onClick={handleLaunchApp}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                type="button"
                size="lg" 
                variant="outline"
                onClick={handleLaunchApp}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-6 text-lg cursor-pointer"
              >
                Try Demo
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
              <Badge variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2">
                <Shield className="h-4 w-4 text-green-600" />
                Blockchain Verified
              </Badge>
              <Badge variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2">
                <Zap className="h-4 w-4 text-blue-600" />
                AI-Powered Insights
              </Badge>
              <Badge variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2">
                <Award className="h-4 w-4 text-purple-600" />
                NFT Certificates
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
            Three Pillars of Sustainability
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            RANTAI 3C integrates cutting-edge technology to deliver a comprehensive carbon management solution
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cloud Pillar */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-8 relative">
                <Cloud className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Cloud</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Import data seamlessly from Google Drive, Dropbox, or OneDrive with one click.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Automated data synchronization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Multi-format support (CSV, JSON)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Scalable cloud infrastructure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Climate Pillar */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-8 relative">
                <Leaf className="h-16 w-16 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Climate</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  AI automatically calculates your carbon footprint with actionable insights.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time carbon footprint analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>AI-powered optimization tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Industry benchmarking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Chain Pillar */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 dark:border-purple-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-8 relative">
                <LinkIcon className="h-16 w-16 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Chain</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  All data stored on Ethereum blockchain and IPFS—transparent and immutable.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Blockchain-verified certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>NFT offset certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Tamper-proof audit trail</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
            Powerful Features for SMEs
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Everything you need to track, offset, and certify your carbon footprint
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature Cards */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Carbon Offset Marketplace</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Purchase verified local carbon offsets with crypto or PayPal. Support reforestation and renewable energy projects in Indonesia.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">NFT Certificates</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Receive blockchain-verified NFT certificates for every offset. Showcase your climate action to investors and partners.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Soulbound Badges</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Earn non-transferable achievement badges for sustainability milestones. Permanent proof of your commitment.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Oracle Verification</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Carbon data verified by CarbonOracle smart contract. Trusted by auditors and regulatory bodies.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Insights</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get smart recommendations to reduce emissions. Pattern recognition and predictive analytics for optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <LinkIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">DAO Governance</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Participate in community decisions. Vote on project funding and platform improvements with CarbonDAO.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why Indonesian SMEs Choose RANTAI 3C
          </h2>
          <p className="text-center text-green-100 mb-12 max-w-2xl mx-auto">
            Making Net Zero accessible for 64 million Indonesian businesses
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">90% Cost Reduction</h3>
                <p className="text-green-100">
                  Cut sustainability tool costs dramatically compared to traditional ESG platforms.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Investor-Ready Certifications</h3>
                <p className="text-green-100">
                  Blockchain-verified reports trusted by VCs, banks, and partners for tenders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Local Offset Projects</h3>
                <p className="text-green-100">
                  Access verified Indonesian carbon offset projects with transparent impact tracking.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhanced ESG Reputation</h3>
                <p className="text-green-100">
                  Stand out in tenders and partnerships with verified sustainability credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contracts Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
            Powered by 5 Smart Contracts
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Open-source, audited, and deployed on Sepolia testnet
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">NFTCertificate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Offset certificates as NFTs</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">SoulboundBadge</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Non-transferable achievements</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">CarbonCreditToken</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ERC-20 carbon credits</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">CarbonDAO</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Community governance</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">CarbonOracle</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data verification on-chain</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Start Your Net-Zero Journey Today
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Join Indonesian SMEs making real contributions to Indonesia's Net Zero 2060 goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="button"
                  size="lg" 
                  variant="secondary"
                  onClick={handleLaunchApp}
                  className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold cursor-pointer"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  type="button"
                  size="lg" 
                  variant="outline"
                  onClick={handleLaunchApp}
                  className="bg-white/90 hover:bg-white border-2 border-white text-blue-600 px-8 py-6 text-lg font-semibold cursor-pointer"
                >
                  View Demo
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">RANTAI 3C</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Making sustainability accessible, transparent, and rewarding
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.open('https://github.com/mrbrightsides', '_blank')}
                className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
                <span>mrbrightsides</span>
              </button>
              
              <span className="text-gray-300 dark:text-gray-600">•</span>
              
              <button
                onClick={() => window.open('https://rantai.elpeef.com', '_blank')}
                className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                aria-label="RANTAI Website"
              >
                <ExternalLink className="h-4 w-4" />
                <span>rantai.elpeef.com</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by Web3 • Built on Base • Indonesia 🇮🇩
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
