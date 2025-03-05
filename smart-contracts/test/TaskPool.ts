import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { viem } from "hardhat";
import { expect } from "chai";


import { IDiamondCut } from "../contracts/interfaces"; // Generated type
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";
import { encodeFunctionData, keccak256 } from "viem";

describe("TaskPool Diamond", function () {
  async function deployDiamondFixture() {
    const [owner, user, operator] = await viem.getWalletClients();

    // Deploy core contracts with explicit types
    const operatorPool = await viem.deployContract("OperatorPool", [], { account: owner.account });
    const diamond = await viem.deployContract("Diamond", [owner.account.address]);

    // Get Diamond contract with correct ABI
    const diamondCut = await viem.getContractAt<IDiamondCut>("IDiamondCut", diamond.address);

    // Deploy facets
    const taskFacet = await viem.deployContract("TaskFacet");
    const vaultFacet = await viem.deployContract("VaultFacet");
    const adminFacet = await viem.deployContract("AdminFacet");
    const loupeFacet = await viem.deployContract("LoupeFacet");

    // Prepare facet cuts
    const cuts = [
      {
        facetAddress: taskFacet.address,
        functionSelectors: [
          "0x71a244b3", // createTask(string, address)
          "0x50784976",  // completeTask(address)
          "0x019f232a"   //readTask(address)
        ]
      },
      {
        facetAddress: vaultFacet.address,
        action: 0,
        functionSelectors: [
          "0x0cdcfbce", // updateVault(bytes32,bytes32,bytes32)
          "0xb7c61f06"  // getVault(bytes32)
        ]
      },
      {
        facetAddress: adminFacet.address,
        action: 0,
        functionSelectors: [
          "0xbea3127b", // setOperatorPool(address)
          "0x8456cb59", // pause()
          "0x3f4ba83a"  // unpause()
        ]
      },
      {
        facetAddress: loupeFacet.address,
        action: 0,
        functionSelectors: [
          "0x7a0ed627", // facets()
          "0xadfca15e", // facetFunctionSelectors(address)
          "0x52ef6b2c", // facetAddresses()
          "0xcdffacc6"  // facetAddress(bytes4)
        ]
      }
    ].map(c => ({
      facetAddress: c.facetAddress,
      action: c.action, // Add action
      functionSelectors: c.functionSelectors
    }));


    const initData = encodeFunctionData({
      abi: adminFacet.abi,
      functionName: 'initialize',
      args: [owner.account.address]
    })
    // Perform diamondCut
    await diamondCut.write.diamondCut([
      cuts,
      adminFacet.address,
      initData // Initialize using AdminFacet's address
    ]);

    // Initialize
    const taskPool = await viem.getContractAt("TaskFacet", diamond.address);
    const admin = await viem.getContractAt("AdminFacet", diamond.address);
    await admin.write.setOperatorPool([operatorPool.address]);
    await operatorPool.write.whitelistOperator([operator.account.address], { account: owner.account });


    return {
      owner,
      user,
      operator,
      diamond: diamondCut,
      operatorPool,
      taskPool
    };
  }

  it("Should enforce single active task per user", async function () {
    const { user, taskPool, operator } = await loadFixture(deployDiamondFixture);

    const taskId = await taskPool.write.createTask(["Test Task", user.account.address], { account: operator.account });
    const task = await taskPool.read.getTask([user.account.address], { account: operator.account });


    expect(taskId).to.not.be.undefined

    expect(
      task[0]
    ).to.equal("Test Task")

    await expect(
      taskPool.write.createTask(["Second Task", user.account.address], { account: operator.account })
    ).to.be.rejectedWith("Active task exists");
  });

  it("Should allow operators to complete task", async function () {
    const { user, taskPool, operator } = await loadFixture(deployDiamondFixture);
    await taskPool.write.createTask(["Test Task", user.account.address], { account: operator.account });


    await expect(
      taskPool.write.completeTask([user.account.address], { account: operator.account })
    ).to.not.be.rejectedWith("")
  });

  it("Should allow operators to update task vault data", async function () {
    const { user, taskPool, operator, diamond } = await loadFixture(deployDiamondFixture);
    const taskId = await taskPool.write.createTask(["Test Task", user.account.address], { account: operator.account });

    const vault = await viem.getContractAt("VaultFacet", diamond.address)
    await vault.write.updateVault([taskId, keccak256("0x1"), keccak256("0xtest")], { account: operator.account })
    const nvault = await vault.read.getVault([taskId])
    expect(nvault[0]).to.equal(keccak256("0x1"))


  });


  it("Should validate Diamond Loupe functions", async function () {
    const { diamond } = await loadFixture(deployDiamondFixture);
    const loupe = await viem.getContractAt("LoupeFacet", diamond.address)
    const facets = await loupe.read.facets()
    expect(facets.length).to.equal(4);
  });
});