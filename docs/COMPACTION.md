# Auto-Compaction Guide

OpenClaw's auto-compaction feature intelligently reduces conversation history while preserving essential context.

## How It Works

### Trigger

Compaction runs automatically when:
- Context size exceeds threshold (~40k tokens)
- Message count exceeds limit (~50 messages)
- Session duration exceeds time limit (~2 hours)

### Process

1. **Preserve recent messages** (last 10, ~10k tokens)
2. **Summarize older messages** using AI
3. **Keep essential information:**
   - User identity and preferences
   - Decisions made
   - Configurations applied
   - Next steps and pending tasks
4. **Remove verbose content:**
   - Long explanations
   - Redundant confirmations
   - Old tool outputs
   - Intermediate discussions

## Configuration

Edit `~/.openclaw/openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "mode": "default",
        "reserveTokens": 8000,
        "keepRecentTokens": 10000,
        "maxHistoryShare": 0.3,
        "customInstructions": "Preserve user identity, decisions, configurations, and next steps. Remove verbose explanations and old tool outputs."
      }
    }
  }
}
```

### Parameters

| Parameter | Description | Default | Recommended |
|-----------|-------------|---------|-------------|
| `mode` | Compaction strategy | `default` | `default` |
| `reserveTokens` | Tokens reserved for reply | 8000 | 8000 |
| `keepRecentTokens` | Recent messages to preserve | 10000 | 10000 |
| `maxHistoryShare` | Max fraction of context for history | 0.3 | 0.3 |
| `customInstructions` | What to preserve/remove | — | See above |

## What Gets Preserved

### Always Kept

✅ **User context**
- Name, preferences, timezone
- Project details
- Goals and objectives

✅ **Decisions**
- What was decided
- Why it was decided
- Alternatives considered

✅ **Configurations**
- Settings applied
- Files created
- Systems configured

✅ **Next steps**
- Pending tasks
- Planned work
- Open questions

✅ **Recent messages**
- Last 10 messages intact
- Immediate context preserved

### Safely Removed

❌ **Verbose explanations**
- Long technical details
- Redundant examples
- Repeated information

❌ **Old tool outputs**
- Command results
- API responses
- Debug logs

❌ **Intermediate discussions**
- Brainstorming
- Explored alternatives
- Superseded decisions

## Example

### Before Compaction (50k tokens)

```
[10:00] User: "How do I optimize tokens?"
[10:01] Agent: [Long explanation about token optimization]
[10:05] User: "What about MCPs?"
[10:06] Agent: [Long explanation about MCP lazy-loading]
[10:10] User: "Let's implement it"
[10:11] Agent: [Detailed implementation steps]
...
[14:00] User: "It's working!"
[14:01] Agent: "Great! Anything else?"
```

### After Compaction (10k tokens)

```
[Summary]
- Implemented lazy-loading for MCPs and skills
- Created TOOLS-CATALOG.md and SKILLS-CATALOG.md
- Disabled all 15 MCP servers (95% token reduction)
- Configured auto-compaction (preserve last 10 messages)
- Token usage: 80k → 14k per request (83% savings)

[Recent Messages]
[13:55] User: "Token report shows 83% savings!"
[14:00] User: "It's working!"
[14:01] Agent: "Great! Anything else?"
```

## Monitoring

Check context size:

```bash
openclaw session status | grep "Context:"
```

Run token report:

```bash
~/.openclaw/workspace/scripts/token_report.sh
```

## Manual Compaction

Force compaction (if needed):

```bash
# Not available via CLI, but auto-compaction handles it
# Adjust thresholds in config if needed
```

## Best Practices

1. **Set appropriate thresholds**
   - `keepRecentTokens: 10000` (last 10 messages)
   - `maxHistoryShare: 0.3` (30% of context for history)

2. **Write clear custom instructions**
   - Specify what to preserve
   - Specify what to remove

3. **Monitor regularly**
   - Run `token_report.sh`
   - Check context size

4. **Adjust as needed**
   - Lower thresholds if context grows too fast
   - Raise thresholds if losing too much context

## Troubleshooting

### Context Still Too Large

- Lower `maxHistoryShare` (e.g., 0.2)
- Lower `keepRecentTokens` (e.g., 8000)
- Check if MCPs are disabled

### Losing Too Much Context

- Raise `keepRecentTokens` (e.g., 15000)
- Raise `maxHistoryShare` (e.g., 0.4)
- Adjust `customInstructions` to preserve more

## Integration with Lazy Context

Auto-compaction is **Tier 3** of the Lazy Context system:

1. **Tier 1:** MCP lazy-loading (95% savings)
2. **Tier 2:** Skill lazy-loading (80% savings)
3. **Tier 3:** Auto-compaction (80% savings)

Combined: **~90% total savings**

## Credits

Part of the [Lazy Context](https://github.com/SalesMach/lazy-context) skill for OpenClaw.
