const psi = require('psi');

async function analyzePageSpeed(url) {
  const result = await psi(url);
  const lighthouseResult = result.data.lighthouseResult;

  const pagespeedOutput = {
    "Performance Score": lighthouseResult.categories.performance.score * 100,
    "First Contentful Paint (FCP)": `${(lighthouseResult.audits['first-contentful-paint'].displayValue || 'N/A')}`,
    "Speed Index": `${(lighthouseResult.audits['speed-index'].displayValue || 'N/A')}`,
    "Largest Contentful Paint (LCP)": `${(lighthouseResult.audits['largest-contentful-paint'].displayValue || 'N/A')}`,
    "Time to Interactive (TTI)": `${(lighthouseResult.audits['interactive'].displayValue || 'N/A')}`,
    "Total Blocking Time (TBT)": `${(lighthouseResult.audits['total-blocking-time'].displayValue || 'N/A')}`,
    "Cumulative Layout Shift (CLS)": `${(lighthouseResult.audits['cumulative-layout-shift'].displayValue || 'N/A')}`,
    "Opportunities for Improvement": lighthouseResult.audits['opportunities'] ? 
      lighthouseResult.audits['opportunities'].details.items.map(item => item['opportunity.title']) : 
      "No opportunities found",
    "Diagnostics": lighthouseResult.audits['diagnostics'].details.items || []
  };

  console.log(`/////////////////////`);
  console.log(`/////////////////////`);
  console.log(`===============>\nPageSpeed Insights for: ${url}\n===============>`);
  console.log(` 'Performance Score': ${pagespeedOutput["Performance Score"].toFixed(2)}%,`);
  console.log(` 'First Contentful Paint (FCP)': ${pagespeedOutput["First Contentful Paint (FCP)"]},`);
  console.log(` 'Speed Index': ${pagespeedOutput["Speed Index"]},`);
  console.log(` 'Largest Contentful Paint (LCP)': ${pagespeedOutput["Largest Contentful Paint (LCP)"]},`);
  console.log(` 'Time to Interactive (TTI)': ${pagespeedOutput["Time to Interactive (TTI)"]},`);
  console.log(` 'Total Blocking Time (TBT)': ${pagespeedOutput["Total Blocking Time (TBT)"]},`);
  console.log(` 'Cumulative Layout Shift (CLS)': ${pagespeedOutput["Cumulative Layout Shift (CLS)"]},`);
  
  console.log(` =========Opportunities for Improvement=========`);

  if (Array.isArray(pagespeedOutput["Opportunities for Improvement"]) && pagespeedOutput["Opportunities for Improvement"].length > 0) {
    pagespeedOutput["Opportunities for Improvement"].forEach((opportunity, index) => {
      console.log(` Opportunity ${index + 1}: ${opportunity},`);
    });
  } else {
    console.log(` No opportunities available.`);
  }

  console.log(` =========Diagnostics=========`);

  if (Array.isArray(pagespeedOutput.Diagnostics) && pagespeedOutput.Diagnostics.length > 0) {
    pagespeedOutput.Diagnostics.forEach((diagnostic, index) => {
      console.log(` Diagnostic ${index + 1}: ${JSON.stringify(diagnostic, null, 2)},`);
    });
  } else {
    console.log(` No diagnostics available.`);
  }

  console.log(`/////////////////////`);
  console.log(`/////////////////////`);

  return pagespeedOutput;
}

module.exports = { analyzePageSpeed };
