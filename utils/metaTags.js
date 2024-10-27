const cheerio = require('cheerio');
const axios = require('axios');

async function checkMetaTags(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content');
    
    const readableResult = {
      "Title Tag": {},
      "Meta Description": {}
    };

    // Check Title Tag
    if (!title) {
      readableResult["Title Tag"] = {
        "Status": "Missing",
        "Message": "The title tag is missing from the page."
      };
    } else if (title.length < 10 || title.length > 60) {
      readableResult["Title Tag"] = {
        "Status": "Not Optimized",
        "Message": `The title tag is not optimized. Current length: ${title.length} characters. Recommended length: 50-60 characters.`,
        "Current Title": title
      };
    } else {
      readableResult["Title Tag"] = {
        "Status": "Optimized",
        "Message": `The title tag is well optimized. Current length: ${title.length} characters.`,
        "Current Title": title
      };
    }

    // Check Meta Description
    if (!metaDescription) {
      readableResult["Meta Description"] = {
        "Status": "Missing",
        "Message": "The meta description tag is missing from the page."
      };
    } else if (metaDescription.length < 50 || metaDescription.length > 160) {
      readableResult["Meta Description"] = {
        "Status": "Not Optimized",
        "Message": `The meta description is not optimized. Current length: ${metaDescription.length} characters. Recommended length: 50-160 characters.`,
        "Current Meta Description": metaDescription
      };
    } else {
      readableResult["Meta Description"] = {
        "Status": "Optimized",
        "Message": `The meta description is well optimized. Current length: ${metaDescription.length} characters.`,
        "Current Meta Description": metaDescription
      };
    }

    // Console Output
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Meta Tags Check for: ${url} <===============`);
    console.log(` Title Tag Status: ${readableResult["Title Tag"]["Status"]}`);
    if (readableResult["Title Tag"]["Current Title"]) {
      console.log(` Current Title: ${readableResult["Title Tag"]["Current Title"]}`);
    }
    console.log(` Message: ${readableResult["Title Tag"]["Message"]}`);
    
    console.log(` Meta Description Status: ${readableResult["Meta Description"]["Status"]}`);
    if (readableResult["Meta Description"]["Current Meta Description"]) {
      console.log(` Current Meta Description: ${readableResult["Meta Description"]["Current Meta Description"]}`);
    }
    console.log(` Message: ${readableResult["Meta Description"]["Message"]}`);
    
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return readableResult;

  } catch (error) {
    const errorResult = {
      message: `Failed to retrieve meta tags for ${url}. Error: ${error.message}`,
      priority: 'High'
    };

    // Error Output
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Meta Tags Check for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { checkMetaTags };
