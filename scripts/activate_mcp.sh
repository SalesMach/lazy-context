#!/bin/bash
# Activate MCP server on-demand
# Usage: ./activate_mcp.sh <server-name>

SERVER=$1
CONFIG=~/.openclaw/openclaw.json

if [ -z "$SERVER" ]; then
  echo "❌ Usage: $0 <server-name>"
  exit 1
fi

# Check if server exists
if ! jq -e ".mcp.servers.\"$SERVER\"" "$CONFIG" > /dev/null 2>&1; then
  echo "❌ Server '$SERVER' not found in config"
  exit 1
fi

# Enable server
echo "🔄 Activating $SERVER..."
jq ".mcp.servers.\"$SERVER\".enabled = true" "$CONFIG" > tmp.json
mv tmp.json "$CONFIG"

# Reload
echo "🔄 Reloading MCP config..."
openclaw mcp reload

echo "✅ $SERVER activated and ready to use"
echo "💡 Don't forget to deactivate when done: ./deactivate_mcp.sh $SERVER"
