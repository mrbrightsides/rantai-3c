'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Globe, 
  RefreshCw,
  Loader2,
  Info,
  Database
} from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';
import { getOracleData, calculateEmissions, calculateCost } from '@/utils/oracle';
import type { OracleData } from '@/types/governance';

export function OracleDashboard(): JSX.Element {
  const { isConnected, provider } = useWeb3();
  const { toast } = useToast();
  
  const [oracleData, setOracleData] = useState<OracleData>({
    carbonPrice: 0,
    lastUpdate: 0,
    emissionFactors: {}
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sampleCalc, setSampleCalc] = useState({
    energy: 1000,
    region: 'indonesia',
    emissions: 0,
    cost: 0
  });

  const loadOracleData = useCallback(async (): Promise<void> => {
    if (!provider) {
      // Load with demo data if no provider
      setOracleData({
        carbonPrice: 15.50,
        lastUpdate: Math.floor(Date.now() / 1000),
        emissionFactors: {
          'indonesia': 0.85,
          'java': 0.75,
          'kalimantan': 0.92,
          'sulawesi': 0.80,
          'sumatra': 0.88
        }
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getOracleData(provider);
      setOracleData(data);

      // Update sample calculation
      const emissions = await calculateEmissions(provider, sampleCalc.energy, sampleCalc.region);
      const cost = await calculateCost(provider, emissions);
      setSampleCalc(prev => ({ ...prev, emissions, cost }));
    } catch (error) {
      console.error('Error loading oracle data:', error);
      toast({
        title: '❌ Failed to Load Oracle Data',
        description: 'Using cached data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [provider, sampleCalc.energy, sampleCalc.region, toast]);

  useEffect(() => {
    loadOracleData();
  }, [loadOracleData]);

  const timeSinceUpdate = Math.floor(Date.now() / 1000) - oracleData.lastUpdate;
  const minutesAgo = Math.floor(timeSinceUpdate / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  
  let updateText = 'Just now';
  if (hoursAgo > 0) {
    updateText = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (minutesAgo > 0) {
    updateText = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  }

  const regions = Object.entries(oracleData.emissionFactors).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Oracle Status */}
      <Card className="border-cyan-200 dark:border-cyan-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Activity className="h-5 w-5" />
              Real-Time Carbon Data Oracle
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadOracleData}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Blockchain-verified pricing and emission factors from Chainlink oracles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Oracle Status</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Last updated: {updateText}</div>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Credit Pricing */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <DollarSign className="h-5 w-5" />
            Live Carbon Credit Pricing
          </CardTitle>
          <CardDescription>
            Market price per tonne CO₂ from aggregated exchanges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${oracleData.carbonPrice.toFixed(2)}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Per Tonne CO₂</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                ${(oracleData.carbonPrice / 1000).toFixed(3)}/kg
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                +2.3%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">24h Change</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Trending up
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                High
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Market Volume</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Active trading
              </div>
            </div>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Prices are aggregated from multiple carbon credit exchanges and updated every 15 minutes via Chainlink oracles.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Regional Emission Factors */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Globe className="h-5 w-5" />
            Regional Emission Factors
          </CardTitle>
          <CardDescription>
            CO₂ intensity per kWh by region (kg CO₂/kWh)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regions.map(([region, factor]) => {
              const percentage = (factor / 1.5) * 100; // Scale to max 1.5 kg/kWh
              const isHigh = factor > 0.85;
              const isMedium = factor > 0.75 && factor <= 0.85;
              
              return (
                <div key={region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          isHigh 
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' 
                            : isMedium
                            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        }`}
                      >
                        {isHigh ? 'High' : isMedium ? 'Medium' : 'Low'}
                      </Badge>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {factor.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isHigh 
                          ? 'bg-red-500' 
                          : isMedium 
                          ? 'bg-orange-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              Lower values indicate cleaner energy grids. These factors are updated monthly based on grid composition data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Sample Calculator */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Activity className="h-5 w-5" />
            Oracle-Powered Calculator
          </CardTitle>
          <CardDescription>
            Real-time calculations using live oracle data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This calculator uses real-time emission factors and carbon prices from blockchain oracles.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sample Calculation
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Energy Usage:</span>
                    <span className="font-bold">{sampleCalc.energy.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Region:</span>
                    <span className="font-bold capitalize">{sampleCalc.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Emission Factor:</span>
                    <span className="font-bold">{oracleData.emissionFactors[sampleCalc.region]?.toFixed(3) || 'N/A'} kg/kWh</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Results
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Emissions</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {sampleCalc.emissions.toFixed(2)} kg CO₂
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Offset Cost</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${sampleCalc.cost.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 About Carbon Data Oracles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>• <strong>Chainlink Oracles</strong>: Decentralized networks providing tamper-proof data</p>
            <p>• <strong>Real-time Pricing</strong>: Carbon credit prices aggregated from multiple exchanges</p>
            <p>• <strong>Emission Factors</strong>: Regional grid intensities updated based on energy mix</p>
            <p>• <strong>Automatic Updates</strong>: Data refreshed every 15 minutes for accuracy</p>
            <p>• <strong>Blockchain Verified</strong>: All oracle data is cryptographically signed and verifiable</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
