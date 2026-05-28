const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/api/info', (req, res) => {
  const headers = {};
  Object.keys(req.headers).forEach(key => {
    headers[key] = req.headers[key];
  });

  const tlsInfo = {
    sni: req.headers.host || 'N/A',
    protocol: req.headers['cf-ssl-protocol'] || req.headers['x-forwarded-proto'] || 'N/A',
    cipher: req.headers['cf-ssl-cipher'] || 'N/A',
    clientCert: req.headers['x-arr-clientcert'] ? 'Present (see headers)' : 'Not present'
  };

  const cloudflareHeaders = {};
  const forwardedHeaders = {};
  const standardHeaders = {};
  const azureHeaders = {};

  Object.keys(headers).forEach(key => {
    if (key.startsWith('cf-')) {
      cloudflareHeaders[key] = headers[key];
    } else if (key.startsWith('x-forwarded-') || key.startsWith('forwarded')) {
      forwardedHeaders[key] = headers[key];
    } else if (key.startsWith('x-arr-') || key.startsWith('x-ms-') || key.startsWith('disguised-host')) {
      azureHeaders[key] = headers[key];
    } else {
      standardHeaders[key] = headers[key];
    }
  });

  const connectionInfo = {
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    secure: req.secure,
    ip: req.ip,
    ips: req.ips,
    hostname: req.hostname,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    timestamp: new Date().toISOString()
  };

  const response = {
    connection: connectionInfo,
    tls: tlsInfo,
    headers: {
      cloudflare: cloudflareHeaders,
      forwarded: forwardedHeaders,
      azure: azureHeaders,
      standard: standardHeaders,
      all: headers
    }
  };

  res.json(response);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Access the app at http://localhost:${PORT}`);
});
