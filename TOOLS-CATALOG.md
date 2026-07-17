# MCP Tools Catalog

**Purpose:** Lazy-load MCP tools on-demand to reduce token consumption by 90%+

**How to use:**
1. Consult this catalog when user requests something
2. Activate only needed MCP server(s) in `~/.openclaw/openclaw.json`
3. Execute task with `mcp_call`
4. Optionally deactivate after use

---

## bitrix24 (Growth24 CRM)

**Server:** `bitrix24`  
**Status:** Disabled by default  
**Activate when:** User mentions CRM, leads, deals, contatos, tarefas, Bitrix24, funil, vendas

### Available Tools

**User Management**
- `bitrix24_get_current_user` — Get current authenticated user info
- `bitrix24_list_users` — List all CRM users

**CRM Items (Leads, Deals, Contacts, Companies, Custom SPAs)**
- `bitrix24_list_items` — List CRM items with filters
- `bitrix24_create_item` — Create new CRM item
- `bitrix24_update_item` — Update existing item
- `bitrix24_get_item` — Get single item by ID
- `bitrix24_search_crm` — Search by name/email/phone across all CRM

**Tasks**
- `bitrix24_list_tasks` — List tasks with filters
- `bitrix24_create_task` — Create new task
- `bitrix24_update_task` — Update existing task
- `bitrix24_get_task` — Get task details

**Activities**
- `bitrix24_list_activities` — List activities (calls, meetings, emails)
- `bitrix24_log_call` — Log a call activity
- `bitrix24_log_meeting` — Log a meeting activity

**Communication**
- `bitrix24_open_channels` — List open chat channels (WhatsApp, Telegram, etc.)

**Analytics & Structure**
- `bitrix24_get_analytics` — CRM analytics and reports
- `bitrix24_list_pipelines` — List sales funnels/pipelines
- `bitrix24_list_stages` — List stages within a pipeline
- `bitrix24_get_entity_card_overview` — Get entity summary (lead, deal, etc.)
- `bitrix24_list_fields` — List custom fields for entity type

---

## hostinger-hosting-ansuz (Hosting - Ansuz Account)

**Server:** `hostinger-hosting-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions hosting, sites, hospedagem, servidores, bancos de dados (conta Ansuz)

### Available Tools

- `hosting_getWebsites` — List all hosted websites
- `hosting_getWebsiteDetails` — Get detailed info about specific site
- `hosting_listDatabases` — List databases for a website
- `hosting_createDatabase` — Create new database
- `hosting_getDNSRecords` — Get DNS records for hosted site
- `hosting_updateDNSRecords` — Update DNS records

---

## hostinger-domains-ansuz (Domains - Ansuz Account)

**Server:** `hostinger-domains-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions domínios, DNS, registro de domínio (conta Ansuz)

### Available Tools

- `domains_getDomains` — List all registered domains
- `domains_getDomainDetails` — Get domain details (expiry, nameservers, etc.)
- `domains_checkAvailability` — Check if domain is available for registration
- `domains_registerDomain` — Register new domain
- `domains_getDNSRecords` — Get DNS records for domain
- `domains_updateDNSRecords` — Update DNS records

---

## hostinger-dns-ansuz (DNS Management - Ansuz Account)

**Server:** `hostinger-dns-ansuz`  
**Status:** Disabled by default  
**Activate when:** User needs advanced DNS management (conta Ansuz)

### Available Tools

- `dns_getRecords` — Get all DNS records for zone
- `dns_updateRecords` — Bulk update DNS records
- `dns_createRecord` — Create single DNS record
- `dns_deleteRecord` — Delete DNS record

---

## hostinger-billing-ansuz (Billing - Ansuz Account)

**Server:** `hostinger-billing-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions faturas, pagamentos, assinaturas, billing (conta Ansuz)

### Available Tools

- `billing_getInvoices` — List all invoices
- `billing_getInvoiceDetails` — Get invoice details
- `billing_getSubscriptions` — List active subscriptions
- `billing_getPaymentMethods` — List saved payment methods

---

## hostinger-reach-ansuz (Email Marketing - Ansuz Account)

**Server:** `hostinger-reach-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions email marketing, campanhas, contatos (conta Ansuz)

### Available Tools

- `reach_getCampaigns` — List email campaigns
- `reach_getCampaignDetails` — Get campaign details and stats
- `reach_createCampaign` — Create new email campaign
- `reach_getContacts` — List contacts/subscribers
- `reach_getAnalytics` — Get campaign analytics

---

## hostinger-vps-ansuz (VPS - Ansuz Account)

**Server:** `hostinger-vps-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions VPS, servidores virtuais, backups (conta Ansuz)

### Available Tools

- `vps_getServers` — List all VPS servers
- `vps_getServerDetails` — Get VPS details (IP, specs, status)
- `vps_createServer` — Create new VPS
- `vps_rebootServer` — Reboot VPS
- `vps_getBackups` — List backups for VPS
- `vps_createBackup` — Create manual backup

---

## hostinger-ecommerce-ansuz (Ecommerce - Ansuz Account)

**Server:** `hostinger-ecommerce-ansuz`  
**Status:** Disabled by default  
**Activate when:** User mentions loja, produtos, pedidos, ecommerce (conta Ansuz)

### Available Tools

- `ecommerce_getStores` — List online stores
- `ecommerce_getStoreDetails` — Get store details
- `ecommerce_getProducts` — List products in store
- `ecommerce_createProduct` — Create new product
- `ecommerce_getOrders` — List orders
- `ecommerce_getOrderDetails` — Get order details

---

## hostinger-hosting (Hosting - Gustavo Account)

**Server:** `hostinger-hosting`  
**Status:** Disabled by default  
**Activate when:** User mentions hosting, sites (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-hosting-ansuz` but for personal account.

---

## hostinger-domains (Domains - Gustavo Account)

**Server:** `hostinger-domains`  
**Status:** Disabled by default  
**Activate when:** User mentions domínios (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-domains-ansuz` but for personal account.

---

## hostinger-dns (DNS - Gustavo Account)

**Server:** `hostinger-dns`  
**Status:** Disabled by default  
**Activate when:** User needs DNS management (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-dns-ansuz` but for personal account.

---

## hostinger-billing (Billing - Gustavo Account)

**Server:** `hostinger-billing`  
**Status:** Disabled by default  
**Activate when:** User mentions billing (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-billing-ansuz` but for personal account.

---

## hostinger-reach (Email Marketing - Gustavo Account)

**Server:** `hostinger-reach`  
**Status:** Disabled by default  
**Activate when:** User mentions email marketing (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-reach-ansuz` but for personal account.

---

## hostinger-vps (VPS - Gustavo Account)

**Server:** `hostinger-vps`  
**Status:** Disabled by default  
**Activate when:** User mentions VPS (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-vps-ansuz` but for personal account.

---

## hostinger-ecommerce (Ecommerce - Gustavo Account)

**Server:** `hostinger-ecommerce`  
**Status:** Disabled by default  
**Activate when:** User mentions ecommerce (conta pessoal Gustavo)

### Available Tools

Same as `hostinger-ecommerce-ansuz` but for personal account.

---

## How to Activate/Deactivate

### Activate a server

Edit `~/.openclaw/openclaw.json`:

```json
"server-name": {
  "enabled": true,  // ← change from false to true
  ...rest of config
}
```

Then reload:
```bash
openclaw mcp reload
```

### Deactivate a server

```json
"enabled": false
```

Then reload:
```bash
openclaw mcp reload
```

---

## Token Savings

| Approach | Tools Loaded | Tokens per Request | Savings |
|----------|--------------|-------------------|---------|
| All enabled (250+ tools) | 250+ | 50k-100k | 0% |
| Filtered (70 tools) | 70 | 15k-35k | ~65% |
| **Lazy loading (0-6 tools)** | **0-6** | **0-2k** | **~95%** |

---

## Notes

- **First activation:** Server takes ~1-2s to start
- **Batch operations:** If doing multiple tasks with same server, activate once, do all, then deactivate
- **Catalog maintenance:** Update this file when adding new MCP servers
- **Portability:** Copy this file to any OpenClaw workspace

---

**Last updated:** 2026-07-17  
**Maintained by:** Potus (AI assistant)
