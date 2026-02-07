'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Lock, Unlock, Info, Star, Zap } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';
import { BADGE_DEFINITIONS, getBadgeColorClass, checkBadgeEligibility } from '@/utils/badgeDefinitions';
import type { BadgeType } from '@/types/nft';

interface UserStats {
  totalOffsets: number;
  netZeroMonths: number;
  dataQualityStreak: number;
  isEarlyAdopter: boolean;
  hasBlockchainCert: boolean;
  trackingMonths: number;
  totalReduction: number;
}

interface AchievementBadgesProps {
  userStats: UserStats;
  onBadgeMinted?: () => void;
}

export function AchievementBadges({ userStats, onBadgeMinted }: AchievementBadgesProps): JSX.Element {
  const { isConnected, account, getBadges, mintBadge } = useWeb3();
  const { toast } = useToast();
  const [ownedBadges, setOwnedBadges] = useState<Array<{
    tokenId: number;
    badgeType: string;
    mintedAt: number;
    metadata: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<string | null>(null);

  const loadBadges = useCallback(async (): Promise<void> => {
    if (!isConnected || !account) return;

    setIsLoading(true);
    try {
      const userBadges = await getBadges();
      setOwnedBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
      toast({
        title: '❌ Failed to Load Badges',
        description: 'Could not retrieve your achievement badges',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, account, getBadges, toast]);

  useEffect(() => {
    if (isConnected && account) {
      loadBadges();
    }
  }, [isConnected, account, loadBadges]);

  const handleMintBadge = useCallback(async (badgeType: BadgeType): Promise<void> => {
    if (!isConnected || !account) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your wallet to mint badges',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(badgeType);
    try {
      const metadata = JSON.stringify({
        badgeType,
        timestamp: Date.now(),
        account,
      });

      const tokenId = await mintBadge(badgeType, metadata);

      toast({
        title: '🎉 Badge Minted!',
        description: `You've earned the ${BADGE_DEFINITIONS[badgeType].name} badge!`,
      });

      // Reload badges
      await loadBadges();
      if (onBadgeMinted) onBadgeMinted();
    } catch (error) {
      console.error('Error minting badge:', error);
      toast({
        title: '❌ Minting Failed',
        description: error instanceof Error ? error.message : 'Failed to mint achievement badge',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(null);
    }
  }, [isConnected, account, mintBadge, loadBadges, onBadgeMinted, toast]);

  const hasBadge = (badgeType: string): boolean => {
    return ownedBadges.some(b => b.badgeType === badgeType);
  };

  const isEligible = (badgeType: BadgeType): boolean => {
    return checkBadgeEligibility(badgeType, userStats);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isConnected) {
    return (
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Star className="h-5 w-5" />
            Achievement Badges
          </CardTitle>
          <CardDescription>
            Earn non-transferable badges for sustainability milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to view and earn achievement badges. These are Soulbound Tokens (SBTs) that cannot be transferred or sold—they're permanent proof of your accomplishments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Owned Badges */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Award className="h-5 w-5" />
                Your Achievement Badges
              </CardTitle>
              <CardDescription>
                Soulbound tokens representing your sustainability journey
              </CardDescription>
            </div>
            <Button onClick={loadBadges} variant="outline" size="sm" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : ownedBadges.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Star className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Badges Earned Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Complete sustainability milestones to earn permanent, non-transferable achievement badges!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've earned <strong className="text-purple-600 dark:text-purple-400">{ownedBadges.length}</strong> badge{ownedBadges.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedBadges.map((badge) => {
                  const def = BADGE_DEFINITIONS[badge.badgeType as BadgeType];
                  return (
                    <Card key={badge.tokenId} className={`border-2 ${getBadgeColorClass(def.color)}`}>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <div className="text-5xl">{def.icon}</div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{def.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{def.description}</p>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <Lock className="h-3 w-3" />
                            <span>Soulbound • {formatDate(badge.mintedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges to Earn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Zap className="h-5 w-5 text-yellow-500" />
            Available Achievements
          </CardTitle>
          <CardDescription>
            Complete milestones to unlock and mint new badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(BADGE_DEFINITIONS) as BadgeType[]).map((badgeType) => {
              const def = BADGE_DEFINITIONS[badgeType];
              const owned = hasBadge(badgeType);
              const eligible = isEligible(badgeType);

              return (
                <Card key={badgeType} className={`border-2 ${owned ? 'opacity-50' : ''} ${getBadgeColorClass(def.color)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{def.icon}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{def.name}</h4>
                          {owned && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Lock className="h-3 w-3" />
                              Owned
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {def.description}
                        </p>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                            <strong>Requirement:</strong> {def.requirement}
                          </p>
                          {!owned && (
                            <Button
                              onClick={() => handleMintBadge(badgeType)}
                              disabled={!eligible || isMinting !== null}
                              size="sm"
                              className="w-full gap-1"
                              variant={eligible ? 'default' : 'outline'}
                            >
                              {isMinting === badgeType ? (
                                <>
                                  <Unlock className="h-3 w-3 animate-pulse" />
                                  Minting...
                                </>
                              ) : eligible ? (
                                <>
                                  <Unlock className="h-3 w-3" />
                                  Mint Badge
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3" />
                                  Locked
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* What are Soulbound Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Info className="h-5 w-5 text-blue-500" />
            What are Soulbound Badges?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">🔒 Non-Transferable</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlike regular NFTs, Soulbound Tokens (SBTs) are permanently bound to your wallet. 
                They cannot be transferred, sold, or traded—ensuring authenticity of achievements.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">🏆 Proof of Achievement</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each badge represents a real milestone in your sustainability journey. 
                They serve as permanent, verifiable credentials on the blockchain.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">👤 Reputation Building</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build your on-chain reputation by collecting badges. 
                They can be used for governance, access control, or proving expertise in sustainability.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">✨ Gamification</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Badges make sustainability engaging and rewarding. 
                Track your progress, compete with peers, and showcase your environmental commitment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
