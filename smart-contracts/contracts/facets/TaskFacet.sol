// contracts/facets/TaskFacet.sol
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "../libraries/LibDiamond.sol";
import "../OperatorPool.sol";

contract TaskFacet is ReentrancyGuardUpgradeable, PausableUpgradeable {
    using LibDiamond for LibDiamond.DiamondStorage;

    event TaskCreated(bytes32 indexed taskId, address indexed user, address indexed operator);
    event TaskCompleted(bytes32 indexed taskId, address indexed user, address indexed operator);

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

    /**
     * 
     * #dev. Function createTask() called by whitelisted operator
     */

    function createTask(string memory name, address user) external nonReentrant whenNotPaused onlyActiveOperator(msg.sender) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(ds.userActiveTasks[user] == bytes32(0), "Active task exists");
        
        bytes32 taskId = keccak256(abi.encodePacked(user, msg.sender, block.timestamp, ds.taskCounter++));
        ds.tasks[taskId] = LibDiamond.Task({
            name: name,
            user: user,
            operator: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            status: LibDiamond.Status.Pending
        });
        
        ds.userActiveTasks[user] = taskId;
        ds.operatorTaskCount[msg.sender]++;
        
        emit TaskCreated(taskId, user, msg.sender);

    }
function getTask(address user) external view returns (
    string memory name,
    address taskUser,
    address operator,
    uint256 createdAt,
    uint256 updatedAt,
    LibDiamond.Status status
) {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    bytes32 taskId = ds.userActiveTasks[user];
    require(taskId != bytes32(0), "Not active task");

    LibDiamond.Task memory task = ds.tasks[taskId];



    return (
        task.name,
        task.user,
        task.operator,
        task.createdAt,
        task.updatedAt,
        task.status
        );
}


    function completeTask(address user) external nonReentrant whenNotPaused onlyActiveOperator(msg.sender) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        bytes32 taskId = ds.userActiveTasks[user];
        require(taskId != 0, "No Active tasks found");
        require(ds.tasks[taskId].status == LibDiamond.Status.Pending, "Invalid status");
        require(msg.sender == ds.tasks[taskId].operator, "Unauthorized");

        ds.tasks[taskId].status = LibDiamond.Status.Completed;
        ds.tasks[taskId].updatedAt = block.timestamp;
        delete ds.userActiveTasks[ds.tasks[taskId].user];
        ds.operatorTaskCount[msg.sender]--;
        
        emit TaskCompleted(taskId, ds.tasks[taskId].user, msg.sender);
    }
}