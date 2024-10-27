const cheerio = require('cheerio');
const axios = require('axios');

async function checkHeadings(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const h1Tags = $('h1').length;
    const h2Tags = $('h2').length;
    const h3Tags = $('h3').length;
    const h4Tags = $('h4').length;
    const h5Tags = $('h5').length;
    const h6Tags = $('h6').length;

    const issues = [];

    // Check for H1 tag issues
    if (h1Tags === 0) {
      issues.push({ type: 'H1', message: 'Missing H1 tag.' });
    }

    if (h1Tags > 1) {
      issues.push({ type: 'H1', message: 'Multiple H1 tags found. Only one H1 tag is recommended.' });
    }

    const readableResult = {
      "Total H1 Tags": h1Tags,
      "Total H2 Tags": h2Tags,
      "Total H3 Tags": h3Tags,
      "Total H4 Tags": h4Tags,
      "Total H5 Tags": h5Tags,
      "Total H6 Tags": h6Tags,
      "Issues": issues.length > 0 ? issues : "No heading structure issues found."
    };

    // Console Output in structured format
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Heading Check for: ${url} <===============`);
    console.log(` Total H1 Tags: ${readableResult["Total H1 Tags"]}`);
    console.log(` Total H2 Tags: ${readableResult["Total H2 Tags"]}`);
    console.log(` Total H3 Tags: ${readableResult["Total H3 Tags"]}`);
    console.log(` Total H4 Tags: ${readableResult["Total H4 Tags"]}`);
    console.log(` Total H5 Tags: ${readableResult["Total H5 Tags"]}`);
    console.log(` Total H6 Tags: ${readableResult["Total H6 Tags"]}`);
    console.log(` =========Issues=========`);
    
    if (typeof readableResult["Issues"] === "string") {
      console.log(` ${readableResult["Issues"]}`);
    } else {
      readableResult["Issues"].forEach(issue => {
        console.log(` Issue Type: ${issue.type}`);
        console.log(` Message: ${issue.message}`);
      });
    }

    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return readableResult;

  } catch (error) {
    const errorResult = {
      message: `Failed to retrieve headings for ${url}. Error: ${error.message}`,
      priority: 'High'
    };

    // Console Output in case of error
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Heading Check for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { checkHeadings };
