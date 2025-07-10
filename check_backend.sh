#!/bin/bash

echo "🔍 Checking ICP-DAPP Backend Status..."
echo "=================================="

# Check if dfx is running
echo "1. Checking dfx network..."
if dfx ping > /dev/null 2>&1; then
    echo "✅ DFX network is running"
else
    echo "❌ DFX network is not running"
    echo "   Run: dfx start --background"
    exit 1
fi

# Check backend canister status
echo ""
echo "2. Checking backend canister..."
if dfx canister status my_dapp_backend > /dev/null 2>&1; then
    echo "✅ Backend canister is running"
    echo "   Canister ID: $(dfx canister id my_dapp_backend)"
else
    echo "❌ Backend canister is not running"
    echo "   Run: dfx deploy my_dapp_backend"
    exit 1
fi

# Test backend call
echo ""
echo "3. Testing backend call..."
if dfx canister call my_dapp_backend get_all_products > /dev/null 2>&1; then
    echo "✅ Backend is responding to calls"
else
    echo "⚠️  Backend might have issues, but canister is running"
fi

echo ""
echo "🎉 Backend Status Check Complete!"
echo "=================================="
echo "Your backend canister ID is: $(dfx canister id my_dapp_backend)"
echo "Update this in your frontend if needed." 