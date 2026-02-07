// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CarbonCreditToken
 * @dev ERC-20 Token representing tradable carbon credits
 * @notice 1 CARBON token = 1 kg of CO2 offset
 */
contract CarbonCreditToken is ERC20, Ownable, ReentrancyGuard {
    
    // Mapping to track retired (burned) credits per address
    mapping(address => uint256) private _retiredCredits;
    
    // Total retired credits across all users
    uint256 private _totalRetired;
    
    // Minter role - addresses allowed to mint new credits
    mapping(address => bool) private _minters;
    
    // Events
    event CreditsMinted(
        address indexed account,
        uint256 amount,
        string projectId
    );
    
    event CreditsRetired(
        address indexed account,
        uint256 amount,
        string reason
    );
    
    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);
    
    constructor() ERC20("RANTAI 3C Carbon Credit", "CARBON") Ownable(msg.sender) {
        // Owner is automatically a minter
        _minters[msg.sender] = true;
        emit MinterAdded(msg.sender);
    }
    
    /**
     * @dev Mint new carbon credits
     * @param to Address receiving the credits
     * @param amount Amount of credits to mint (in wei, 18 decimals)
     * @param projectId ID of the carbon offset project
     * @return success True if minting succeeded
     */
    function mintCredits(
        address to,
        uint256 amount,
        string memory projectId
    ) external nonReentrant returns (bool) {
        require(_minters[msg.sender], "Caller is not a minter");
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be positive");
        require(bytes(projectId).length > 0, "Project ID required");
        
        _mint(to, amount);
        
        emit CreditsMinted(to, amount, projectId);
        
        return true;
    }
    
    /**
     * @dev Retire (burn) carbon credits permanently
     * @param amount Amount of credits to retire
     * @param reason Reason for retirement (e.g., "Carbon offset for 2024")
     * @return success True if retirement succeeded
     */
    function retireCredits(
        uint256 amount,
        string memory reason
    ) external nonReentrant returns (bool) {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(bytes(reason).length > 0, "Reason required");
        
        _burn(msg.sender, amount);
        
        _retiredCredits[msg.sender] += amount;
        _totalRetired += amount;
        
        emit CreditsRetired(msg.sender, amount, reason);
        
        return true;
    }
    
    /**
     * @dev Get retired credits for an account
     * @param account Address to check
     * @return amount Number of retired credits
     */
    function getRetiredCredits(address account) external view returns (uint256) {
        return _retiredCredits[account];
    }
    
    /**
     * @dev Get total retired credits across all users
     * @return total Total retired credits
     */
    function getTotalRetired() external view returns (uint256) {
        return _totalRetired;
    }
    
    /**
     * @dev Add a new minter
     * @param account Address to grant minter role
     */
    function addMinter(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(!_minters[account], "Already a minter");
        
        _minters[account] = true;
        emit MinterAdded(account);
    }
    
    /**
     * @dev Remove a minter
     * @param account Address to revoke minter role
     */
    function removeMinter(address account) external onlyOwner {
        require(_minters[account], "Not a minter");
        
        _minters[account] = false;
        emit MinterRemoved(account);
    }
    
    /**
     * @dev Check if an address is a minter
     * @param account Address to check
     * @return isMinter True if address has minter role
     */
    function isMinter(address account) external view returns (bool) {
        return _minters[account];
    }
    
    /**
     * @dev Returns the number of decimals (18, standard for ERC-20)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
