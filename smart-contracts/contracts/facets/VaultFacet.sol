// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../libraries/LibDiamond.sol";
import "../OperatorPool.sol";


contract VaultFacet {
    using LibDiamond for LibDiamond.DiamondStorage;

    modifier onlyActiveOperator(address operator) {
        require(
            OperatorPool(LibDiamond.diamondStorage().operatorPool).hasRole(
                keccak256("OPERATOR_ROLE"), 
                operator
            ),
            "Unauthorized operator"
        );
        _;
    }

    event VaultUpdated(bytes32 indexed vaultId, string schemaId, string recordId);

    function updateVault(bytes32 vaultId, string memory schemaId, string memory recordId) external onlyActiveOperator(msg.sender){
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.vaults[vaultId] = LibDiamond.Vault(
            vaultId,
            schemaId,
            recordId,
            block.timestamp,
            block.timestamp

        );
        
        emit VaultUpdated(vaultId, schemaId, recordId);
    }



    function getVault(bytes32 vaultId) external view returns (
        bytes32 id,
        string memory schemaId,
        string memory recordId,
        uint256 createdAt,
        uint256 updatedAt
    ) {
            LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
            LibDiamond.Vault memory vault = ds.vaults[vaultId];

            return (
                vault.id,
                vault.schemaId,
                vault.recordId,
                vault.createdAt,
                vault.updatedAt
            );
    }
}