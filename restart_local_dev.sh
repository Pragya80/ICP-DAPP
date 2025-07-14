#!/bin/bash

echo "🔄 Restarting Local Development Environment"
echo "=========================================="

# Stop any running dfx processes
echo "Stopping existing dfx processes..."
dfx stop 2>/dev/null || true
pkill -f dfx 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Clean up any existing state
echo "Cleaning up existing state..."
rm -rf .dfx/local 2>/dev/null || true

# Start dfx with proper configuration
echo "Starting dfx with proper configuration..."
dfx start --background --clean

# Wait for dfx to be ready
echo "Waiting for dfx to be ready..."
sleep 10

# Deploy canisters
echo "Deploying canisters..."
dfx deploy

# Generate declarations
echo "Generating declarations..."
dfx generate

echo ""
echo "✅ Local development environment restarted!"
echo ""
echo "Next steps:"
echo "1. Start the frontend: cd src/my_dapp_frontend && npm run dev"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Connect your wallet using IdentityKit"
echo ""
echo "If you still see time-related errors, try:"
echo "- Check your system clock is synchronized"
echo "- Restart your browser"
echo "- Clear browser cache and cookies" 