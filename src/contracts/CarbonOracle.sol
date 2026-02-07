// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CarbonDataOracle
 * @dev Oracle for real-time carbon credit pricing and emission factors
 * @notice Provides dynamic pricing and regional emission calculations
 */
contract CarbonDataOracle is Ownable, ReentrancyGuard {
    
    // Current carbon credit price (in wei, 18 decimals)
    // Example: 20 USD per ton = 20 * 10^18
    uint256 private _carbonCreditPrice;
    
    // Last update timestamp
    uint256 private _lastUpdateTime;
    
    // Emission factors by region (kgCO2 per kWh * 10^6 for precision)
    // Example: Indonesia = 0.82 kgCO2/kWh = 820000
    mapping(string => uint256) private _emissionFactors;
    
    // Authorized data feeders
    mapping(address => bool) private _dataFeeders;
    
    // Events
    event PriceUpdated(uint256 price, uint256 timestamp);
    
    event EmissionFactorUpdated(
        string region,
        uint256 factor,
        uint256 timestamp
    );
    
    event DataFeederAdded(address indexed feeder);
    event DataFeederRemoved(address indexed feeder);
    
    constructor() Ownable(msg.sender) {
        // Initialize with default values
        _carbonCreditPrice = 20 * 10**18; // $20 per ton CO2
        _lastUpdateTime = block.timestamp;
        
        // Set default emission factors (kgCO2/kWh * 10^6)
        _emissionFactors["Indonesia"] = 820000;  // 0.82 kgCO2/kWh
        _emissionFactors["Global"] = 475000;     // 0.475 kgCO2/kWh (global avg)
        _emissionFactors["USA"] = 400000;        // 0.40 kgCO2/kWh
        _emissionFactors["EU"] = 295000;         // 0.295 kgCO2/kWh
        _emissionFactors["China"] = 555000;      // 0.555 kgCO2/kWh
        
        // Owner is default data feeder
        _dataFeeders[msg.sender] = true;
        emit DataFeederAdded(msg.sender);
    }
    
    /**
     * @dev Get current carbon credit price
     * @return price Current price in wei (18 decimals)
     */
    function getCarbonCreditPrice() external view returns (uint256) {
        return _carbonCreditPrice;
    }
    
    /**
     * @dev Get emission factor for a region
     * @param region Region name (e.g., "Indonesia", "Global")
     * @return factor Emission factor (kgCO2/kWh * 10^6)
     */
    function getEmissionFactor(string memory region) external view returns (uint256) {
        uint256 factor = _emissionFactors[region];
        
        // Return global average if region not found
        if (factor == 0) {
            return _emissionFactors["Global"];
        }
        
        return factor;
    }
    
    /**
     * @dev Get last update timestamp
     * @return timestamp Unix timestamp of last update
     */
    function getLastUpdateTime() external view returns (uint256) {
        return _lastUpdateTime;
    }
    
    /**
     * @dev Update carbon credit price (only data feeders)
     * @param newPrice New price in wei (18 decimals)
     * @return success True if update succeeded
     */
    function updateCarbonPrice(uint256 newPrice) external nonReentrant returns (bool) {
        require(_dataFeeders[msg.sender], "Not authorized");
        require(newPrice > 0, "Price must be positive");
        
        _carbonCreditPrice = newPrice;
        _lastUpdateTime = block.timestamp;
        
        emit PriceUpdated(newPrice, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Update emission factor for a region (only data feeders)
     * @param region Region name
     * @param factor New emission factor (kgCO2/kWh * 10^6)
     * @return success True if update succeeded
     */
    function updateEmissionFactor(
        string memory region,
        uint256 factor
    ) external nonReentrant returns (bool) {
        require(_dataFeeders[msg.sender], "Not authorized");
        require(bytes(region).length > 0, "Region required");
        require(factor > 0, "Factor must be positive");
        
        _emissionFactors[region] = factor;
        
        emit EmissionFactorUpdated(region, factor, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Calculate CO2 emissions for energy usage
     * @param energyUsage Energy consumed in kWh (wei, 18 decimals)
     * @param region Region name for emission factor
     * @return emissions Total CO2 emissions in kg (wei, 18 decimals)
     */
    function calculateEmissions(
        uint256 energyUsage,
        string memory region
    ) external view returns (uint256) {
        require(energyUsage > 0, "Energy usage must be positive");
        
        uint256 factor = _emissionFactors[region];
        
        // Use global average if region not found
        if (factor == 0) {
            factor = _emissionFactors["Global"];
        }
        
        // Calculate: (energyUsage * factor) / 10^6
        // energyUsage is in wei (10^18), factor is scaled by 10^6
        // Result is in wei (10^18) representing kg CO2
        return (energyUsage * factor) / 10**6;
    }
    
    /**
     * @dev Calculate cost for carbon credits
     * @param credits Number of carbon credits (in wei, 18 decimals)
     * @return cost Total cost in wei
     */
    function calculateCost(uint256 credits) external view returns (uint256) {
        require(credits > 0, "Credits must be positive");
        
        // Both are in wei (10^18), so divide by 10^18 to get actual cost
        return (credits * _carbonCreditPrice) / 10**18;
    }
    
    /**
     * @dev Add a data feeder (only owner)
     * @param feeder Address to authorize
     */
    function addDataFeeder(address feeder) external onlyOwner {
        require(feeder != address(0), "Invalid address");
        require(!_dataFeeders[feeder], "Already a feeder");
        
        _dataFeeders[feeder] = true;
        emit DataFeederAdded(feeder);
    }
    
    /**
     * @dev Remove a data feeder (only owner)
     * @param feeder Address to revoke
     */
    function removeDataFeeder(address feeder) external onlyOwner {
        require(_dataFeeders[feeder], "Not a feeder");
        
        _dataFeeders[feeder] = false;
        emit DataFeederRemoved(feeder);
    }
    
    /**
     * @dev Check if address is a data feeder
     * @param feeder Address to check
     * @return isFeeder True if authorized
     */
    function isDataFeeder(address feeder) external view returns (bool) {
        return _dataFeeders[feeder];
    }
    
    /**
     * @dev Batch update multiple emission factors (gas optimization)
     * @param regions Array of region names
     * @param factors Array of emission factors
     */
    function batchUpdateEmissionFactors(
        string[] memory regions,
        uint256[] memory factors
    ) external nonReentrant {
        require(_dataFeeders[msg.sender], "Not authorized");
        require(regions.length == factors.length, "Array length mismatch");
        require(regions.length > 0, "Empty arrays");
        
        for (uint256 i = 0; i < regions.length; i++) {
            require(bytes(regions[i]).length > 0, "Invalid region");
            require(factors[i] > 0, "Invalid factor");
            
            _emissionFactors[regions[i]] = factors[i];
            emit EmissionFactorUpdated(regions[i], factors[i], block.timestamp);
        }
    }
}
