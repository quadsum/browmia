import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import { encodeFunctionData } from "viem";

const browmiaModule = buildModule("Browmia", (m) => {
  const owner = m.getParameter("owner", "0xb9Ae7e3763E55011C4409c790a279C82C74F087D")
  const operatorPool = m.contract("OperatorPool");
  
  const taskFacet = m.contract("TaskFacet");
  const vaultFacet = m.contract("VaultFacet");
  const adminFacet = m.contract("AdminFacet");
  const loupeFacet = m.contract("LoupeFacet");
  
  const diamond = m.contract("Diamond", [m.getAccount(0)]);
  
  const facets = [
    {
      facet: taskFacet,
      functionSelectors: [
        "0x71a244b3", // createTask(string, address)
        "0x50784976",  // completeTask(address)
        "0x019f232a"   //readTask(address)
      ]
    },
    {
      facet: vaultFacet,
      functionSelectors: [
        "0xf2b1dd57", // updateVault(bytes32,string,string)
        "0xb7c61f06"  // getVault(bytes32)
      ]
    },
    {
      facet: adminFacet,
      functionSelectors: [
        "0xbea3127b", // setOperatorPool(address)
        "0x6e314980",// getOperatorPool()
        "0xc4d66de8", // initialize(address)
        "0x8456cb59", // pause()
        "0x3f4ba83a"  // unpause()
      ]
    },
    {
      facet: loupeFacet,
      functionSelectors: [
        "0x7a0ed627", // facets()
        "0xadfca15e", // facetFunctionSelectors(address)
        "0x52ef6b2c", // facetAddresses()
        "0xcdffacc6"  // facetAddress(bytes4)
      ]
    }
  ]

  const diamondCut = facets.map((f) => ({
    facetAddress: f.facet,
    action: 0, //add
    functionSelectors: f.functionSelectors
  }));

  const initData = encodeFunctionData({
    abi: [{ 
      inputs: [{ name: "owner", type: "address" }],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }],
    functionName: 'initialize',
    args: [owner.defaultValue!]

  })

  m.call(diamond, "diamondCut", [
    diamondCut,
    adminFacet,
    initData
  ]);
  
  //m.call(adminFacet, "setOperatorPool", [operatorPool]);
  
  return { diamond, operatorPool };
});

export default browmiaModule