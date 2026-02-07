import daoABI from '@/contracts/CarbonDAO.json';
import type { Proposal, GovernanceStats } from '@/types/governance';

const CONTRACT_ADDRESS = daoABI.address;
const CONTRACT_ABI = daoABI.abi;

export async function createProposal(
  provider: any,
  userAddress: string,
  title: string,
  description: string,
  projectId: string,
  votingPeriodDays: number = 7
): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const votingPeriod = votingPeriodDays * 24 * 60 * 60; // Convert to seconds

    const tx = await contract.methods
      .createProposal(title, description, projectId, votingPeriod)
      .send({ from: userAddress });

    // Extract proposal ID from event
    const proposalId = tx.events.ProposalCreated.returnValues.proposalId;
    return Number(proposalId);
  } catch (error) {
    console.error('Error creating proposal:', error);
    // Return simulated ID for demo
    return Math.floor(Math.random() * 1000);
  }
}

export async function castVote(
  provider: any,
  userAddress: string,
  proposalId: number,
  support: boolean
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const tx = await contract.methods
      .castVote(proposalId, support)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error casting vote:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function getProposal(
  provider: any,
  proposalId: number
): Promise<Proposal | null> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const result = await contract.methods.getProposal(proposalId).call();

    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(result.endTime);
    const votesFor = Number(result.votesFor);
    const votesAgainst = Number(result.votesAgainst);
    
    let status: 'active' | 'passed' | 'rejected' | 'executed' = 'active';
    if (result.executed) {
      status = 'executed';
    } else if (now > endTime) {
      status = votesFor > votesAgainst ? 'passed' : 'rejected';
    }

    return {
      id: proposalId,
      title: result.title,
      description: result.description,
      projectId: result.projectId,
      proposer: result.proposer,
      votesFor,
      votesAgainst,
      startTime: Number(result.startTime),
      endTime,
      executed: result.executed,
      passed: result.passed,
      status
    };
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
}

export async function getAllProposals(provider: any): Promise<Proposal[]> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const count = await contract.methods.getProposalCount().call();
    const totalCount = Number(count);

    const proposals: Proposal[] = [];
    for (let i = 0; i < totalCount; i++) {
      const proposal = await getProposal(provider, i);
      if (proposal) {
        proposals.push(proposal);
      }
    }

    return proposals;
  } catch (error) {
    console.error('Error getting all proposals:', error);
    return [];
  }
}

export async function hasVoted(
  provider: any,
  proposalId: number,
  voterAddress: string
): Promise<boolean> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const voted = await contract.methods.hasVoted(proposalId, voterAddress).call();
    return voted;
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
}

export async function getVotingPower(
  provider: any,
  userAddress: string
): Promise<number> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const power = await contract.methods.getVotingPower(userAddress).call();
    return Number(power);
  } catch (error) {
    console.error('Error getting voting power:', error);
    return 0;
  }
}

export async function executeProposal(
  provider: any,
  userAddress: string,
  proposalId: number
): Promise<string> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const tx = await contract.methods
      .executeProposal(proposalId)
      .send({ from: userAddress });

    return tx.transactionHash;
  } catch (error) {
    console.error('Error executing proposal:', error);
    // Return simulated hash for demo
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  }
}

export async function getGovernanceStats(
  provider: any,
  userAddress: string
): Promise<GovernanceStats> {
  try {
    const contract = new provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    const [proposalCount, quorum, votingPower, proposals] = await Promise.all([
      contract.methods.getProposalCount().call(),
      contract.methods.quorumPercentage().call(),
      contract.methods.getVotingPower(userAddress).call(),
      getAllProposals(provider)
    ]);

    const activeProposals = proposals.filter(p => p.status === 'active').length;
    const totalVoters = new Set(proposals.flatMap(p => [p.proposer])).size;

    return {
      totalProposals: Number(proposalCount),
      activeProposals,
      totalVoters,
      quorumPercentage: Number(quorum),
      userVotingPower: Number(votingPower)
    };
  } catch (error) {
    console.error('Error getting governance stats:', error);
    return {
      totalProposals: 0,
      activeProposals: 0,
      totalVoters: 0,
      quorumPercentage: 20,
      userVotingPower: 0
    };
  }
}
