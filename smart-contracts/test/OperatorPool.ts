import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { viem } from "hardhat";
import { getAddress } from "viem";

describe("OperatorPool", function () {
  async function deployFixture() {
    const [admin, operator, nonoperator] = await viem.getWalletClients();
    const operatorPool = await viem.deployContract("OperatorPool",[], {account: admin.account});
    return {
      admin,
      nonoperator,
      operator,
      operatorPool
    };
  }

  it("Should allow admin to whitelist operator", async function () {
    const { admin, operator, operatorPool } = await loadFixture(deployFixture);
    
    await operatorPool.write.whitelistOperator([operator.account.address], {account: admin.account});
    
    const op = await operatorPool.read.operators([
      operator.account.address
    ]);
    
    expect(op[0]).to.equal("");
  });

  it("Should allow whitelisted operators to register", async function () {
    const { admin, operator, operatorPool } = await loadFixture(deployFixture);
    
    await operatorPool.write.whitelistOperator([operator.account.address], {account: admin.account});
    await operatorPool.write.registerOperator([
      "Op1",
      "Test Operator",
      getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
      "logo.png"
    ], {account: operator.account});
    
    const op = await operatorPool.read.operators([
      operator.account.address
    ]);
    
    expect(op[0]).to.equal("Op1");
  });

  it("Should prevent registering from non-operators", async function () {
    const { operatorPool, nonoperator } = await loadFixture(deployFixture);
    
    await expect(
      operatorPool.write.registerOperator([
        "Op1",
        "Test",
        getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
        "logo.png"
      ], { account: nonoperator.account })
    ).to.be.rejectedWith("AccessControlUnauthorizedAccount");
  });

  it("Should allow operator updates", async function () {
    const { admin, operator, operatorPool } = await loadFixture(deployFixture);
    
    await operatorPool.write.whitelistOperator([operator.account.address], {account: admin.account});
    await operatorPool.write.registerOperator([
      "Op1",
      "Test Operator",
      getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
      "logo.png"
    ], {account: operator.account});

    await operatorPool.write.updateOperator([
      "Op2",
      "Test Operator",
      getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
      "logo.png"
    ], {account: operator.account});
    
    const op = await operatorPool.read.operators([
      operator.account.address
    ]);
    
    expect(op[0]).to.equal("Op2");
    
  });
});