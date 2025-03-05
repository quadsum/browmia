// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";


library LibDiamond {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");

    struct FacetAddressAndPosition {
        address facetAddress;
        uint96 functionSelectorPosition;
    }

    struct FacetFunctionSelectors {
        bytes4[] functionSelectors;
        uint256 facetAddressPosition;
    }

struct DiamondStorage {
    // Existing Diamond management fields
    mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
    mapping(address => FacetFunctionSelectors) facetFunctionSelectors;
    address[] facetAddresses;
    address contractOwner;

    // Task-related storage
    mapping(address => bytes32) userActiveTasks;
    mapping(bytes32 => Task) tasks;
    mapping(bytes32 => Vault) vaults;
    mapping(address => uint256) operatorTaskCount;
    address operatorPool;
    uint256 taskCounter;
}

struct Task {
    string name;
    address user;
    uint256 createdAt;
    uint256 updatedAt;
    Status status;
    address operator;
}

struct Vault {
    bytes32 id;
    bytes32 schemaId;
    bytes32 recordId;
    uint256 createdAt;
    uint256 updatedAt;
}

enum Status { Pending, Assigned, Completed }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function setContractOwner(address _newOwner) internal {
        DiamondStorage storage ds = diamondStorage();
        ds.contractOwner = _newOwner;
    }

    function contractOwner() internal view returns (address contractOwner_) {
        contractOwner_ = diamondStorage().contractOwner;
    }

function diamondCut(
    IDiamondCut.FacetCut[] memory _diamondCut,
    address _init,
    bytes memory _calldata
) internal {
    for (uint256 facetIndex; facetIndex < _diamondCut.length; facetIndex++) {
        IDiamondCut.FacetCutAction action = _diamondCut[facetIndex].action;
        address facetAddress = _diamondCut[facetIndex].facetAddress;
        bytes4[] memory functionSelectors = _diamondCut[facetIndex].functionSelectors;

        if (action == IDiamondCut.FacetCutAction.Add) {
            addFunctions(facetAddress, functionSelectors);

        } 
    }
    initializeDiamondCut(_init, _calldata);
}

function addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) private {
    DiamondStorage storage ds = diamondStorage();
    require(_facetAddress != address(0), "LibDiamondCut: Add facet can't be address(0)");
    ds.facetAddresses.push(_facetAddress);
    uint96 selectorPosition = uint96(ds.facetFunctionSelectors[_facetAddress].functionSelectors.length);
    
    for (uint256 selectorIndex; selectorIndex < _functionSelectors.length; selectorIndex++) {
        bytes4 selector = _functionSelectors[selectorIndex];
        address oldFacetAddress = ds.selectorToFacetAndPosition[selector].facetAddress;
        require(oldFacetAddress == address(0), "LibDiamondCut: Can't add function that already exists");
        
        ds.selectorToFacetAndPosition[selector] = FacetAddressAndPosition({
            facetAddress: _facetAddress,
            functionSelectorPosition: selectorPosition
        });
        ds.facetFunctionSelectors[_facetAddress].functionSelectors.push(selector);
        selectorPosition++;
    }
}
function initializeDiamondCut(address _init, bytes memory _calldata) internal {
    if (_init == address(0)) {
        return;
    }
    
    enforceHasContractCode(_init, "LibDiamondCut: _init address has no code");
    
    (bool success, bytes memory error) = _init.delegatecall(_calldata);
    if (!success) {
        if (error.length > 0) {
            revert(string(error));
        } else {
            revert("LibDiamondCut: _init function reverted");
        }
    }
}

// Add helper to check contract existence
function enforceHasContractCode(address _contract, string memory _errorMessage) internal view {
    uint256 contractSize;
    assembly {
        contractSize := extcodesize(_contract)
    }
    require(contractSize > 0, _errorMessage);
}
}