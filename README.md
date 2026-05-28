# Azure App Service - SSL for SaaS Demo

A Node.js application designed to demonstrate Cloudflare SSL for SaaS by displaying HTTP headers, TLS information, and SNI (Server Name Indication) details.

## Features

- 🔒 **TLS Information Display**: Shows SNI hostname, TLS protocol, and cipher suite
- 📡 **HTTP Headers Inspector**: Displays all incoming HTTP headers, organized by category
- ☁️ **Cloudflare Headers**: Highlights Cloudflare-specific headers (CF-*, X-Forwarded-*)
- 🌐 **Azure Headers**: Shows Azure App Service specific headers
- 📋 **Copy to Clipboard**: Easy export of all request data
- 🎨 **Clean Web UI**: Responsive interface perfect for live demos

## How It Works

This application captures request information at the Azure App Service level. Since Azure terminates TLS at the load balancer, the app reconstructs TLS information from headers provided by:

- **Cloudflare**: `CF-SSL-Protocol`, `CF-SSL-Cipher`, `CF-Visitor`
- **Azure**: `X-ARR-ClientCert`, `X-Forwarded-Proto`
- **Standard**: `Host`, `X-Forwarded-For`, `X-Forwarded-Host`

## Local Development

### Prerequisites

- Node.js 18.x or higher
- npm

### Setup

1. Clone or navigate to this repository:
```bash
cd /Users/aboyce/projects/sample-azure-app-sagov
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

4. Open your browser to `http://localhost:8080`

## Azure Deployment (Git Push)

### Step 1: Create Azure App Service

Using Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **App Service**
3. Choose:
   - **Runtime stack**: Node 18 LTS or higher
   - **Operating System**: Linux or Windows
   - **Region**: Choose your preferred region

Using Azure CLI:
```bash
# Login to Azure
az login

# Create a resource group (if needed)
az group create --name ssl-saas-demo-rg --location eastus

# Create an App Service plan
az appservice plan create \
  --name ssl-saas-demo-plan \
  --resource-group ssl-saas-demo-rg \
  --sku B1 \
  --is-linux

# Create the web app
az webapp create \
  --name your-app-name \
  --resource-group ssl-saas-demo-rg \
  --plan ssl-saas-demo-plan \
  --runtime "NODE:18-lts"
```

### Step 2: Configure Git Deployment

Using Azure Portal:
1. Go to your App Service
2. Navigate to **Deployment Center**
3. Select **Local Git** as the source
4. Click **Save**
5. Note the **Git Clone Uri** (e.g., `https://your-app-name.scm.azurewebsites.net/your-app-name.git`)

Using Azure CLI:
```bash
# Enable local git deployment
az webapp deployment source config-local-git \
  --name your-app-name \
  --resource-group ssl-saas-demo-rg

# This will output the Git URL
```

### Step 3: Set Up Deployment Credentials

Using Azure Portal:
1. Go to **Deployment Center** → **Local Git/FTPS credentials**
2. Set a username and password under **User Scope**
3. Save the credentials

Using Azure CLI:
```bash
# Set deployment credentials
az webapp deployment user set \
  --user-name your-username \
  --password your-password
```

### Step 4: Initialize Git and Deploy

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SSL for SaaS demo app"

# Add Azure remote (replace with your Git Clone Uri)
git remote add azure https://your-app-name.scm.azurewebsites.net/your-app-name.git

# Push to Azure (you'll be prompted for deployment credentials)
git push azure main
```

If your default branch is `master`:
```bash
git push azure master:main
```

### Step 5: Verify Deployment

1. Wait for the deployment to complete (you'll see build logs in the terminal)
2. Access your app at: `https://your-app-name.azurewebsites.net`
3. You should see the SSL for SaaS demo interface

## Cloudflare SSL for SaaS Configuration

### Setting Up Custom Domains

1. **In Cloudflare Dashboard**:
   - Navigate to SSL/TLS → Custom Hostnames
   - Add custom hostnames for your customers
   - Configure SSL certificates

2. **In Azure App Service**:
   - Go to **Custom domains**
   - Add your custom domain
   - Verify domain ownership
   - Enable HTTPS

3. **Point DNS**:
   - Create a CNAME record pointing your custom domain to your Azure App Service URL
   - Or use Cloudflare's proxy (orange cloud)

### Testing the Demo

1. **Direct Access** (no Cloudflare):
   - Visit `https://your-app-name.azurewebsites.net`
   - You'll see Azure headers but no Cloudflare headers

2. **Through Cloudflare**:
   - Visit your custom domain configured in SSL for SaaS
   - You'll see Cloudflare headers: `CF-Ray`, `CF-Connecting-IP`, `CF-SSL-Protocol`, etc.
   - SNI will show the custom hostname used

3. **Different Custom Domains**:
   - Configure multiple custom hostnames in Cloudflare
   - Access each one and observe SNI changes

## Understanding the Output

### TLS Information Section
- **SNI**: The hostname used in the TLS handshake (from `Host` header)
- **Protocol**: TLS version (from `CF-SSL-Protocol` or `X-Forwarded-Proto`)
- **Cipher**: Cipher suite used (from `CF-SSL-Cipher`)
- **Client Cert**: Whether a client certificate was presented (from `X-ARR-ClientCert`)

### Cloudflare Headers
- `CF-Ray`: Unique request identifier
- `CF-Connecting-IP`: Original client IP address
- `CF-Visitor`: JSON with scheme information
- `CF-SSL-Protocol`: TLS version (e.g., TLSv1.3)
- `CF-SSL-Cipher`: Cipher suite used

### Azure Headers
- `X-ARR-ClientCert`: Client certificate (if mTLS enabled)
- `X-MS-*`: Various Azure-specific headers
- `Disguised-Host`: Original host header

## Updating the Application

After making code changes:

```bash
# Commit changes
git add .
git commit -m "Description of changes"

# Push to Azure
git push azure main
```

The app will automatically rebuild and redeploy.

## Troubleshooting

### Deployment Issues

**Problem**: Git push fails with authentication error
- **Solution**: Verify deployment credentials in Azure Portal → Deployment Center

**Problem**: Build fails during deployment
- **Solution**: Check that `package.json` is valid and `node_modules` is in `.gitignore`

**Problem**: App doesn't start
- **Solution**: Check logs in Azure Portal → Log stream or use:
```bash
az webapp log tail --name your-app-name --resource-group ssl-saas-demo-rg
```

### Runtime Issues

**Problem**: No Cloudflare headers visible
- **Solution**: Ensure you're accessing through Cloudflare proxy, not directly

**Problem**: TLS info shows "N/A"
- **Solution**: This is expected when accessing directly; Cloudflare adds these headers

**Problem**: Port binding error
- **Solution**: Ensure `server.js` uses `process.env.PORT || 8080`

## Architecture

```
Client Browser
    ↓
Cloudflare Edge (TLS termination, adds CF-* headers)
    ↓
Azure App Service Load Balancer (TLS re-termination, adds X-ARR-* headers)
    ↓
Node.js Application (captures all headers)
```

## API Endpoints

- `GET /` - Web UI
- `GET /api/info` - JSON response with all request information

## Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **Azure App Service**: Hosting platform
- **Cloudflare**: SSL for SaaS proxy

## License

MIT

## Support

For issues or questions:
1. Check Azure App Service logs
2. Verify Cloudflare configuration
3. Ensure DNS is properly configured
4. Test direct access vs. Cloudflare proxy access
