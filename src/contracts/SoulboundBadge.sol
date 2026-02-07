// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SustainabilityBadge
 * @dev Soulbound (non-transferable) NFT badges for sustainability achievements
 * Built for RANTAI 3C Carbon Management Platform
 */
contract SustainabilityBadge is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Badge details structure
    struct BadgeInfo {
        string badgeType;
        uint256 mintedAt;
        string metadata;
        bool exists;
    }

    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Mapping from token ID to badge information
    mapping(uint256 => BadgeInfo) private _badgeInfo;

    // Mapping from address to badge types they own
    mapping(address => mapping(string => bool)) private _ownerBadges;

    // Base URI for token metadata
    string private _baseTokenURI;

    // Events
    event BadgeMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string badgeType
    );
    event Locked(uint256 indexed tokenId);

    constructor() ERC721("Sustainability Badge", "SUSTAIN") Ownable(msg.sender) {
        _tokenIdCounter = 1;
        _baseTokenURI = "https://gateway.pinata.cloud/ipfs/";
    }

    /**
     * @dev Mint a new sustainability badge
     * @param to Address to receive the badge
     * @param badgeType Type of badge (e.g., "First Offset", "Carbon Neutral")
     * @param metadata IPFS hash or metadata URI
     * @return tokenId The newly minted token ID
     */
    function mintBadge(
        address to,
        string memory badgeType,
        string memory metadata
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(badgeType).length > 0, "Badge type cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        _badgeInfo[tokenId] = BadgeInfo({
            badgeType: badgeType,
            mintedAt: block.timestamp,
            metadata: metadata,
            exists: true
        });

        _ownerBadges[to][badgeType] = true;

        emit BadgeMinted(to, tokenId, badgeType);
        emit Locked(tokenId);

        return tokenId;
    }

    /**
     * @dev Check if a token is locked (always true for soulbound tokens)
     * @param tokenId Token ID to check
     * @return bool Always returns true
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(_badgeInfo[tokenId].exists, "Token does not exist");
        return true;
    }

    /**
     * @dev Get the token URI for a badge
     * @param tokenId Token ID
     * @return string Token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_badgeInfo[tokenId].exists, "Token does not exist");

        BadgeInfo memory info = _badgeInfo[tokenId];
        
        if (bytes(info.metadata).length > 0) {
            // If metadata is an IPFS hash
            if (bytes(info.metadata)[0] == 'Q' && bytes(info.metadata).length == 46) {
                return string(abi.encodePacked(_baseTokenURI, info.metadata));
            }
            // Return as-is if it's a full URI
            return info.metadata;
        }

        // Fallback to token ID based URI
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    /**
     * @dev Get detailed information about a badge
     * @param tokenId Token ID
     * @return badgeType Type of the badge
     * @return mintedAt Timestamp when badge was minted
     * @return metadata IPFS hash or metadata URI
     */
    function getBadgeDetails(uint256 tokenId)
        external
        view
        returns (
            string memory badgeType,
            uint256 mintedAt,
            string memory metadata
        )
    {
        require(_badgeInfo[tokenId].exists, "Token does not exist");
        BadgeInfo memory info = _badgeInfo[tokenId];
        return (info.badgeType, info.mintedAt, info.metadata);
    }

    /**
     * @dev Check if an address has a specific badge type
     * @param owner Address to check
     * @param badgeType Type of badge to check for
     * @return bool True if owner has this badge type
     */
    function hasBadge(address owner, string memory badgeType)
        external
        view
        returns (bool)
    {
        return _ownerBadges[owner][badgeType];
    }

    /**
     * @dev Set base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Get the base URI
     * @return string Base URI
     */
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Override transfer functions to make tokens soulbound (non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Block all transfers (from != address(0) && to != address(0))
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer not allowed");
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Disable approvals for soulbound tokens
     */
    function approve(address, uint256) public virtual override {
        revert("Soulbound: Approval not allowed");
    }

    /**
     * @dev Disable approval for all for soulbound tokens
     */
    function setApprovalForAll(address, bool) public virtual override {
        revert("Soulbound: Approval not allowed");
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to query
     * @return uint256[] Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }

    /**
     * @dev Get total number of badges minted
     * @return uint256 Total supply
     */
    function totalBadgesMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
}
