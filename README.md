# Azure App Service - SSL for SaaS Demo

A Node.js application designed to demonstrate Cloudflare SSL for SaaS by displaying HTTP headers, TLS information, and SNI (Server Name Indication) details.

**GitHub**: https://github.com/adz80/sample-azure-app

---

## 🚀 Quick Start - Deploy in 2 Steps

### Step 1: Open Azure Cloud Shell

Go to https://shell.azure.com (or click the shell icon in Azure Portal)

```bash
# Check your subscription
az account show --query "{Name:name, ID:id}" --output table

# (Optional) Switch subscription if needed
# az account set --subscription "your-subscription-name"
```

### Step 2: Clone and Deploy

```bash
# Clone the repo
git clone https://github.com/adz80/sample-azure-app.git
cd sample-azure-app

# Deploy with one command (change app name to be unique)
az webapp up \
  --name ssl-saas-demo-[your-name] \
  --runtime "NODE:24-lts" \
  --sku B1 \
  --location westus

# Done! Wait 2-3 minutes for deployment
```

**Note**: If you get a quota error, try different regions:
- `--location westeurope`
- `--location australiaeast`
- `--location southeastasia`

**Your app will be at**: `https://ssl-saas-demo-[your-name].azurewebsites.net`

---

## ✨ Features

- 🔒 **TLS Information Display**: Shows SNI hostname, TLS protocol, and cipher suite
- 📡 **HTTP Headers Inspector**: Displays all incoming HTTP headers, organized by category
- ☁️ **Cloudflare Headers**: Highlights Cloudflare-specific headers (CF-*, X-Forwarded-*)
- 🌐 **Azure Headers**: Shows Azure App Service specific headers
- 📋 **Copy to Clipboard**: Easy export of all request data
- 🎨 **Clean Web UI**: Responsive interface perfect for live demos

---

## 🏗️ How It Works

This application captures request information at the Azure App Service level. Since Azure terminates TLS at the load balancer, the app reconstructs TLS information from headers provided by:

- **Cloudflare**: `CF-SSL-Protocol`, `CF-SSL-Cipher`, `CF-Visitor`
- **Azure**: `X-ARR-ClientCert`, `X-Forwarded-Proto`
- **Standard**: `Host`, `X-Forwarded-For`, `X-Forwarded-Host`

### Architecture

```
Client Browser
    ↓
Cloudflare Edge (TLS termination, adds CF-* headers)
    ↓
Azure App Service Load Balancer (TLS re-termination, adds X-ARR-* headers)
    ↓
Node.js Application (captures all headers)
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18.x or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/adz80/sample-azure-app.git
cd sample-azure-app

# Install dependencies
npm install

# Run the application
npm start
```

Open your browser to `http://localhost:8080`

---

## ☁️ Cloudflare SSL for SaaS Setup

This demo shows how to use Cloudflare SSL for SaaS to provide custom domains for your customers.

**Example domains used**:
- Azure custom domain: `ssl4sass-azure.chewbacca.dev`
- SSL for SaaS customer domain: `school1.chewbacca.dev`

### 1. Add Azure Custom Domain (Optional but Recommended)

First, add a custom domain directly to Azure for testing:

**Configure DNS**:
```
CNAME: ssl4sass-azure.chewbacca.dev → ssl-saas-demo-aboyce.azurewebsites.net
```

**Add to Azure**:
1. Go to Azure Portal → Your App Service → **Custom domains**
2. Click **+ Add custom domain**
3. Enter `ssl4sass-azure.chewbacca.dev` (or your domain)
4. Click **Validate** (Azure will verify the CNAME)
5. Once validated, click **Add**
6. Wait 1-2 minutes for domain to be added

### 2. Add SSL for SaaS Custom Hostname in Cloudflare

Add a customer domain through Cloudflare SSL for SaaS:

1. Go to Cloudflare Dashboard → **SSL/TLS** → **Custom Hostnames**
2. Click **Add Custom Hostname**
3. Enter customer domain: `school1.chewbacca.dev`
4. Choose SSL certificate option (e.g., **Let's Encrypt**)
5. Click **Add**
6. Wait for certificate to be issued (~1-2 minutes)

### 3. Configure DNS for SSL for SaaS Domain

Create a CNAME record for the customer domain:

```
CNAME: school1.chewbacca.dev → ssl-saas-demo-aboyce.azurewebsites.net
```

Enable Cloudflare proxy (orange cloud) in DNS settings for automatic SSL.

### 4. Add SSL for SaaS Domain to Azure

Add the customer domain to Azure:

1. Go to Azure Portal → Your App Service → **Custom domains**
2. Click **+ Add custom domain**
3. Enter `school1.chewbacca.dev`
4. Click **Validate**
5. Once validated, click **Add**
6. **Do NOT add SSL binding** - Cloudflare handles SSL

### 5. Test the Demo

**Direct Access** (no Cloudflare):
- Visit `https://ssl-saas-demo-aboyce.azurewebsites.net`
- You'll see Azure headers but no Cloudflare headers

**Azure Custom Domain**:
- Visit `https://ssl4sass-azure.chewbacca.dev`
- You'll see Azure headers and possibly Cloudflare headers
- SNI will show `ssl4sass-azure.chewbacca.dev`

**SSL for SaaS Domain** (through Cloudflare):
- Visit `https://school1.chewbacca.dev`
- You'll see Cloudflare headers: `CF-Ray`, `CF-Connecting-IP`, `CF-SSL-Protocol`, etc.
- SNI will show `school1.chewbacca.dev`
- This demonstrates multi-tenant SSL!

---

## 📊 Understanding the Headers

### Cloudflare Headers (CF-*)

| Header | Description | Example |
|--------|-------------|---------|
| `cf-ray` | Unique request identifier | `8a1b2c3d4e5f6789-SJC` |
| `cf-connecting-ip` | Original client IP address | `203.0.113.42` |
| `cf-visitor` | JSON with connection scheme | `{"scheme":"https"}` |
| `cf-ssl-protocol` | TLS version used | `TLSv1.3` |
| `cf-ssl-cipher` | Cipher suite | `AEAD-AES128-GCM-SHA256` |

### Azure Headers (X-ARR-*, X-MS-*)

| Header | Description | Example |
|--------|-------------|---------|
| `x-arr-log-id` | Azure request log ID | `abc123-def456` |
| `x-arr-ssl` | SSL/TLS information | `2048\|256\|C=US...` |
| `x-arr-clientcert` | Client certificate (if mTLS) | Base64 encoded cert |
| `disguised-host` | Original host before routing | `school1.chewbacca.dev` |

### TLS Information Sources

- **SNI**: From `host` header or `x-forwarded-host`
- **TLS Protocol**: From `cf-ssl-protocol` (Cloudflare) or `x-forwarded-proto` (fallback)
- **Cipher Suite**: From `cf-ssl-cipher` (Cloudflare only)
- **Client Certificate**: From `x-arr-clientcert` (Azure, if mTLS enabled)

---

## 🎬 Demo Guide

### What to Show

**1. Direct Access**
- Open `https://ssl-saas-demo-aboyce.azurewebsites.net`
- Point out: "No Cloudflare headers - direct to Azure"
- Show: TLS cipher is "N/A"

**2. Azure Custom Domain**
- Open `https://ssl4sass-azure.chewbacca.dev`
- Point out: "Custom domain on Azure"
- Show: SNI changes to custom domain

**3. SSL for SaaS Domain**
- Open `https://school1.chewbacca.dev`
- Point out: "Now we see CF-* headers through Cloudflare!"
- Show: TLS protocol and cipher now visible
- Demonstrate: "This is a customer's domain with SSL"

**4. Multiple Domains**
- Open different SSL for SaaS domains (e.g., `school2.chewbacca.dev`)
- Show: SNI changes for each domain
- Demonstrate: "One app, many customer domains with individual SSL"

### Expected Output

**Direct Access** (`ssl-saas-demo-aboyce.azurewebsites.net`):
- ✅ Azure headers
- ❌ No Cloudflare headers
- SNI = `ssl-saas-demo-aboyce.azurewebsites.net`
- TLS cipher = "N/A"

**Azure Custom Domain** (`ssl4sass-azure.chewbacca.dev`):
- ✅ Azure headers
- ⚠️ May have Cloudflare headers if proxied
- SNI = `ssl4sass-azure.chewbacca.dev`

**SSL for SaaS Domain** (`school1.chewbacca.dev`):
- ✅ Azure headers
- ✅ Cloudflare headers (CF-Ray, CF-SSL-Protocol, etc.)
- ✅ TLS cipher visible
- SNI = `school1.chewbacca.dev`
- ⭐ This demonstrates multi-tenant SSL!

---

## 🔄 Update Your App

After making code changes:

```bash
# In Azure Cloud Shell
cd sample-azure-app
git pull
az webapp up
```

Or locally:

```bash
# Commit and push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Then in Azure Cloud Shell
cd sample-azure-app
git pull
az webapp up
```

---

## 🆘 Troubleshooting

### Deployment Issues

**Quota error during deployment**
- Try different regions: `--location westeurope` or `--location australiaeast`
- Or request quota increase in Azure Portal → Subscriptions → Usage + quotas

**App won't start**
```bash
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]
```

**Build fails**
- Check that `package.json` is valid
- Ensure `node_modules` is in `.gitignore`

### Runtime Issues

**No Cloudflare headers visible**
- You're accessing directly (not through Cloudflare)
- Ensure you're using the custom domain configured in SSL for SaaS
- Check DNS CNAME is correct
- Verify Cloudflare proxy is enabled (orange cloud)

**TLS info shows "N/A"**
- This is expected when accessing directly
- Cloudflare adds these headers when proxied

**Custom domain not working**
- Wait for DNS propagation (up to 48h, usually minutes)
- Verify CNAME points to Azure URL
- Check Azure custom domain is added and verified

### Useful Commands

```bash
# View logs
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]

# Restart app
az webapp restart --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]

# Check subscription
az account show --output table

# Delete everything (cleanup)
az group delete --name [auto-generated-rg] --yes
```

---

## 📡 API Reference

### Endpoints

- `GET /` - Web UI
- `GET /api/info` - JSON response with all request information

### Response Format

```json
{
  "connection": {
    "method": "GET",
    "url": "/api/info",
    "protocol": "https",
    "hostname": "customer.example.com",
    "timestamp": "2026-05-28T07:23:04.000Z"
  },
  "tls": {
    "sni": "customer.example.com",
    "protocol": "TLSv1.3",
    "cipher": "AEAD-AES128-GCM-SHA256",
    "clientCert": "Not present"
  },
  "headers": {
    "cloudflare": { ... },
    "forwarded": { ... },
    "azure": { ... },
    "standard": { ... },
    "all": { ... }
  }
}
```

---

## 🛠️ Technologies Used

- **Node.js 24 LTS**: Runtime environment
- **Express**: Web framework
- **Azure App Service**: Hosting platform
- **Cloudflare SSL for SaaS**: SSL/TLS proxy

---

## 📝 License

MIT

---

## 🎯 Quick Reference

### Deploy Command
```bash
az webapp up --name ssl-saas-demo-[your-name] --runtime "NODE:24-lts" --sku B1 --location westus
```

### Update Command
```bash
cd sample-azure-app && git pull && az webapp up
```

### View Logs
```bash
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]
```

---

**Time to deploy**: ~3 minutes  
**Time to configure SSL for SaaS**: ~5 minutes  
**Total**: ~8 minutes to full demo! ⚡
