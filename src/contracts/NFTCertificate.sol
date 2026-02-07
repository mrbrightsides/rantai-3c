// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CarbonOffsetNFT
 * @dev ERC-721 NFT Certificate for Carbon Offset Achievements
 * @notice Mints NFT certificates when users purchase carbon offsets
 */
contract CarbonOffsetNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Struct to store offset details for each NFT
    struct OffsetDetails {
        uint256 offsetAmount;      // Amount of CO2 offset in kg
        string projectName;        // Name of the sustainability project
        uint256 timestamp;         // When the offset was purchased
        string ipfsHash;           // IPFS hash of certificate metadata
    }
    
    // Mapping from token ID to offset details
    mapping(uint256 => OffsetDetails) private _offsetDetails;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Events
    event OffsetCertificateMinted(
        uint256 indexed tokenId,
        address recipient,
        uint256 offsetAmount,
        string projectName,
        string ipfsHash
    );
    
    constructor() ERC721("RANTAI 3C Carbon Offset Certificate", "R3C-OFFSET") Ownable(msg.sender) {
        _baseTokenURI = "ipfs://";
    }
    
    /**
     * @dev Mint a new carbon offset NFT certificate
     * @param to Address receiving the NFT
     * @param offsetAmount Amount of CO2 offset (in kg)
     * @param projectName Name of the offset project
     * @param ipfsHash IPFS hash containing certificate metadata
     * @return tokenId The ID of the newly minted NFT
     */
    function mintOffsetNFT(
        address to,
        uint256 offsetAmount,
        string memory projectName,
        string memory ipfsHash
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(offsetAmount > 0, "Offset amount must be positive");
        require(bytes(projectName).length > 0, "Project name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        _offsetDetails[tokenId] = OffsetDetails({
            offsetAmount: offsetAmount,
            projectName: projectName,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });
        
        emit OffsetCertificateMinted(tokenId, to, offsetAmount, projectName, ipfsHash);
        
        return tokenId;
    }
    
    /**
     * @dev Get offset details for a specific token
     * @param tokenId The NFT token ID
     * @return offsetAmount Amount of CO2 offset
     * @return projectName Name of the project
     * @return timestamp When the offset was created
     * @return ipfsHash IPFS hash of metadata
     */
    function getOffsetDetails(uint256 tokenId) 
        external 
        view 
        returns (
            uint256 offsetAmount,
            string memory projectName,
            uint256 timestamp,
            string memory ipfsHash
        ) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        OffsetDetails memory details = _offsetDetails[tokenId];
        return (
            details.offsetAmount,
            details.projectName,
            details.timestamp,
            details.ipfsHash
        );
    }
    
    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The NFT token ID
     * @return The complete token URI pointing to IPFS metadata
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        OffsetDetails memory details = _offsetDetails[tokenId];
        return string(abi.encodePacked(_baseTokenURI, details.ipfsHash));
    }
    
    /**
     * @dev Set base URI for all tokens
     * @param baseURI The new base URI (e.g., "ipfs://")
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Get total number of NFTs minted
     * @return Total supply of certificates
     */
    function totalSupply() public view override returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Required overrides for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
