const https = require('https');
const url = 'https://script.google.com/macros/s/AKfycbylzkCMq3k1uIufM3lNtTd96v-BU8WGPf-tlQFIFkS1aM_4-u5tLJpJMt0I46CoXXqmaA/exec?action=getAll';

function fetchUrl(targetUrl) {
  https.get(targetUrl, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      fetchUrl(res.headers.location);
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      console.log('DATA_VERSION:', json.data.config.DATA_VERSION);
      json.data.apps.forEach((a, idx) => {
        console.log((idx+1) + '. ID: ' + a.id + ' | ' + a.name + ' | Cat: ' + a.category + ' (' + a.category_name + ')');
      });
    });
  });
}
fetchUrl(url);
