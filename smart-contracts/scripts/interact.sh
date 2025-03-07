#!/bin/bash

# Create a new task
echo "Creating task..."

export DIAMOND_ADDRESS=0x64942Ac86b6B87Eb5BD14B9023F554746eF7639b
export OPERATOR_POOL_ADDRESS=0x06e61ef8bbCE4A485F0BDf9E188669Ff97691612
export USER_ADDRESS=0xb9Ae7e3763E55011C4409c790a279C82C74F087D
export OPERATOR_ADDRESS=0xC76e0a2Cdc9d8748fD312b719af13bCaC57d145E
export RPC_URL=https://testnet-rpc.monad.xyz
export TASK_NAME="monad test"
export VAULT_ID=$(cast keccak "123")
export SCHEMA_ID="schemav2"
export RECORD_ID="recordv1"

# cast send $DIAMOND_ADDRESS \
#   "createTask(string,address)(bytes32)" \
#   "$TASK_NAME" \
#   "$USER_ADDRESS" \
#   --rpc-url $RPC_URL \
#   --private-key $PRIVATE_OPERATOR_KEY

# cast call $DIAMOND_ADDRESS \
#     "getOperatorPool()" \
#     --rpc-url $RPC_URL

# cast send $DIAMOND_ADDRESS \
#   "setOperatorPool(address)" \
#   "$OPERATOR_POOL_ADDRESS" \
#   --rpc-url $RPC_URL \
#   --private-key $PRIVATE_KEY

# cast send $OPERATOR_POOL_ADDRESS \
#     "whitelistOperator(address)" \
#     "$OPERATOR_ADDRESS" \
#     --rpc-url $RPC_URL \
#     --private-key $PRIVATE_KEY

cast send $DIAMOND_ADDRESS \
  "updateVault(bytes32,string,string)" \
  "$VAULT_ID" \
  "$SCHEMA_ID" \
  "$RECORD_ID" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_OPERATOR_KEY

# # cast storage $OPERATOR_POOL_ADDRESS 3 \
# #      --rpc-url $RPC_URL



# echo 
# # Extract task ID from transaction receipt
# TASK_ID=$(cast receipt $TASK_TX --rpc-url $RPC_URL --json | jq -r '.logs[0].topics[1]')
# echo "Task created with ID: $TASK_ID"
