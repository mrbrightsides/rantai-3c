// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CarbonGovernance
 * @dev Decentralized Autonomous Organization for carbon project governance
 * @notice Token-weighted voting for sustainability project approval
 */
contract CarbonGovernance is Ownable, ReentrancyGuard {
    
    // Interface for Carbon Credit Token (for voting power)
    interface ICarbonToken {
        function balanceOf(address account) external view returns (uint256);
    }
    
    ICarbonToken public carbonToken;
    
    // Proposal structure
    struct Proposal {
        string title;              // Proposal title
        string description;        // Detailed description
        string projectId;          // Associated project ID
        address proposer;          // Who created the proposal
        uint256 votesFor;          // Votes in favor
        uint256 votesAgainst;      // Votes against
        uint256 startTime;         // Voting start timestamp
        uint256 endTime;           // Voting end timestamp
        bool executed;             // Whether proposal was executed
        bool passed;               // Whether proposal passed
        mapping(address => bool) hasVoted;  // Track who voted
        mapping(address => bool) voteChoice; // Track vote choice
    }
    
    // Proposal storage
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Governance parameters
    uint256 public constant MIN_VOTING_PERIOD = 1 days;
    uint256 public constant MAX_VOTING_PERIOD = 30 days;
    uint256 public quorumPercentage = 10; // 10% of total supply needed
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string description
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votes
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        bool passed
    );
    
    constructor(address _carbonToken) Ownable(msg.sender) {
        require(_carbonToken != address(0), "Invalid token address");
        carbonToken = ICarbonToken(_carbonToken);
    }
    
    /**
     * @dev Create a new governance proposal
     * @param title Proposal title
     * @param description Detailed description
     * @param projectId Associated sustainability project
     * @param votingPeriod Duration of voting in seconds
     * @return proposalId The ID of the new proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory projectId,
        uint256 votingPeriod
    ) external nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(
            votingPeriod >= MIN_VOTING_PERIOD && votingPeriod <= MAX_VOTING_PERIOD,
            "Invalid voting period"
        );
        require(carbonToken.balanceOf(msg.sender) > 0, "Must hold tokens to propose");
        
        uint256 proposalId = proposalCount;
        proposalCount++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.title = title;
        newProposal.description = description;
        newProposal.projectId = projectId;
        newProposal.proposer = msg.sender;
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.executed = false;
        newProposal.passed = false;
        
        emit ProposalCreated(proposalId, msg.sender, title, description);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param proposalId The proposal to vote on
     * @param support True to vote in favor, false to vote against
     * @return success True if vote was cast
     */
    function castVote(uint256 proposalId, bool support) external nonReentrant returns (bool) {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 votingPower = carbonToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = support;
        
        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
        
        return true;
    }
    
    /**
     * @dev Execute a proposal after voting period ends
     * @param proposalId The proposal to execute
     * @return success True if execution succeeded
     */
    function executeProposal(uint256 proposalId) external nonReentrant returns (bool) {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        
        // Check if quorum reached and majority voted in favor
        if (proposal.votesFor > proposal.votesAgainst && totalVotes > 0) {
            proposal.passed = true;
        }
        
        emit ProposalExecuted(proposalId, proposal.passed);
        
        return true;
    }
    
    /**
     * @dev Get full proposal details
     * @param proposalId The proposal to query
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (
            string memory title,
            string memory description,
            string memory projectId,
            address proposer,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 startTime,
            uint256 endTime,
            bool executed,
            bool passed
        )
    {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.title,
            proposal.description,
            proposal.projectId,
            proposal.proposer,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            proposal.passed
        );
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        require(proposalId < proposalCount, "Proposal does not exist");
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @dev Get voting power for an address
     */
    function getVotingPower(address account) external view returns (uint256) {
        return carbonToken.balanceOf(account);
    }
    
    /**
     * @dev Get total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }
    
    /**
     * @dev Update quorum percentage (only owner)
     */
    function setQuorumPercentage(uint256 newQuorum) external onlyOwner {
        require(newQuorum > 0 && newQuorum <= 100, "Invalid quorum");
        quorumPercentage = newQuorum;
    }
}
