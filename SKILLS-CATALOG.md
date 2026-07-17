# Skills Catalog

**Purpose:** Lazy-load skill files on-demand to reduce token consumption

**How to use:**
1. Consult this catalog when user requests something
2. Read only the needed skill file with `read(path)`
3. Execute skill workflow
4. Skill content stays in conversation (not system prompt)

---

## Available Skills

### browser-automation
**Path:** `~/.openclaw/plugin-skills/browser-automation/SKILL.md`  
**Use when:** controlling web pages, multi-step flows, login checks, tab management  
**Token cost:** ~3k  
**Description:** Control web pages with OpenClaw browser tool, including stale ref recovery

---

### canvas
**Path:** `~/.openclaw/plugin-skills/canvas/SKILL.md`  
**Use when:** presenting HTML, navigate/eval/snapshot, debug canvas host URLs  
**Token cost:** ~2k  
**Description:** Present HTML on connected OpenClaw node canvases

---

### clawhub
**Path:** `/app/skills/clawhub/SKILL.md`  
**Use when:** searching skills, installing, verifying, publishing, syncing  
**Token cost:** ~2k  
**Description:** Search ClawHub for skills when capability not available

---

### diagram-maker
**Path:** `/app/skills/diagram-maker/SKILL.md`  
**Use when:** creating diagrams, architecture, flows, whiteboards  
**Token cost:** ~2k  
**Description:** Create SVG/HTML or Excalidraw diagrams

---

### healthcheck
**Path:** `/app/skills/healthcheck/SKILL.md`  
**Use when:** auditing OpenClaw hosts, SSH, firewall, updates, security  
**Token cost:** ~3k  
**Description:** Audit/harden OpenClaw hosts

---

### meme-maker
**Path:** `/app/skills/meme-maker/SKILL.md`  
**Use when:** searching meme templates, generating image memes  
**Token cost:** ~2k  
**Description:** Search meme templates and generate local/hosted memes

---

### node-connect
**Path:** `/app/skills/node-connect/SKILL.md`  
**Use when:** diagnosing node pairing, QR codes, connection failures  
**Token cost:** ~2k  
**Description:** Diagnose OpenClaw Android/iOS/macOS node connection issues

---

### node-inspect-debugger
**Path:** `/app/skills/node-inspect-debugger/SKILL.md`  
**Use when:** debugging Node.js, breakpoints, CDP, heap, CPU profiles  
**Token cost:** ~3k  
**Description:** Debug Node.js with node inspect and CDP

---

### notion
**Path:** `/app/skills/notion/SKILL.md`  
**Use when:** Notion pages, databases, files, comments, search  
**Token cost:** ~3k  
**Description:** Notion CLI/API for pages, Markdown, data sources, files

---

### python-debugpy
**Path:** `/app/skills/python-debugpy/SKILL.md`  
**Use when:** debugging Python, pdb, breakpoint(), post-mortem  
**Token cost:** ~2k  
**Description:** Debug Python with pdb and debugpy

---

### skill-creator
**Path:** `/app/skills/skill-creator/SKILL.md`  
**Use when:** creating, editing, auditing, validating skills  
**Token cost:** ~3k  
**Description:** Create, edit, audit, tidy, validate, or restructure AgentSkills

---

### spike
**Path:** `/app/skills/spike/SKILL.md`  
**Use when:** running throwaway prototypes, validating feasibility  
**Token cost:** ~2k  
**Description:** Run throwaway prototypes to validate approaches

---

### taskflow
**Path:** `/app/skills/taskflow/SKILL.md`  
**Use when:** coordinating multi-step detached tasks, durable jobs  
**Token cost:** ~3k  
**Description:** Coordinate multi-step tasks as one durable TaskFlow job

---

### taskflow-inbox-triage
**Path:** `/app/skills/taskflow-inbox-triage/SKILL.md`  
**Use when:** inbox triage, intent routing, waiting on replies  
**Token cost:** ~2k  
**Description:** Example TaskFlow pattern for inbox triage

---

### weather
**Path:** `/app/skills/weather/SKILL.md`  
**Use when:** current weather, forecasts, rain, temperature  
**Token cost:** ~2k  
**Description:** Current weather and forecasts with web_fetch

---

## How to Load a Skill

When user request matches a skill:

```python
# 1. Read the skill file
read(skill_path)

# 2. Follow the workflow in SKILL.md

# 3. Skill content stays in conversation context
#    (not added to system prompt)
```

---

## Token Savings

| Approach | Skills Loaded | Tokens per Request |
|----------|---------------|-------------------|
| All skills preloaded | 15 skills | ~30k-50k |
| **Lazy loading** | **0-1 skills** | **0-3k** |

**Savings: 90-95%**

---

## Best Practices

1. **Don't preload all skills** — Load only when needed
2. **Keep catalog updated** — Add new skills as installed
3. **Use descriptive keywords** — Help identify when to load
4. **Document token costs** — Help decide when loading is worth it

---

**Last updated:** 2026-07-17  
**Maintained by:** Potus (AI assistant)
