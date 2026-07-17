#!/bin/bash
# Deactivate MCP server after use
# Usage: ./deactivate_mcp.sh <server-name>

SERVER=$1
CONFIG=~/.openclaw/openclaw.json

if [ -z "$SERVER" ]; then
  echo "❌ Usage: $0 <server-name>"
  exit 1
fi

# Disable server
echo "🔄 Deactivating $SERVER..."
jq ".mcp.servers.\"$SERVER\".enabled = false" "$CONFIG" > tmp.json
mv tmp.json "$CONFIG"

# Reload
echo "🔄 Reloading MCP config..."
openclaw mcp reload

echo "✅ $SERVER deactivated (0 tokens in future requests)"
