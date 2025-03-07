# Browmia encrypted storage plugin

## About

Simple Node.js utility for reading a file at path `TASK_DATA_PATH`, encrypting it using NilQL and storing the encrypted shares in Nillion SecretVault.

The program  syncs local to on chain states in a loop fashion. The SecretVault data receipts (`schemaId` and `recordId`) are stored into the `VaultFacet` contract, enabling to be later retrieved and decrypted by another user.

This plugin is currently meant to be run alongside Browmia infra on Monad testnet. You'll need a whitelisted Operator wallet with MON testnet funds.

## Installation

Git clone the main repo and cd to the folder:
```bash
git clone https://github.com/quadsum/browmia
cd operator/plugins/encrypt-storage

```

Install all dependencies and configure `.env` file.
```bash
yarn install
cp .env.example .env
```

## Running locally

Start up the program:
```bash
yarn start
```

## Running with Browmia

In a Node.js remote host environment, clone the app at `ENCRYPT_STORAGE_APP_PATH` and copy the `runit` folder into `/etc/runit/runsvdir/default`.

Take a look at `runit/encrypt-storage/run` file to have an idea of how the start up command looks like and prepare accordingly.

## Remote copy

If `COPY_VAULT_ID` is declared and exists, the program will initialize and copy the remote storage to the local storage and then, periodically sync data to the `VAULT_ID`.