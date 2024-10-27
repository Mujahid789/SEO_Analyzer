const { Analyzer } = require('hint');

async function runWebhint(url) {
  const analyzer = new Analyzer({
    extends: ['web-recommended'],
    formatters: ['summary'],
  });

  const results = await analyzer.analyze(url);
  return results;
}

module.exports = { runWebhint };
