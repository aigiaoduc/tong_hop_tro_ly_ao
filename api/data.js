const fs = require('fs');
const path = require('path');

function getAppsScriptUrl() {
  if (process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_URL.trim()) {
    return process.env.APPS_SCRIPT_URL.trim();
  }
  try {
    const configPath = path.join(__dirname, '..', 'config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const match = content.match(/APPS_SCRIPT_URL\s*:\s*['"]([^'"]+)['"]/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.error('Error reading config.js:', err);
  }
  return '';
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appsScriptUrl = req.query.url || getAppsScriptUrl();

  if (!appsScriptUrl) {
    return res.status(200).json({
      success: false,
      message: 'APPS_SCRIPT_URL is not configured yet in config.js or environment variables.'
    });
  }

  if (req.method === 'GET') {
    const isRefresh = req.query.refresh === 'true' || req.query.nocache === '1';
    const action = req.query.action || 'getAll';

    if (isRefresh || action === 'getVersion' || action === 'getConfig') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400, public');
    }

    try {
      const targetUrl = new URL(appsScriptUrl);
      const action = req.query.action || 'getAll';
      targetUrl.searchParams.set('action', action);

      const response = await fetch(targetUrl.toString(), {
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error('Edge cache fetch error:', err);
      return res.status(502).json({
        success: false,
        error: 'Failed to fetch from Google Apps Script: ' + err.message
      });
    }
  }

  if (req.method === 'POST') {
    res.setHeader('Cache-Control', 'no-store');
    try {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try {
          bodyData = JSON.parse(bodyData);
        } catch (e) {}
      }

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bodyData || {})
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error('Edge proxy post error:', err);
      return res.status(502).json({
        success: false,
        error: 'Failed to post to Google Apps Script: ' + err.message
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
