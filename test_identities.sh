#!/bin/bash

# Supply Chain DApp - Identity Testing Script
echo "🚀 Supply Chain DApp - Identity Testing Setup"
echo "=============================================="

# Function to create identity if it doesn't exist
create_identity() {
    local identity_name=$1
    if ! dfx identity list | grep -q "$identity_name"; then
        echo "Creating identity: $identity_name"
        dfx identity new "$identity_name" --disable-encryption
    else
        echo "Identity $identity_name already exists"
    fi
}

# Function to get principal ID
get_principal() {
    local identity_name=$1
    local principal=$(dfx --identity "$identity_name" identity get-principal)
    echo "$identity_name Principal ID: $principal"
    return 0
}

# Create test identities
echo ""
echo "📝 Creating test identities..."
create_identity "manufacturer-test"
create_identity "distributor-test"
create_identity "retailer-test"
create_identity "customer-test"

echo ""
echo "🔑 Principal IDs for testing:"
echo "============================="
get_principal "manufacturer-test"
get_principal "distributor-test"
get_principal "retailer-test"
get_principal "customer-test"

echo ""
echo "📋 Testing Instructions:"
echo "======================="
echo "1. Start local network: dfx start --background"
echo "2. Deploy canisters: dfx deploy"
echo "3. Start frontend: cd src/my_dapp_frontend && npm run dev"
echo "4. Use different identities to test:"
echo "   - dfx identity use manufacturer-test"
echo "   - dfx identity use distributor-test"
echo "   - dfx identity use retailer-test"
echo "   - dfx identity use customer-test"
echo ""
echo "🎯 Test Flow:"
echo "============="
echo "1. Manufacturer: Create products"
echo "2. Distributor: Receive from manufacturer"
echo "3. Retailer: Receive from distributor"
echo "4. Customer: Purchase from retailer"
echo ""
echo "✅ Ready for testing!" 