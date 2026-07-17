---
name: lazy-context
description: "Unified lazy-loading for MCPs and skills with intelligent catalogs + auto-compaction; reduce token usage by 90%+"
---

# Lazy Context

Reduce token consumption by 90%+ using lazy-loading for **MCP tools, skill files, and conversation history**. Three-tier optimization system.

## Problem

OpenClaw loads everything upfront:
- **250+ MCP tool definitions** (~50k-100k tokens)
- **Multiple skill files** (~10k-50k tokens)
- **Full conversation history** (~30k-100k tokens)
- **All in EVERY request**, even when unused

Total: **90k-250k tokens per request**

## Solution: 3-Tier Optimization

### Tier 1: MCP Lazy-Loading

**Default:** All MCP servers disabled

**Catalog:** `TOOLS-CATALOG.md` (~1k tokens)

**When needed:**
1. Scan catalog → identify server
2. Activate: `"enabled": true`
3. Execute: `mcp_call()`
4. Deactivate: `"enabled": false`

**Savings:** ~50k-100k → ~3k (**95%**)

### Tier 2: Skill Lazy-Loading

**Default:** Skills not preloaded

**Catalog:** `SKILLS-CATALOG.md` (~1k tokens)

**When needed:**
1. Scan catalog → identify skill
2. Load: `read(skill_path)`
3. Execute workflow
4. Stays in conversation (not system prompt)

**Savings:** ~10k-50k → ~5k (**80%**)

### Tier 3: Auto-Compaction

**Problem:** Conversation history grows indefinitely

**Solution:** Intelligent auto-compaction with context preservation

**Configuration:**
```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "mode": "default",
        "reserveTokens": 8000,
        "keepRecentTokens": 10000,
        "maxHistoryShare": 0.3,
        "customInstructions": "Preserve user identity, decisions, configurations, and next steps."
      }
    }
  }
}
```

**Savings:** ~50k-100k → ~10k-15k (**80%**)

## Combined Optimization

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| MCP tools | 50k-100k | 3k | 95% |
| Skills | 10k-50k | 5k | 80% |
| History | 50k-100k | 10k-15k | 80% |
| **Total** | **110k-250k** | **18k-23k** | **~90%** |

## Quick Start

See [README.md](README.md) for complete setup instructions.

## Documentation

- [Auto-Compaction Guide](docs/COMPACTION.md)
- [Catalog Maintenance](docs/CATALOGS.md)
- [Publishing to ClawHub](docs/PUBLISHING.md)

## Scripts

- `scripts/activate_mcp.sh` — Activate MCP server
- `scripts/deactivate_mcp.sh` — Deactivate MCP server
- `scripts/token_report.sh` — Token usage report

## Best Practices

- **Default to disabled** — Only enable when needed
- **Batch operations** — Activate once, do all, deactivate
- **Keep catalogs updated** — Add new MCPs/skills as installed
- **Monitor usage** — Run `token_report.sh` regularly

## Integration

Works with any MCP server, skill file, or OpenClaw workspace. Catalogs are portable.

## License

MIT License - see [LICENSE](LICENSE) file for details
