# ⚡ Quick Start Guide

## 🎯 Goal
Deploy this app to Azure and demo Cloudflare SSL for SaaS in under 10 minutes.

---

## 📋 Prerequisites
- [ ] Azure account
- [ ] Git installed
- [ ] Code is already committed locally ✅

---

## 🚀 Deploy in 2 Steps

### Step 1: Open Azure Cloud Shell

Go to https://shell.azure.com (or click the shell icon in Azure Portal)

```bash
# Check your subscription
az account show --query "{Name:name, ID:id}" --output table

# (Optional) Switch subscription if needed
# az account set --subscription "your-subscription-name"
```

---

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

## 🔄 Update Your App (After Changes)

```bash
# In Azure Cloud Shell
cd sample-azure-app
git pull
az webapp up
```

---

## 🎬 Demo Cloudflare SSL for SaaS (5 min)

### Step 1: Test Direct Access
Visit your Azure URL - you'll see:
- ✅ Azure headers
- ❌ No Cloudflare headers
- SNI = your-app-name.azurewebsites.net

### Step 2: Add to Cloudflare
1. Cloudflare Dashboard → SSL/TLS → Custom Hostnames
2. Add custom hostname: `demo.yourdomain.com`
3. Choose SSL option → Add

### Step 3: Configure Azure
1. Azure Portal → Your App Service → Custom domains
2. Add custom domain: `demo.yourdomain.com`
3. Verify and enable HTTPS

### Step 4: Update DNS
Add CNAME: `demo.yourdomain.com` → `ssl-saas-demo-[your-name].azurewebsites.net`

### Step 5: Test!
Visit `https://demo.yourdomain.com` - you'll now see:
- ✅ Azure headers
- ✅ Cloudflare headers (CF-Ray, CF-SSL-Protocol, etc.)
- ✅ SNI = demo.yourdomain.com
- ✅ TLS cipher visible

---

## 🎯 What to Show in Demo

### 1. Direct Access
"Here's our app without Cloudflare - notice no CF headers"

### 2. Through Cloudflare
"Now with Cloudflare - see the CF-Ray, SSL protocol, cipher suite"

### 3. SNI Changes
"Watch the SNI change as we use different custom domains"

### 4. Multi-Tenant
"One app, many customer domains, each with their own SSL"

---

## 📱 Quick Commands

```bash
# View logs (replace with your app name and resource group)
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]

# Restart app
az webapp restart --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]

# Update app (in Cloud Shell)
cd sample-azure-app
git pull
az webapp up

# Delete everything (cleanup)
az group delete --name [auto-generated-rg] --yes
```

---

## 🆘 Troubleshooting

**App won't start?**
```bash
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group [auto-generated-rg]
```

**Quota error during deployment?**
- Try different regions: `--location westeurope` or `--location australiaeast`
- Or request quota increase in Azure Portal

**No Cloudflare headers?**
- You're accessing directly (not through Cloudflare)
- Check DNS CNAME is correct
- Verify Cloudflare proxy is enabled (orange cloud)

**Custom domain not working?**
- Wait for DNS propagation (up to 48h, usually minutes)
- Verify CNAME points to Azure URL
- Check Azure custom domain is added

---

## 📚 More Info

- **Full docs**: See `README.md`
- **Deployment details**: See `DEPLOYMENT.md`
- **Headers reference**: See `HEADERS-REFERENCE.md`
- **Project overview**: See `PROJECT-SUMMARY.md`

---

## ✅ Checklist

- [ ] Opened Azure Cloud Shell
- [ ] Cloned GitHub repo
- [ ] Ran `az webapp up` command
- [ ] App deployed and running
- [ ] Tested direct access
- [ ] Cloudflare custom hostname added
- [ ] Azure custom domain configured
- [ ] DNS CNAME created
- [ ] Tested through Cloudflare
- [ ] Verified Cloudflare headers appear
- [ ] SNI shows custom domain
- [ ] Ready to demo! 🎉

---

**Time to deploy**: ~5 minutes  
**Time to configure SSL for SaaS**: ~5 minutes  
**Total**: ~10 minutes to full demo! ⚡
