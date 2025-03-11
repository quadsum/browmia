// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../libraries/LibDiamond.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract AdminFacet is OwnableUpgradeable, PausableUpgradeable {
    event OperatorPoolUpdated(address operatorPool);

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __Pausable_init();
    }

    function setOperatorPool(address operatorPool) external onlyOwner {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.operatorPool = operatorPool;
        emit OperatorPoolUpdated(operatorPool);
    }

    function getOperatorPool() external view returns (address) {
        return LibDiamond.diamondStorage().operatorPool;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    

   
}