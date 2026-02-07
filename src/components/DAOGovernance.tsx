'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Vote, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Loader2,
  Info,
  Send
} from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';
import { useToast } from '@/hooks/use-toast';
import { 
  createProposal, 
  castVote, 
  getAllProposals,
  getGovernanceStats,
  hasVoted
} from '@/utils/governance';
import type { Proposal, GovernanceStats } from '@/types/governance';

export function DAOGovernance(): JSX.Element {
  const { account, isConnected, provider } = useWeb3();
  const { toast } = useToast();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<GovernanceStats>({
    totalProposals: 0,
    activeProposals: 0,
    totalVoters: 0,
    quorumPercentage: 20,
    userVotingPower: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());
  
  // Create proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    projectId: '',
    votingPeriod: 7
  });

  const loadData = useCallback(async (): Promise<void> => {
    if (!isConnected || !account || !provider) return;
    
    setIsLoading(true);
    try {
      const [allProposals, governanceStats] = await Promise.all([
        getAllProposals(provider),
        getGovernanceStats(provider, account)
      ]);
      
      setProposals(allProposals.sort((a, b) => b.id - a.id));
      setStats(governanceStats);

      // Check which proposals user has voted on
      const voted = new Set<number>();
      await Promise.all(
        allProposals.map(async (proposal) => {
          const hasUserVoted = await hasVoted(provider, proposal.id, account);
          if (hasUserVoted) {
            voted.add(proposal.id);
          }
        })
      );
      setVotedProposals(voted);
    } catch (error) {
      console.error('Error loading governance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, account, provider]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateProposal = async (): Promise<void> => {
    if (!provider || !account) return;
    
    if (!newProposal.title.trim() || !newProposal.description.trim() || !newProposal.projectId.trim()) {
      toast({
        title: '❌ Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      const proposalId = await createProposal(
        provider,
        account,
        newProposal.title,
        newProposal.description,
        newProposal.projectId,
        newProposal.votingPeriod
      );
      
      toast({
        title: '✅ Proposal Created',
        description: `Proposal #${proposalId} has been submitted for voting`,
      });

      setNewProposal({ title: '', description: '', projectId: '', votingPeriod: 7 });
      await loadData();
    } catch (error) {
      toast({
        title: '❌ Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create proposal',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleVote = async (proposalId: number, support: boolean): Promise<void> => {
    if (!provider || !account) return;
    
    setIsLoading(true);
    try {
      const txHash = await castVote(provider, account, proposalId, support);
      
      toast({
        title: '✅ Vote Cast Successfully',
        description: `You voted ${support ? 'FOR' : 'AGAINST'} proposal #${proposalId}`,
      });

      await loadData();
    } catch (error) {
      toast({
        title: '❌ Vote Failed',
        description: error instanceof Error ? error.message : 'Failed to cast vote',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'executed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3" />;
      case 'passed': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'executed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Vote className="h-5 w-5" />
            DAO Governance
          </CardTitle>
          <CardDescription>
            Vote on new offset projects and platform decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to participate in governance voting.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Governance Stats */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Vote className="h-5 w-5" />
              DAO Governance Dashboard
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadData}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardTitle>
          <CardDescription>
            Community-driven decision making for offset project selection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalProposals}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Total Proposals</div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.activeProposals}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Active Votes</div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.userVotingPower}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Your Voting Power</div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.quorumPercentage}%
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Quorum Required</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Proposal */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Plus className="h-5 w-5" />
            Create New Proposal
          </CardTitle>
          <CardDescription>
            Propose a new offset project for community approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Add New Mangrove Project in Bali"
                value={newProposal.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewProposal({ ...newProposal, title: e.target.value })
                }
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the project details, impact, and why it should be added..."
                value={newProposal.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setNewProposal({ ...newProposal, description: e.target.value })
                }
                rows={4}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                placeholder="e.g., mangrove-bali-2024"
                value={newProposal.projectId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewProposal({ ...newProposal, projectId: e.target.value })
                }
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="votingPeriod">Voting Period (days)</Label>
              <Input
                id="votingPeriod"
                type="number"
                min="1"
                max="30"
                value={newProposal.votingPeriod}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewProposal({ ...newProposal, votingPeriod: parseInt(e.target.value) || 7 })
                }
                disabled={isCreating}
              />
            </div>

            <Button
              onClick={handleCreateProposal}
              disabled={isCreating}
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Proposals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Proposals ({proposals.length})
          </CardTitle>
          <CardDescription>
            Vote on proposals to shape the platform's future
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No proposals yet. Be the first to create one!
                </AlertDescription>
              </Alert>
            ) : (
              proposals.map((proposal) => {
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
                const hasUserVoted = votedProposals.has(proposal.id);
                const timeLeft = proposal.endTime - Math.floor(Date.now() / 1000);
                const daysLeft = Math.max(0, Math.ceil(timeLeft / 86400));

                return (
                  <Card key={proposal.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              #{proposal.id}
                            </Badge>
                            <Badge className={`text-white gap-1 ${getStatusColor(proposal.status)}`}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status.toUpperCase()}
                            </Badge>
                            {hasUserVoted && (
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                                ✓ You Voted
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {proposal.description}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>Project: <strong>{proposal.projectId}</strong></span>
                            <span>•</span>
                            <span>Proposer: <strong>{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</strong></span>
                            {proposal.status === 'active' && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Voting Results */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            For: {proposal.votesFor}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            Against: {proposal.votesAgainst}
                          </span>
                        </div>
                        <Progress value={forPercentage} className="h-2" />
                        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                          {forPercentage.toFixed(1)}% in favor
                        </div>

                        {/* Voting Buttons */}
                        {proposal.status === 'active' && !hasUserVoted && (
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button
                              onClick={() => handleVote(proposal.id, true)}
                              disabled={isLoading}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Vote For
                            </Button>
                            <Button
                              onClick={() => handleVote(proposal.id, false)}
                              disabled={isLoading}
                              variant="outline"
                              className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <XCircle className="h-4 w-4" />
                              Vote Against
                            </Button>
                          </div>
                        )}

                        {hasUserVoted && proposal.status === 'active' && (
                          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-900 dark:text-blue-100">
                              You have already voted on this proposal
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 How DAO Governance Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>• <strong>Voting Power</strong>: Based on your carbon credit holdings and participation</p>
            <p>• <strong>Quorum</strong>: {stats.quorumPercentage}% of votes needed for proposal to pass</p>
            <p>• <strong>Duration</strong>: Most votes last 7 days from creation</p>
            <p>• <strong>Execution</strong>: Passed proposals are automatically executed after voting ends</p>
            <p>• <strong>Transparency</strong>: All votes and results are recorded on blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
