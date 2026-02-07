export interface Proposal {
  id: number;
  title: string;
  description: string;
  projectId: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  startTime: number;
  endTime: number;
  executed: boolean;
  passed: boolean;
  status: 'active' | 'passed' | 'rejected' | 'executed';
}

export interface VoteHistory {
  proposalId: number;
  voter: string;
  support: boolean;
  votes: number;
  timestamp: number;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  quorumPercentage: number;
  userVotingPower: number;
}

export interface CarbonCreditBalance {
  total: number;
  retired: number;
  available: number;
}

export interface OracleData {
  carbonPrice: number;
  lastUpdate: number;
  emissionFactors: Record<string, number>;
}
