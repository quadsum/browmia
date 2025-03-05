#!/bin/bash

# Create a new task
echo "Creating task..."

export DIAMOND_ADDRESS=0x47643bfFebFb50B352E3052edf0c937d14588955
export USER_ADDRESS=0xb9Ae7e3763E55011C4409c790a279C82C74F087D
export RPC_URL=https://testnet-rpc.monad.xyz
export TASK_NAME="monad test"
# cast send $DIAMOND_ADDRESS \
#   "createTask(string,address)(bytes32)" \
#   "$TASK_NAME" \
#   "$USER_ADDRESS" \
#   --rpc-url $RPC_URL \
#   --private-key $PRIVATE_KEY

# cast send $DIAMOND_ADDRESS \
#   "setOperatorPool(address)" \
#   "$USER_ADDRESS" \
#   --rpc-url $RPC_URL \
#   --private-key $PRIVATE_KEY

cast call $DIAMOND_ADDRESS \
    "getOperatorPool()" \
    --rpc-url $RPC_URL

# echo 
# # Extract task ID from transaction receipt
# TASK_ID=$(cast receipt $TASK_TX --rpc-url $RPC_URL --json | jq -r '.logs[0].topics[1]')
# echo "Task created with ID: $TASK_ID"
