# Quick Deployment Guide

## 🚀 Deploy to Azure App Service in 5 Minutes

### Prerequisites
- Azure account
- Azure CLI installed (optional, can use Portal)
- Git configured locally

---

## Option 1: Azure Portal (Easiest)

### Step 1: Create App Service
1. Go to https://portal.azure.com
2. Click **Create a resource** → **Web App**
3. Fill in:
   - **Name**: `your-unique-app-name` (e.g., `ssl-saas-demo-abc123`)
   - **Runtime**: Node 18 LTS
   - **Region**: Choose closest to you
   - **Pricing**: B1 or higher
4. Click **Review + Create** → **Create**

### Step 2: Enable Git Deployment
1. Go to your new App Service
2. Click **Deployment Center** (left menu)
3. Select **Local Git**
4. Click **Save**
5. **Copy the Git Clone URL** (looks like: `https://your-app-name.scm.azurewebsites.net/your-app-name.git`)

### Step 3: Set Deployment Credentials
1. Still in **Deployment Center**, click **Local Git/FTPS credentials**
2. Under **User Scope**, set:
   - Username: `your-username`
   - Password: `your-secure-password`
3. Click **Save**

### Step 4: Deploy Your Code
```bash
# Add Azure as a remote (replace URL with yours from Step 2)
git remote add azure https://your-app-name.scm.azurewebsites.net/your-app-name.git

# Push to Azure (enter credentials from Step 3 when prompted)
git push azure main

# Wait for deployment to complete (2-3 minutes)
```

### Step 5: Access Your App
Visit: `https://your-app-name.azurewebsites.net`

---

## Option 2: Azure CLI (Fastest)

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name ssl-saas-demo-rg --location eastus

# 3. Create App Service plan
az appservice plan create \
  --name ssl-saas-demo-plan \
  --resource-group ssl-saas-demo-rg \
  --sku B1 \
  --is-linux

# 4. Create web app
az webapp create \
  --name your-unique-app-name \
  --resource-group ssl-saas-demo-rg \
  --plan ssl-saas-demo-plan \
  --runtime "NODE:18-lts"

# 5. Configure Git deployment
az webapp deployment source config-local-git \
  --name your-unique-app-name \
  --resource-group ssl-saas-demo-rg

# 6. Set deployment credentials
az webapp deployment user set \
  --user-name your-username \
  --password your-password

# 7. Get the Git URL (copy this)
az webapp deployment source show \
  --name your-unique-app-name \
  --resource-group ssl-saas-demo-rg

# 8. Add remote and deploy
git remote add azure <GIT_URL_FROM_STEP_7>
git push azure main
```

---

## Updating Your App

After making code changes:

```bash
git add .
git commit -m "Your change description"
git push azure main
```

Azure will automatically rebuild and redeploy (takes ~2 minutes).

---

## Configure Cloudflare SSL for SaaS

### 1. Add Custom Hostname in Cloudflare
1. Go to Cloudflare Dashboard → SSL/TLS → Custom Hostnames
2. Click **Add Custom Hostname**
3. Enter customer domain (e.g., `customer.example.com`)
4. Choose SSL certificate option
5. Click **Add**

### 2. Add Custom Domain in Azure
1. Go to Azure App Service → **Custom domains**
2. Click **Add custom domain**
3. Enter the same domain from Cloudflare
4. Follow verification steps
5. Enable **HTTPS**

### 3. Configure DNS
Point your custom domain to Azure:
- **CNAME**: `customer.example.com` → `your-app-name.azurewebsites.net`

Or use Cloudflare proxy:
- Enable orange cloud in Cloudflare DNS

### 4. Test the Demo
1. Visit `https://customer.example.com`
2. You should see:
   - **Cloudflare Headers**: CF-Ray, CF-Connecting-IP, CF-SSL-Protocol
   - **SNI**: Shows `customer.example.com`
   - **TLS Info**: Protocol and cipher from Cloudflare

---

## Troubleshooting

### Deployment fails
```bash
# Check deployment logs
az webapp log tail --name your-app-name --resource-group ssl-saas-demo-rg
```

### App not starting
- Verify Node.js version is 18+
- Check that `package.json` has `"start": "node server.js"`
- Ensure port binding uses `process.env.PORT`

### No Cloudflare headers
- You're accessing directly (not through Cloudflare)
- Solution: Access via custom domain configured in SSL for SaaS

### Git push authentication fails
- Reset deployment credentials in Azure Portal
- Use deployment username (not your Azure email)

---

## Quick Commands Reference

```bash
# View logs
az webapp log tail --name <app-name> --resource-group <rg-name>

# Restart app
az webapp restart --name <app-name> --resource-group <rg-name>

# View app settings
az webapp config appsettings list --name <app-name> --resource-group <rg-name>

# Delete app (cleanup)
az webapp delete --name <app-name> --resource-group <rg-name>
```

---

## Cost Estimation

- **B1 Basic Plan**: ~$13/month
- **Free Tier**: Available but with limitations (no custom domains)
- **Production**: Consider S1 Standard (~$70/month) for better performance

---

## Next Steps

1. ✅ Deploy to Azure
2. ✅ Test direct access
3. ✅ Configure Cloudflare SSL for SaaS
4. ✅ Add custom domain
5. ✅ Test through Cloudflare
6. ✅ Compare headers (direct vs Cloudflare)

Happy demoing! 🎉
