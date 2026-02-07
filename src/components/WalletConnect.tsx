'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect(): JSX.Element {
  const { account, isConnected, isConnecting, connect, disconnect } = useWeb3();
  const { toast } = useToast();

  const handleConnect = async (): Promise<void> => {
    try {
      await connect();
      toast({
        title: '✅ Wallet Connected',
        description: 'Successfully authenticated with SIWE',
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: '❌ Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = (): void => {
    disconnect();
    toast({
      title: '👋 Wallet Disconnected',
      description: 'You have been signed out',
    });
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {formatAddress(account)}
        </Badge>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}