import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

export default buildModule("BrowmiaUpgrade", (m) => {
    // const operatorPool = m.contract("OperatorPool");
    const taskFacet = m.contract("TaskFacet");
    const d = m.getParameter("diamond", "0x64942Ac86b6B87Eb5BD14B9023F554746eF7639b")
    //reuse existing diamond
    // const vaultFacet = m.contract("VaultFacet");
    // const adminFacet = m.contract("AdminFacet");
    // const loupeFacet = m.contract("LoupeFacet");
    const diamond = m.contractAt("Diamond",d.defaultValue! )
    console.log(diamond)
    const facets = [
      {
        facet: taskFacet,
        functionSelectors: [
          "0x71a244b3", // createTask(string, address)
          "0x50784976",  // completeTask(address)
          "0x019f232a"   //readTask(address)
        ]
      },
      
    ]
  
    const diamondCut = facets.map((f) => ({
      facetAddress: f.facet,
      action: 1, //replace
      functionSelectors: f.functionSelectors
    }));
  
    // const initData = encodeFunctionData({
    //   abi: [{ 
    //     inputs: [{ name: "owner", type: "address" }],
    //     name: "initialize",
    //     outputs: [],
    //     stateMutability: "nonpayable",
    //     type: "function"
    //   }],
    //   functionName: 'initialize',
    //   args: [owner.defaultValue!]
  
    // })
  
    //perform replacement of facets
    m.call(diamond, "diamondCut", [
      diamondCut,
      ethers.ZeroAddress,
      "0x"
    ]);
    
    //m.call(adminFacet, "setOperatorPool", [operatorPool]);
    
    return { diamond};
  });