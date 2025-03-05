# Browmia Smart Contracts

This repository contains the smart contracts for the **Browmia** project. The system consists of multiple facets (modular contracts) that work together to handle tasks, operators, and vaults.

---

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Running Tests](#running-tests)
4. [Deployment](#deployment)

---

## Overview

 **Diamond Standard (EIP-2535)** is used to create a modular and upgradeable smart contract architecture. The system consists of the following components:


- **Diamond.sol**: Diamond pattern proxy contract.
- **OperatorPool.sol**: Registers and manages operators who execute tasks.
- **TaskFacet.sol**: Manages tasks submitted by users.
- **VaultFacet.sol**: Stores encrypted data related to tasks.
- **AdminFacet.sol**: Manages OperatorPool admin tasks.
- **LoupeFacet.sol**: Provides facet insights to Loupe.



The system ensures:
- **Security**: Role-based access control, reentrancy guards, and pausable functionality.
- **Upgradeability**: Modular design using Diamond facets.
- **Efficiency**: Gas-optimized storage and function calls.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/quadsum/browmia.git
   cd smart-contracts
   ```

2. Install dependencies
    ```bash
    yarn install
    ```
3. Set up environment values
    ```bash
    cp .env.example .env
    ```
    Update the .env file with your values:
    ```
    PRIVATE_KEY=your_private_key
    ```
## Running tests

1. Start local hardhat node

```bash
npx hardhat node

```

2. Run tests

```bash
npx hardhat test --network localhost
```

## Deployment

### Deploy to localhost
Deploy the contracts to a local Hardhat node:

```bash
npx hardhat ignition deploy ./ignition/modules/Browmia.ts

```

Deploy to Monad testnet

```bash
npx hardhat ignition deploy ./ignition/modules/Browmia.ts --network monadTestnet
```




