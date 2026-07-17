# Publishing to ClawHub

Guide for publishing Lazy Context to ClawHub.

## Prerequisites

1. **ClawHub account:** https://clawhub.ai
2. **ClawHub CLI installed:**
   ```bash
   npm i -g clawhub
   ```
3. **Logged in:**
   ```bash
   clawhub login
   clawhub whoami
   ```

## Preparation

### 1. Validate Skill

```bash
cd /path/to/lazy-context
python ~/.openclaw/plugin-skills/skill-creator/scripts/quick_validate.py .
```

### 2. Test Locally

```bash
# Install in test workspace
openclaw skills install ./lazy-context

# Test activation
./scripts/activate_mcp.sh test-server

# Test token report
./scripts/token_report.sh
```

### 3. Update Version

Edit `SKILL.md`:

```yaml
---
name: lazy-context
description: "..."
version: "1.0.0"
---
```

## Publishing

### First Time

```bash
cd /path/to/lazy-context
clawhub skill publish . --slug lazy-context --version 1.0.0
```

### Updates

```bash
clawhub skill publish . --slug lazy-context --version 1.1.0
```

## Verification

Check publication:

```bash
openclaw skills verify lazy-context
```

View on ClawHub:

```
https://clawhub.ai/YOUR_USERNAME/skills/lazy-context
```

## Marketing

### 1. Create Demo Video

Show:
- Problem: High token usage
- Solution: Lazy Context
- Results: 90% savings

### 2. Write Blog Post

Topics:
- Why token optimization matters
- How Lazy Context works
- Real-world results

### 3. Share on Social

- Twitter/X
- LinkedIn
- Reddit (r/OpenClaw)
- Discord communities

### 4. Documentation Site

Consider creating:
- GitHub Pages
- Notion site
- Dedicated website

## Monetization (Optional)

### GitHub Sponsors

Add to README.md:

```markdown
## 💖 Support

If this skill saves you money, consider sponsoring:

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink.svg)](https://github.com/sponsors/YOUR_USERNAME)
```

### Buy Me a Coffee

```markdown
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg)](https://www.buymeacoffee.com/YOUR_USERNAME)
```

### Premium Version

Offer paid version with:
- Pre-configured catalogs
- Custom scripts
- Priority support
- Consulting services

## Maintenance

### Regular Updates

- Monitor OpenClaw updates
- Test with new versions
- Update documentation
- Respond to issues

### Community Engagement

- Answer questions
- Accept pull requests
- Feature requests
- Bug fixes

## Metrics

Track:
- Downloads
- Stars
- Forks
- Issues
- Pull requests

## Support

Provide support via:
- GitHub Issues
- Discussions
- Discord
- Email

## License

Lazy Context is MIT licensed. Users can:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

Must:
- Include license
- Include copyright

Cannot:
- Hold liable
- Use trademark

## Credits

Part of the [Lazy Context](https://github.com/SalesMach/lazy-context) skill for OpenClaw.
