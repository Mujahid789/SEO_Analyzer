const serpapi = require('serpapi');

async function fetchSERPData(query) {
  const client = new serpapi.GoogleSearch('your-serpapi-key');
  
  const results = await client.json({
    q: query,
    location: 'United States'
  });
  
  return results;
}

module.exports = { fetchSERPData };
