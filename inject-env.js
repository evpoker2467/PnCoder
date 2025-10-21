// Script to inject environment variables into HTML for Netlify
// This script will be run during the build process

const fs = require('fs');
const path = require('path');

// Read the current index.html
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Get environment variables
const apiKey = process.env.OPENROUTER_API_KEY || '';
const siteUrl = process.env.SITE_URL || '';
const siteName = process.env.SITE_NAME || 'PnCoder';

// Create the environment variables script
const envScript = `
<script>
  // Environment variables injected during build
  window.OPENROUTER_API_KEY = '${apiKey}';
  window.SITE_URL = '${siteUrl}';
  window.SITE_NAME = '${siteName}';
</script>`;

// Inject the script before the closing </head> tag
html = html.replace('</head>', `${envScript}\n</head>`);

// Write the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('Environment variables injected into HTML');
console.log('OPENROUTER_API_KEY:', apiKey ? 'Set' : 'Not set');
console.log('SITE_URL:', siteUrl || 'Not set');
console.log('SITE_NAME:', siteName);
