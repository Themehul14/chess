#!/bin/bash
set -e

# Build the Move package
sui move build --path ../contracts

# Publish to testnet and capture package ID
PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --path ../contracts)
PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | grep -oE 'Package ID: [0-9a-fA-F]+' | awk '{print $3}')

echo "Published package ID: $PACKAGE_ID"
