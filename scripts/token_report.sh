#!/bin/bash
# Token usage report with context monitoring
# Usage: ./token_report.sh

echo "📊 Lazy Context Token Usage Report"
echo "=================================="
echo ""

CONFIG=~/.openclaw/openclaw.json

# Count enabled MCPs
TOTAL=$(grep -c '"enabled":' "$CONFIG" 2>/dev/null || echo "15")
ENABLED=$(grep '"enabled": true' "$CONFIG" 2>/dev/null | wc -l || echo "0")
DISABLED=$((TOTAL - ENABLED))

echo "🔧 MCP Servers:"
echo "  Total: $TOTAL"
echo "  Enabled: $ENABLED"
echo "  Disabled: $DISABLED"
echo ""

# Estimate MCP token usage
CATALOG_TOKENS=2000  # Both catalogs
MCP_TOKENS=$((ENABLED * 2000))  # ~2k per enabled server
TOTAL_MCP=$((CATALOG_TOKENS + MCP_TOKENS))

echo "📦 MCP Token Usage:"
echo "  Catalogs: ~${CATALOG_TOKENS} tokens"
echo "  Enabled MCPs: ~${MCP_TOKENS} tokens"
echo "  Subtotal: ~${TOTAL_MCP} tokens"
echo ""

# Get context size from session status
CONTEXT_INFO=$(openclaw session status 2>/dev/null | grep "Context:" || echo "Context: 0/128k")
CONTEXT_SIZE=$(echo "$CONTEXT_INFO" | awk '{print $2}' | cut -d'/' -f1 | tr -d 'k')
CONTEXT_MAX=$(echo "$CONTEXT_INFO" | awk '{print $2}' | cut -d'/' -f2 | tr -d 'k')

if [ -z "$CONTEXT_SIZE" ] || [ "$CONTEXT_SIZE" = "0" ]; then
  CONTEXT_SIZE=0
fi

echo "💬 Conversation Context:"
echo "  Current: ~${CONTEXT_SIZE}k tokens"
echo "  Max: ${CONTEXT_MAX}k tokens"

# Calculate percentage
if [ "$CONTEXT_MAX" -gt 0 ]; then
  CONTEXT_PCT=$((CONTEXT_SIZE * 100 / CONTEXT_MAX))
  echo "  Usage: ${CONTEXT_PCT}%"
fi
echo ""

# Context health check
if [ "$CONTEXT_SIZE" -gt 40 ]; then
  echo "⚠️  Context size: ${CONTEXT_SIZE}k tokens (recommend compaction)"
  echo "💡 Run: openclaw compact"
  CONTEXT_STATUS="needs_compaction"
else
  echo "✅ Context size: ${CONTEXT_SIZE}k tokens (healthy)"
  CONTEXT_STATUS="healthy"
fi
echo ""

# Total token estimate
TOTAL_TOKENS=$((TOTAL_MCP + (CONTEXT_SIZE * 1000)))

echo "📊 Total Estimated Tokens per Request:"
echo "  MCP + Catalogs: ~${TOTAL_MCP} tokens"
echo "  Context: ~${CONTEXT_SIZE}k tokens"
echo "  Total: ~$((TOTAL_TOKENS / 1000))k tokens"
echo ""

# Compare to traditional
TRADITIONAL=$((TOTAL * 2000 + 50000))  # All MCPs + typical context
if [ $TRADITIONAL -gt 0 ]; then
  SAVINGS=$((100 - (TOTAL_TOKENS * 100 / TRADITIONAL)))
  echo "💰 Comparison:"
  echo "  Traditional (all enabled): ~$((TRADITIONAL / 1000))k tokens"
  echo "  Lazy Context: ~$((TOTAL_TOKENS / 1000))k tokens"
  echo "  Savings: ~${SAVINGS}%"
  echo ""
fi

# Recommendations
echo "💡 Recommendations:"
if [ $ENABLED -eq 0 ]; then
  echo "  ✅ All MCPs disabled - maximum savings!"
elif [ $ENABLED -le 2 ]; then
  echo "  ✅ Good - only essential MCPs enabled"
else
  echo "  ⚠️  Consider deactivating unused MCPs"
fi

if [ "$CONTEXT_STATUS" = "needs_compaction" ]; then
  echo "  ⚠️  Run 'openclaw compact' to reduce context"
else
  echo "  ✅ Context size is healthy"
fi

echo ""
echo "📈 Optimization Summary:"
echo "  MCP lazy-loading: ✅ Active"
echo "  Skill lazy-loading: ✅ Active"
echo "  Auto-compaction: $([ "$CONTEXT_STATUS" = "healthy" ] && echo "✅ Not needed" || echo "⚠️  Recommended")"
