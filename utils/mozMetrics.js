const Moz = require('moz-url-metrics');

async function getMozMetrics(url) {
  const moz = new Moz('your-moz-access-id', 'your-moz-secret-key');
  
  const metrics = await moz.urlMetrics(url);
  return metrics;
}

module.exports = { getMozMetrics };
