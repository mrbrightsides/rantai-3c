'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Coins, Send, Flame, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2, Info } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';
import { getCarbonCreditBalance, retireCarbonCredits, transferCarbonCredits, getTotalSupply, getTotalRetired } from '@/utils/carbonCredits';
import type { CarbonCreditBalance } from '@/types/governance';

export function CarbonCreditWallet(): JSX.Element {
  const { account, isConnected, provider } = useWeb3();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<CarbonCreditBalance>({
    total: 0,
    retired: 0,
    available: 0
  });
  const [globalStats, setGlobalStats] = useState({ totalSupply: 0, totalRetired: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transferAddress, setTransferAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [retireAmount, setRetireAmount] = useState<string>('');
  const [retireReason, setRetireReason] = useState<string>('');

  const loadBalance = useCallback(async (): Promise<void> => {
    if (!isConnected || !account || !provider) return;
    
    setIsLoading(true);
    try {
      const [userBalance, totalSupply, totalRetired] = await Promise.all([
        getCarbonCreditBalance(provider, account),
        getTotalSupply(provider),
        getTotalRetired(provider)
      ]);
      
      setBalance(userBalance);
      setGlobalStats({ totalSupply, totalRetired });
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, account, provider]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const handleTransfer = async (): Promise<void> => {
    if (!provider || !account) return;
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid amount to transfer',
        variant: 'destructive'
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: '❌ Insufficient Balance',
        description: 'You do not have enough available credits',
        variant: 'destructive'
      });
      return;
    }

    if (!transferAddress || transferAddress.length !== 42) {
      toast({
        title: '❌ Invalid Address',
        description: 'Please enter a valid Ethereum address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await transferCarbonCredits(provider, account, transferAddress, amount);
      
      toast({
        title: '✅ Transfer Successful',
        description: `Sent ${amount.toFixed(2)} carbon credits`,
      });

      setTransferAddress('');
      setTransferAmount('');
      await loadBalance();
    } catch (error) {
      toast({
        title: '❌ Transfer Failed',
        description: error instanceof Error ? error.message : 'Failed to transfer credits',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetire = async (): Promise<void> => {
    if (!provider || !account) return;
    
    const amount = parseFloat(retireAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid amount to retire',
        variant: 'destructive'
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: '❌ Insufficient Balance',
        description: 'You do not have enough available credits',
        variant: 'destructive'
      });
      return;
    }

    if (!retireReason.trim()) {
      toast({
        title: '❌ Reason Required',
        description: 'Please provide a reason for retiring credits',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await retireCarbonCredits(provider, account, amount, retireReason);
      
      toast({
        title: '🔥 Credits Retired Successfully',
        description: `Permanently retired ${amount.toFixed(2)} kg CO₂ credits`,
      });

      setRetireAmount('');
      setRetireReason('');
      await loadBalance();
    } catch (error) {
      toast({
        title: '❌ Retirement Failed',
        description: error instanceof Error ? error.message : 'Failed to retire credits',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Coins className="h-5 w-5" />
            Carbon Credit Wallet
          </CardTitle>
          <CardDescription>
            Manage your ERC-20 carbon credit tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to view and manage your carbon credits.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Coins className="h-5 w-5" />
              Your Carbon Credit Balance
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadBalance}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardTitle>
          <CardDescription>
            1 CC3 Token = 1 kg CO₂ Offset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
              <Coins className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {balance.total.toFixed(2)}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Total Credits</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {balance.total.toFixed(2)} kg CO₂
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {balance.available.toFixed(2)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Available</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Can transfer or retire
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg">
              <Flame className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {balance.retired.toFixed(2)}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Retired</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Permanently offset
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Supply</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {globalStats.totalSupply.toLocaleString()} CC3
                </div>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Global Retired</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {globalStats.totalRetired.toLocaleString()} CC3
                </div>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Credits */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Send className="h-5 w-5" />
            Transfer Carbon Credits
          </CardTitle>
          <CardDescription>
            Send credits to another wallet address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transferAddress">Recipient Address</Label>
              <Input
                id="transferAddress"
                placeholder="0x..."
                value={transferAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="transferAmount">Amount (CC3)</Label>
              <Input
                id="transferAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferAmount(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Available: {balance.available.toFixed(2)} CC3
              </p>
            </div>

            <Button
              onClick={handleTransfer}
              disabled={isLoading || !transferAddress || !transferAmount}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Transfer Credits
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Retire Credits */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Flame className="h-5 w-5" />
            Retire Carbon Credits
          </CardTitle>
          <CardDescription>
            Permanently offset emissions by burning credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <Flame className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900 dark:text-orange-100">
                <strong>Warning:</strong> Retired credits are permanently removed from circulation and cannot be recovered or traded.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="retireAmount">Amount to Retire (CC3)</Label>
              <Input
                id="retireAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={retireAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRetireAmount(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Available: {balance.available.toFixed(2)} CC3
              </p>
            </div>

            <div>
              <Label htmlFor="retireReason">Reason for Retirement</Label>
              <Input
                id="retireReason"
                placeholder="e.g., Offsetting company emissions for Q1 2024"
                value={retireReason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRetireReason(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleRetire}
              disabled={isLoading || !retireAmount || !retireReason}
              className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4" />
                  Retire Credits Permanently
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 About Carbon Credit Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>• <strong>CC3 Tokens</strong> are ERC-20 standard carbon credits on Ethereum</p>
            <p>• <strong>1 CC3 Token</strong> represents 1 kg of verified CO₂ offset</p>
            <p>• <strong>Transferable</strong>: Trade credits with other wallets or exchanges</p>
            <p>• <strong>Retirable</strong>: Permanently burn credits to claim offset impact</p>
            <p>• <strong>Blockchain Verified</strong>: All transactions are transparent and immutable</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
