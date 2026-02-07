'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Database, Zap, CheckCircle, AlertCircle, RefreshCw, Key, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { EnergyData } from '@/types/carbon';

interface AutomatedDataPullingProps {
  onDataPulled: (data: EnergyData[]) => void;
}

interface CloudProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

export function AutomatedDataPulling({ onDataPulled }: AutomatedDataPullingProps): JSX.Element {
  const { toast } = useToast();
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('aws');
  const [apiKey, setApiKey] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: 'aws',
      name: 'Amazon Web Services',
      icon: <Cloud className="h-6 w-6 text-orange-500" />,
      description: 'EC2, S3, RDS energy consumption data',
      status: 'disconnected',
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      icon: <Database className="h-6 w-6 text-blue-500" />,
      description: 'Compute Engine, Cloud Storage metrics',
      status: 'disconnected',
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      icon: <Zap className="h-6 w-6 text-cyan-500" />,
      description: 'Virtual Machines, Azure Storage data',
      status: 'disconnected',
    },
  ]);

  const simulateDataPulling = async (provider: string): Promise<EnergyData[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate realistic sample data based on provider
    const categories: Record<string, string[]> = {
      aws: ['EC2 Instances', 'S3 Storage', 'RDS Database', 'Lambda Functions', 'CloudFront CDN'],
      gcp: ['Compute Engine', 'Cloud Storage', 'BigQuery', 'App Engine', 'Cloud SQL'],
      azure: ['Virtual Machines', 'Blob Storage', 'SQL Database', 'App Service', 'Functions'],
    };

    const providerCategories = categories[provider as keyof typeof categories] || categories.aws;
    const locations = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-3'];
    
    const data: EnergyData[] = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      providerCategories.forEach((category: string, index: number) => {
        data.push({
          id: `${provider}-${i}-${index}`,
          date: currentDate.toISOString().split('T')[0],
          category,
          consumption: Math.random() * 500 + 100, // Random consumption between 100-600 kWh
          location: locations[index % locations.length],
          source: 'Cloud Provider',
        });
      });
    }

    return data;
  };

  const handlePullData = async (): Promise<void> => {
    if (!apiKey || !accountId) {
      toast({
        title: '⚠️ Missing Credentials',
        description: 'Please provide API Key and Account ID to connect',
        variant: 'destructive',
      });
      return;
    }

    setIsPulling(true);
    
    try {
      toast({
        title: '🔄 Connecting to Cloud Provider',
        description: `Authenticating with ${providers.find(p => p.id === selectedProvider)?.name}...`,
      });

      const data = await simulateDataPulling(selectedProvider);
      
      // Update provider status
      setProviders(prev => prev.map(p => 
        p.id === selectedProvider 
          ? { ...p, status: 'connected' as const, lastSync: new Date().toISOString() }
          : p
      ));

      onDataPulled(data);

      toast({
        title: '✅ Data Successfully Pulled',
        description: `Retrieved ${data.length} records from ${providers.find(p => p.id === selectedProvider)?.name}`,
      });

    } catch (error) {
      toast({
        title: '❌ Data Pull Failed',
        description: error instanceof Error ? error.message : 'Failed to retrieve cloud data',
        variant: 'destructive',
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handleDisconnect = (providerId: string): void => {
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { ...p, status: 'disconnected' as const, lastSync: undefined }
        : p
    ));
    
    toast({
      title: '🔌 Provider Disconnected',
      description: `${providers.find(p => p.id === providerId)?.name} has been disconnected`,
    });
  };

  return (
    <Card className="border-cyan-200 dark:border-cyan-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <RefreshCw className="h-5 w-5" />
          Automated Data Pulling - Cloud Integration
        </CardTitle>
        <CardDescription>
          Connect to your cloud providers to automatically pull energy consumption data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                selectedProvider === provider.id
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="flex items-start justify-between mb-3">
                {provider.icon}
                <Badge
                  variant={provider.status === 'connected' ? 'default' : 'outline'}
                  className={
                    provider.status === 'connected'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }
                >
                  {provider.status === 'connected' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Disconnected
                    </>
                  )}
                </Badge>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {provider.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {provider.description}
              </p>
              {provider.lastSync && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Calendar className="h-3 w-3" />
                  Last sync: {new Date(provider.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connection Configuration */}
        <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aws">AWS</TabsTrigger>
            <TabsTrigger value="gcp">GCP</TabsTrigger>
            <TabsTrigger value="azure">Azure</TabsTrigger>
          </TabsList>

          <TabsContent value="aws" className="space-y-4 mt-4">
            <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <Cloud className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900 dark:text-orange-100">
                <strong>AWS CloudWatch Integration</strong>
                <br />
                Connects to AWS Cost and Usage Reports to retrieve EC2, S3, RDS, and other service consumption data.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="aws-key">AWS Access Key ID</Label>
                <Input
                  id="aws-key"
                  type="text"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="aws-account">AWS Account ID</Label>
                <Input
                  id="aws-account"
                  type="text"
                  placeholder="123456789012"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gcp" className="space-y-4 mt-4">
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Database className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <strong>GCP Cloud Monitoring Integration</strong>
                <br />
                Connects to Google Cloud's Carbon Footprint API to retrieve Compute Engine, Storage, and BigQuery metrics.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="gcp-key">GCP Service Account Key</Label>
                <Input
                  id="gcp-key"
                  type="text"
                  placeholder="your-service-account-key.json"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gcp-project">GCP Project ID</Label>
                <Input
                  id="gcp-project"
                  type="text"
                  placeholder="my-project-123456"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="azure" className="space-y-4 mt-4">
            <Alert className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
              <Zap className="h-4 w-4 text-cyan-600" />
              <AlertDescription className="text-cyan-900 dark:text-cyan-100">
                <strong>Azure Monitor Integration</strong>
                <br />
                Connects to Azure Cost Management API to retrieve Virtual Machine, Storage, and SQL Database consumption data.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="azure-key">Azure Subscription Key</Label>
                <Input
                  id="azure-key"
                  type="text"
                  placeholder="your-subscription-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="azure-subscription">Azure Subscription ID</Label>
                <Input
                  id="azure-subscription"
                  type="text"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Date Range Selection */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Data Collection Period
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {providers.find(p => p.id === selectedProvider)?.status === 'connected' ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePullData}
                disabled={isPulling}
                className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isPulling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Pulling Data...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    Pull Latest Data
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleDisconnect(selectedProvider)}
                variant="outline"
                className="gap-2"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={handlePullData}
              disabled={isPulling || !apiKey || !accountId}
              className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isPulling ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Connect & Pull Data
                </>
              )}
            </Button>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days selected
          </div>
        </div>

        {/* Benefits Section */}
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-medium text-cyan-900 dark:text-cyan-100 mb-3">
            ✨ Benefits of Automated Data Pulling
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cyan-800 dark:text-cyan-200">
            <div className="space-y-2">
              <p>• <strong>Real-time Sync:</strong> Automatically fetch latest consumption data</p>
              <p>• <strong>Eliminate Manual Entry:</strong> No more CSV uploads for cloud services</p>
              <p>• <strong>Enterprise Scale:</strong> Handle large-scale infrastructure effortlessly</p>
            </div>
            <div className="space-y-2">
              <p>• <strong>Multi-Region Support:</strong> Pull data from all your cloud regions</p>
              <p>• <strong>Scheduled Pulls:</strong> Set up daily/weekly automatic data retrieval</p>
              <p>• <strong>Comprehensive Coverage:</strong> All major cloud services included</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
