const { Analyzer } = require('hint');

async function checkSEO(url) {
  try {
    const analyzer = new Analyzer({
      extends: ['web-recommended'],
      connector: {
        name: 'puppeteer',
        options: {
          waitUntil: 'networkidle2'  // Wait until there are no more network requests
        }
      },
      formatters: ['summary'],
      hints: [
        'accessibility',
        'performance',
        'seo'
      ]
    });

    const results = await analyzer.analyze([url]);

    const seoResults = {
      "High Priority Issues": [],
      "Medium Priority Issues": [],
      "Low Priority Issues": []
    };

    results.forEach(result => {
      let priority = 'Low Priority Issues';
      if (result.severity === 2) {
        priority = 'High Priority Issues';
      } else if (result.severity === 1) {
        priority = 'Medium Priority Issues';
      }

      seoResults[priority].push({
        "Issue": result.message,
        "Element": result.resource,
        "Details": result.hintDescription || 'N/A'
      });
    });

    console.log(`===============> SEO Check Results for: ${url} <===============`);

    ['High Priority Issues', 'Medium Priority Issues', 'Low Priority Issues'].forEach(priority => {
      console.log(`${priority}: ${seoResults[priority].length}`);
      seoResults[priority].forEach((issue, index) => {
        console.log(` Issue ${index + 1}: ${issue.Issue}`);
        console.log(` Element: ${issue.Element}`);
        console.log(` Details: ${issue.Details}`);
      });
    });

    return seoResults;
  } catch (error) {
    console.error('Error during SEO analysis:', error);
  }
}

module.exports = { checkSEO };
