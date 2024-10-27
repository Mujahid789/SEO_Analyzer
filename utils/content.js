const cheerio = require('cheerio');
const axios = require('axios');

async function checkContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const bodyText = $('body').text().trim();
    const linksCount = $('a').length;

    // Count the number of words in the body text
    const wordCount = bodyText.split(/\s+/).filter(word => word).length;

    const issues = [];

    // Check for insufficient content
    if (wordCount < 300) {
      issues.push({
        type: 'Content',
        message: `Insufficient content: The page has only ${wordCount} words. Recommended: 300+ words.`
      });
    }

    // Check for excessive links
    if (linksCount > 100) {
      issues.push({
        type: 'Links',
        message: `Excessive number of links on the page: ${linksCount} links found. Recommended: fewer than 100 links.`
      });
    }

    const readableResult = {
      "Word Count": wordCount,
      "Links Count": linksCount,
      "Issues": issues.length > 0 ? issues : "No content or link issues found."
    };

    // Console Output in structured format
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Content Check for: ${url} <===============`);
    console.log(` Word Count: ${readableResult["Word Count"]}`);
    console.log(` Links Count: ${readableResult["Links Count"]}`);
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
      message: `Failed to retrieve content for ${url}. Error: ${error.message}`,
      priority: 'High'
    };

    // Console Output in case of error
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Content Check for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { checkContent };
