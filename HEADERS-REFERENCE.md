# HTTP Headers Reference for SSL for SaaS Demo

## 🔍 What Headers to Expect

### When Accessing Directly (Azure Only)

```
Standard Headers:
├── host: your-app-name.azurewebsites.net
├── user-agent: Mozilla/5.0...
├── accept: text/html...
└── connection: keep-alive

Azure Headers:
├── x-arr-log-id: unique-request-id
├── x-arr-ssl: 2048|256|...
├── x-forwarded-for: client-ip
├── x-forwarded-proto: https
└── disguised-host: your-app-name.azurewebsites.net

TLS Info:
├── SNI: your-app-name.azurewebsites.net
├── Protocol: https (from x-forwarded-proto)
├── Cipher: N/A
└── Client Cert: Not present
```

### When Accessing Through Cloudflare

```
Cloudflare Headers:
├── cf-ray: unique-ray-id-XXX
├── cf-connecting-ip: original-client-ip
├── cf-visitor: {"scheme":"https"}
├── cf-ipcountry: US
├── cf-ssl-protocol: TLSv1.3
├── cf-ssl-cipher: AEAD-AES128-GCM-SHA256
└── cf-request-id: request-identifier

Forwarded Headers:
├── x-forwarded-for: client-ip, cloudflare-ip
├── x-forwarded-proto: https
└── x-forwarded-host: customer.example.com

Azure Headers:
├── x-arr-log-id: unique-request-id
├── x-arr-ssl: 2048|256|...
└── disguised-host: customer.example.com

Standard Headers:
├── host: customer.example.com
├── user-agent: Mozilla/5.0...
└── accept: text/html...

TLS Info:
├── SNI: customer.example.com (from host header)
├── Protocol: TLSv1.3 (from cf-ssl-protocol)
├── Cipher: AEAD-AES128-GCM-SHA256 (from cf-ssl-cipher)
└── Client Cert: Not present (unless mTLS configured)
```

---

## 📊 Header Categories Explained

### Cloudflare Headers (CF-*)

| Header | Description | Example Value |
|--------|-------------|---------------|
| `cf-ray` | Unique request identifier | `8a1b2c3d4e5f6789-SJC` |
| `cf-connecting-ip` | Original client IP address | `203.0.113.42` |
| `cf-visitor` | JSON with connection scheme | `{"scheme":"https"}` |
| `cf-ipcountry` | Client's country code | `US`, `GB`, `AU` |
| `cf-ssl-protocol` | TLS version used | `TLSv1.3`, `TLSv1.2` |
| `cf-ssl-cipher` | Cipher suite | `AEAD-AES128-GCM-SHA256` |
| `cf-request-id` | Cloudflare request ID | `0123456789abcdef` |

### Forwarded Headers (X-Forwarded-*)

| Header | Description | Example Value |
|--------|-------------|---------------|
| `x-forwarded-for` | Chain of IP addresses | `client-ip, proxy-ip` |
| `x-forwarded-proto` | Original protocol | `https`, `http` |
| `x-forwarded-host` | Original host header | `customer.example.com` |

### Azure Headers (X-ARR-*, X-MS-*)

| Header | Description | Example Value |
|--------|-------------|---------------|
| `x-arr-log-id` | Azure request log ID | `abc123-def456-ghi789` |
| `x-arr-ssl` | SSL/TLS information | `2048\|256\|C=US, ST=...` |
| `x-arr-clientcert` | Client certificate (if mTLS) | Base64 encoded cert |
| `disguised-host` | Original host before routing | `customer.example.com` |

---

## 🎯 Key Indicators for SSL for SaaS Demo

### ✅ Cloudflare is Working When You See:
- `cf-ray` header present
- `cf-connecting-ip` shows client IP
- `cf-ssl-protocol` shows TLS version
- `cf-ssl-cipher` shows cipher suite
- `x-forwarded-for` has multiple IPs (client, Cloudflare)

### ❌ Direct Access (No Cloudflare) When:
- No `cf-*` headers present
- Only Azure and standard headers
- `x-forwarded-for` has single IP
- TLS cipher shows "N/A"

---

## 🔐 TLS Information Sources

### SNI (Server Name Indication)
**Source**: `host` header or `x-forwarded-host`
**Shows**: The hostname used in TLS handshake
**Example**: `customer.example.com`

### TLS Protocol
**Source**: `cf-ssl-protocol` (Cloudflare) or `x-forwarded-proto` (fallback)
**Shows**: TLS version
**Example**: `TLSv1.3`, `TLSv1.2`

### Cipher Suite
**Source**: `cf-ssl-cipher` (Cloudflare only)
**Shows**: Encryption cipher used
**Example**: `AEAD-AES128-GCM-SHA256`, `ECDHE-RSA-AES128-GCM-SHA256`

### Client Certificate
**Source**: `x-arr-clientcert` (Azure, if mTLS enabled)
**Shows**: Client certificate in PEM format (Base64)
**Note**: Only present if Azure App Service has client certificate authentication enabled

---

## 🧪 Testing Scenarios

### Scenario 1: Direct Azure Access
**URL**: `https://your-app-name.azurewebsites.net`
**Expected**:
- ✅ Azure headers
- ❌ No Cloudflare headers
- ⚠️ TLS cipher = "N/A"

### Scenario 2: Through Cloudflare (Default Domain)
**URL**: `https://your-app-name.azurewebsites.net` (with Cloudflare proxy)
**Expected**:
- ✅ Azure headers
- ✅ Cloudflare headers
- ✅ TLS cipher visible
- SNI = `your-app-name.azurewebsites.net`

### Scenario 3: Custom Domain via SSL for SaaS
**URL**: `https://customer.example.com`
**Expected**:
- ✅ Azure headers
- ✅ Cloudflare headers
- ✅ TLS cipher visible
- SNI = `customer.example.com` ⭐
- `disguised-host` = `customer.example.com`

### Scenario 4: Multiple Custom Domains
**URLs**: 
- `https://customer1.example.com`
- `https://customer2.example.com`

**Expected**:
- SNI changes for each domain
- Different `cf-ray` IDs
- Same backend app serving all

---

## 📝 Demo Script

### Step 1: Show Direct Access
1. Open `https://your-app-name.azurewebsites.net`
2. Point out: "No Cloudflare headers - direct to Azure"
3. Show: TLS cipher is "N/A"

### Step 2: Enable Cloudflare Proxy
1. Add CNAME in Cloudflare DNS (orange cloud)
2. Refresh the page
3. Point out: "Now we see CF-* headers!"
4. Show: TLS protocol and cipher now visible

### Step 3: Add Custom Domain
1. Configure SSL for SaaS custom hostname
2. Open `https://customer.example.com`
3. Point out: "SNI now shows customer domain"
4. Show: Same app, different SNI

### Step 4: Compare Multiple Domains
1. Open different custom domains side-by-side
2. Show SNI changes
3. Demonstrate: "One app, many customer domains"

---

## 🐛 Troubleshooting Headers

### Problem: No headers showing
**Cause**: JavaScript error or API endpoint not responding
**Fix**: Check browser console, verify `/api/info` endpoint

### Problem: Headers show but empty sections
**Cause**: No headers in that category
**Expected**: Normal for direct access (no CF headers)

### Problem: TLS info all "N/A"
**Cause**: Not proxied through Cloudflare
**Fix**: Enable Cloudflare proxy or use custom domain

### Problem: SNI doesn't match custom domain
**Cause**: DNS not configured or Azure custom domain not added
**Fix**: Verify CNAME and Azure custom domain settings

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Open Network tab to see raw headers
2. **Compare Side-by-Side**: Open direct and proxied URLs in split screen
3. **Export Data**: Use "Copy to Clipboard" button to share
4. **Test from Different Locations**: CF headers vary by region
5. **Enable mTLS**: Configure client certificates in Azure for full demo

---

## 🔗 Useful Links

- [Cloudflare SSL for SaaS Docs](https://developers.cloudflare.com/ssl/ssl-for-saas/)
- [Azure App Service Custom Domains](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)
- [HTTP Headers Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [TLS Cipher Suites](https://www.cloudflare.com/learning/ssl/what-is-a-cipher-suite/)
