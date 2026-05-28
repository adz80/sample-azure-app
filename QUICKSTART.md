# ⚡ Quick Start Guide

## 🎯 Goal
Deploy this app to Azure and demo Cloudflare SSL for SaaS in under 10 minutes.

---

## 📋 Prerequisites
- [ ] Azure account
- [ ] Git installed
- [ ] Code is already committed locally ✅

---

## 🚀 Deploy in 3 Steps

### Step 1: Create Azure App Service (2 min)

**Option A - Azure Portal:**
1. Go to https://portal.azure.com
2. Create Resource → Web App
3. Name: `ssl-saas-demo-[your-name]`
4. Runtime: Node 18 LTS
5. Create

**Option B - Azure CLI:**
```bash
az login
az group create --name ssl-saas-rg --location eastus
az webapp create --name ssl-saas-demo-[your-name] \
  --resource-group ssl-saas-rg \
  --runtime "NODE:18-lts" \
  --sku B1
```

---

### Step 2: Enable Git Deployment (2 min)

**In Azure Portal:**
1. Go to your App Service
2. Deployment Center → Local Git → Save
3. Copy the Git URL
4. Set deployment credentials (username/password)

**Or via CLI:**
```bash
az webapp deployment source config-local-git \
  --name ssl-saas-demo-[your-name] \
  --resource-group ssl-saas-rg

az webapp deployment user set \
  --user-name deployuser \
  --password YourPassword123!
```

---

### Step 3: Deploy (1 min)

```bash
# Add Azure remote (use your Git URL from Step 2)
git remote add azure https://ssl-saas-demo-[your-name].scm.azurewebsites.net/ssl-saas-demo-[your-name].git

# Push to deploy
git push azure main

# Enter deployment credentials when prompted
```

**Done!** Visit: `https://ssl-saas-demo-[your-name].azurewebsites.net`

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
# View logs
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group ssl-saas-rg

# Restart app
az webapp restart --name ssl-saas-demo-[your-name] --resource-group ssl-saas-rg

# Update app
git add .
git commit -m "Update"
git push azure main

# Delete everything (cleanup)
az group delete --name ssl-saas-rg --yes
```

---

## 🆘 Troubleshooting

**App won't start?**
```bash
az webapp log tail --name ssl-saas-demo-[your-name] --resource-group ssl-saas-rg
```

**Git push fails?**
- Check deployment credentials
- Use deployment username (not Azure email)

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

- [ ] Azure App Service created
- [ ] Git deployment configured
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
