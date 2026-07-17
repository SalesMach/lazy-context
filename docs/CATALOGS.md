# Catalog Maintenance Guide

Learn how to create and maintain effective catalogs for lazy-loading.

## Why Catalogs?

Catalogs are **compact, human-readable** references that:
- ✅ List all available MCP tools and skills
- ✅ Document when to use each one
- ✅ Provide activation keywords
- ✅ Estimate token costs
- ✅ Reduce context from 50k-100k → ~2k

## TOOLS-CATALOG.md

### Structure

```markdown
## server-name (Friendly Name)
**Status:** Disabled by default
**Activate when:** keyword1, keyword2, keyword3
**Token cost:** ~2k (6 tools)

- `tool_name_1` — What it does
- `tool_name_2` — What it does
- `tool_name_3` — What it does
```

### Example

```markdown
## hostinger-domains-ansuz (Domains - Ansuz Account)
**Status:** Disabled by default
**Activate when:** domínios, DNS, registro de domínio (conta Ansuz)
**Token cost:** ~2k (6 tools)

- `domains_getDomains` — List all registered domains
- `domains_getDomainDetails` — Get domain details (expiry, nameservers)
- `domains_checkAvailability` — Check if domain is available
- `domains_registerDomain` — Register new domain
- `domains_getDNSRecords` — Get DNS records for domain
- `domains_updateDNSRecords` — Update DNS records
```

### Tips

**Use descriptive keywords:**
- ✅ "domínios, DNS, registro" (Portuguese + English)
- ✅ "CRM, leads, deals, vendas"
- ❌ "server1, tools, stuff"

**Document token costs:**
- Small server (4-6 tools): ~2k
- Medium server (10-15 tools): ~3k
- Large server (20+ tools): ~5k

**Group related tools:**
```markdown
**User Management**
- `get_current_user` — Get authenticated user
- `list_users` — List all users

**CRM Items**
- `list_items` — List CRM items
- `create_item` — Create new item
```

## SKILLS-CATALOG.md

### Structure

```markdown
## skill-name
**Path:** `/path/to/skill/SKILL.md`
**Use when:** keyword1, keyword2, keyword3
**Token cost:** ~5k
**Description:** One-line summary
```

### Example

```markdown
## notion
**Path:** `/app/skills/notion/SKILL.md`
**Use when:** Notion pages, databases, files, comments, search
**Token cost:** ~3k
**Description:** Notion CLI/API for pages, Markdown, data sources, files
```

### Tips

**Use absolute paths:**
- ✅ `/app/skills/notion/SKILL.md`
- ✅ `~/.openclaw/plugin-skills/browser-automation/SKILL.md`
- ❌ `./skills/notion/SKILL.md`

**Estimate token costs:**
- Small skill (1-2k lines): ~2k
- Medium skill (3-5k lines): ~3k
- Large skill (5k+ lines): ~5k

**Write clear descriptions:**
- ✅ "Notion CLI/API for pages, Markdown, data sources, files"
- ❌ "Does Notion stuff"

## Adding New Entries

### When You Install a New MCP

1. **Get server name:**
   ```bash
   openclaw mcp list
   ```

2. **List tools:**
   ```bash
   openclaw mcp tools server-name
   ```

3. **Add to TOOLS-CATALOG.md:**
   ```markdown
   ## new-server (Friendly Name)
   **Status:** Disabled by default
   **Activate when:** relevant keywords
   **Token cost:** ~2k (X tools)

   - `tool_1` — Description
   - `tool_2` — Description
   ```

4. **Disable server:**
   ```json
   "new-server": {
     "enabled": false,
     ...
   }
   ```

### When You Install a New Skill

1. **Get skill path:**
   ```bash
   openclaw skills list
   ```

2. **Add to SKILLS-CATALOG.md:**
   ```markdown
   ## new-skill
   **Path:** `/path/to/new-skill/SKILL.md`
   **Use when:** relevant keywords
   **Token cost:** ~3k
   **Description:** What it does
   ```

## Maintaining Catalogs

### Regular Updates

**Weekly:**
- Review installed MCPs: `openclaw mcp list`
- Review installed skills: `openclaw skills list`
- Update catalogs with new entries

**Monthly:**
- Remove unused MCPs/skills
- Update token cost estimates
- Refine keywords based on usage

### Version Control

Track changes:

```bash
cd ~/.openclaw/workspace
git add TOOLS-CATALOG.md SKILLS-CATALOG.md
git commit -m "Update catalogs: added new-server, new-skill"
```

## Best Practices

### Keywords

**Use multiple languages:**
```markdown
**Activate when:** domínios, domains, DNS, registro, registration
```

**Include synonyms:**
```markdown
**Activate when:** CRM, leads, deals, contatos, contacts, vendas, sales
```

**Be specific:**
```markdown
**Activate when:** VPS, servidores virtuais, backups (conta Ansuz)
```

### Token Costs

**Measure actual costs:**
```bash
# Enable server
./activate_mcp.sh server-name

# Check context size
openclaw session status | grep "Context:"

# Note the increase
# Update catalog with actual cost
```

### Organization

**Group by account/project:**
```markdown
## hostinger-domains-ansuz (Ansuz Account)
...

## hostinger-domains (Gustavo Account)
...
```

**Group by category:**
```markdown
## CRM Tools
### bitrix24
...

## Hosting Tools
### hostinger-hosting-ansuz
...
```

## Portability

Catalogs are **portable** across workspaces:

```bash
# Copy to new workspace
cp TOOLS-CATALOG.md /path/to/new/workspace/
cp SKILLS-CATALOG.md /path/to/new/workspace/

# Adapt to new environment
# Update paths, server names, etc.
```

## Examples

See `examples/` directory for:
- Complete TOOLS-CATALOG.md
- Complete SKILLS-CATALOG.md
- Example configurations

## Credits

Part of the [Lazy Context](https://github.com/SalesMach/lazy-context) skill for OpenClaw.
