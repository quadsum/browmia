// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract OperatorPool is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    struct Operator {
        string name;
        address operatorAddress;
        string description;
        address withdrawAddress;
        string logoURL;
        bool active;
    }

    mapping(address => Operator) public operators;
    
    event OperatorRegistered(address indexed operator);
    event OperatorUpdated(address indexed operator);
    event OperatorRemoved(address indexed operator);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function whitelistOperator(address operatorAddress) external onlyRole(DEFAULT_ADMIN_ROLE){
        require(!operators[operatorAddress].active, "Operator exists");
        _grantRole(OPERATOR_ROLE, operatorAddress);
        operators[operatorAddress] = Operator(
            "",operatorAddress,"",address(0),"",true
        );

    }
    function registerOperator(
        string memory name,
        string memory description,
        address withdrawAddress,
        string memory logoURL
    ) external onlyRole(OPERATOR_ROLE) whenNotPaused nonReentrant {
        require(operators[msg.sender].active, "Operator not exists");
        operators[msg.sender] = Operator(
            name,
            msg.sender,
            description,
            withdrawAddress,
            logoURL,
            true
        );
        emit OperatorRegistered(msg.sender);
    }

    function updateOperator(
        string memory name,
        string memory description,
        address withdrawAddress,
        string memory logoURL
    ) external onlyRole(OPERATOR_ROLE) whenNotPaused nonReentrant {
        Operator storage op = operators[msg.sender];
        require(op.active, "Operator inactive");

        op.description = description;
        op.name = name;
        op.logoURL = logoURL;
        op.withdrawAddress = withdrawAddress;
        emit OperatorUpdated(msg.sender);
    }

    function removeOperator(address operatorAddress) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        whenNotPaused 
        nonReentrant 
    {
        require(operators[operatorAddress].active, "Operator inactive");
        delete operators[operatorAddress];
        _revokeRole(OPERATOR_ROLE, operatorAddress);
        emit OperatorRemoved(operatorAddress);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}