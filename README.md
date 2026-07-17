# Lazy Context

**Reduce OpenClaw token consumption by 90%+** using intelligent lazy-loading for MCP tools, skill files, and conversation history.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.7.1-blue.svg)](https://github.com/openclaw/openclaw)

---

## 🎯 Problem

OpenClaw loads **everything** upfront in **every request**:

- 🔧 **250+ MCP tool definitions** (~50k-100k tokens)
- 📚 **Multiple skill files** (~10k-50k tokens)
- 💬 **Full conversation history** (~30k-100k tokens)

**Total: 90k-250k tokens per request** 🤯

Even when you're not using any tools or skills!

---

## ✅ Solution: 3-Tier Optimization

### Tier 1: MCP Lazy-Loading

**Default:** All MCP servers **disabled**

**Catalog:** `TOOLS-CATALOG.md` (~1k tokens)

**When needed:**
1. Scan catalog → identify server
2. Activate: `"enabled": true`
3. Execute: `mcp_call()`
4. Deactivate: `"enabled": false`

**Savings:** ~50k-100k → ~3k (**95%**)

---

### Tier 2: Skill Lazy-Loading

**Default:** Skills **not preloaded** in system prompt

**Catalog:** `SKILLS-CATALOG.md` (~1k tokens)

**When needed:**
1. Scan catalog → identify skill
2. Load: `read(skill_path)`
3. Execute workflow
4. Stays in conversation (not system prompt)

**Savings:** ~10k-50k → ~5k (**80%**)

---

### Tier 3: Auto-Compaction

**Problem:** Conversation history grows indefinitely

**Solution:** Intelligent auto-compaction with context preservation

**How it works:**
- Preserves last 10 messages (~10k tokens)
- Summarizes older messages
- Keeps decisions, configs, next steps
- Removes verbose explanations

**Savings:** ~50k-100k → ~10k-15k (**80%**)

---

## 📊 Combined Savings

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| 🔧 MCP tools | 50k-100k | 3k | **95%** |
| 📚 Skills | 10k-50k | 5k | **80%** |
| 💬 History | 50k-100k | 10k-15k | **80%** |
| **TOTAL** | **110k-250k** | **18k-23k** | **~90%** |

---

## 🚀 Quick Start

### 1. Install

```bash
# Clone this repository
git clone https://github.com/SalesMach/lazy-context.git
cd lazy-context

# Copy catalogs to your OpenClaw workspace
cp TOOLS-CATALOG.md ~/.openclaw/workspace/
cp SKILLS-CATALOG.md ~/.openclaw/workspace/

# Copy scripts
cp -r scripts ~/.openclaw/workspace/
chmod +x ~/.openclaw/workspace/scripts/*.sh
```

### 2. Configure Auto-Compaction

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

### 3. Disable All MCPs

Edit `~/.openclaw/openclaw.json`:

```json
{
  "mcp": {
    "servers": {
      "your-server": {
        "enabled": false,
        ...rest of config
      }
    }
  }
}
```

Reload:
```bash
openclaw mcp reload
```

### 4. Use Catalogs

When you need a tool or skill:

1. **Consult catalog:**
   ```bash
   cat ~/.openclaw/workspace/TOOLS-CATALOG.md
   ```

2. **Activate server:**
   ```bash
   ~/.openclaw/workspace/scripts/activate_mcp.sh server-name
   ```

3. **Use tool:**
   ```
   mcp_call(server="server-name", tool="tool-name", input={...})
   ```

4. **Deactivate (optional):**
   ```bash
   ~/.openclaw/workspace/scripts/deactivate_mcp.sh server-name
   ```

---

## 📁 Repository Structure

```
lazy-context/
├── README.md                 # This file
├── SKILL.md                  # OpenClaw skill definition
├── TOOLS-CATALOG.md          # MCP tools catalog template
├── SKILLS-CATALOG.md         # Skills catalog template
├── scripts/
│   ├── activate_mcp.sh       # Activate MCP server
│   ├── deactivate_mcp.sh     # Deactivate MCP server
│   └── token_report.sh       # Token usage report
├── examples/
│   ├── openclaw.json         # Example config with auto-compaction
│   └── catalog-example.md    # Example catalog entries
└── docs/
    ├── COMPACTION.md         # Auto-compaction guide
    ├── CATALOGS.md           # How to maintain catalogs
    └── PUBLISHING.md         # How to publish to ClawHub
```

---

## 🔧 Scripts

### `activate_mcp.sh`

Activate an MCP server on-demand:

```bash
./activate_mcp.sh hostinger-domains-ansuz
```

### `deactivate_mcp.sh`

Deactivate after use:

```bash
./deactivate_mcp.sh hostinger-domains-ansuz
```

### `token_report.sh`

Monitor token usage:

```bash
./token_report.sh
```

Output:
```
📊 Lazy Context Token Usage Report
==================================

🔧 MCP Servers:
  Total: 15
  Enabled: 0
  Disabled: 15

📦 MCP Token Usage:
  Catalogs: ~2000 tokens
  Enabled MCPs: ~0 tokens
  Subtotal: ~2000 tokens

💬 Conversation Context:
  Current: ~12k tokens
  Max: 128k tokens
  Usage: 9%

✅ Context size: 12k tokens (healthy)

📊 Total Estimated Tokens per Request:
  MCP + Catalogs: ~2000 tokens
  Context: ~12k tokens
  Total: ~14k tokens

💰 Comparison:
  Traditional (all enabled): ~80k tokens
  Lazy Context: ~14k tokens
  Savings: ~83%
```

---

## 📚 Catalogs

### TOOLS-CATALOG.md

Document all your MCP servers:

```markdown
## server-name (Friendly Name)
**Status:** Disabled by default
**Activate when:** keyword1, keyword2
**Token cost:** ~2k (6 tools)

- `tool_name_1` — What it does
- `tool_name_2` — What it does
```

### SKILLS-CATALOG.md

Document all your skills:

```markdown
## skill-name
**Path:** `/path/to/skill/SKILL.md`
**Use when:** keyword1, keyword2
**Token cost:** ~5k
**Description:** One-line summary
```

---

## 🎯 Best Practices

### Catalog Maintenance
- ✅ Update when adding MCPs/skills
- ✅ Use descriptive keywords
- ✅ Document token costs

### Activation Strategy
- ✅ Default to disabled
- ✅ Batch similar tasks
- ✅ Deactivate after use

### Compaction Strategy
- ✅ Compact at 40k tokens (threshold)
- ✅ Preserve last 10 messages
- ✅ Keep decisions and configs

### Monitoring
- ✅ Run `token_report.sh` regularly
- ✅ Check context size before/after
- ✅ Track savings over time

---

## 📖 Documentation

- [Auto-Compaction Guide](docs/COMPACTION.md)
- [Catalog Maintenance](docs/CATALOGS.md)
- [Publishing to ClawHub](docs/PUBLISHING.md)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Credits

Inspired by:
- [`openclaw-skill-lazy-loader`](https://clawhub.ai/asif2bd/skills/openclaw-skill-lazy-loader) — Catalog pattern
- [`token-optimization`](https://clawhub.ai/jack-yang-ai/skills/token-optimization) — Multi-tier optimization
- [`firm-skill-loader-pack`](https://clawhub.ai/firm/skills/firm-skill-loader-pack) — Keyword-based search

Unified and extended to cover **MCPs, skills, and history compaction**.

---

## 🔗 Links

- **OpenClaw:** https://github.com/openclaw/openclaw
- **ClawHub:** https://clawhub.ai
- **Documentation:** https://docs.openclaw.ai

---

## 📊 Real-World Results

Tested on production OpenClaw instance:

- **Before:** 80k-250k tokens per request
- **After:** 14k-23k tokens per request
- **Savings:** 83-91%
- **Cost reduction:** ~$0.50-1.50 per 100 requests

---

**Made with ❤️ by [Gustavo Reis](https://github.com/SalesMach)**
