const cheerio = require('cheerio');
const axios = require('axios');

async function checkHreflang(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract hreflang tags and their corresponding href values
    const hreflangTags = $('link[rel="alternate"]').map((_, el) => ({
      hreflang: $(el).attr('hreflang'),
      href: $(el).attr('href')
    })).get();

    let readableResult = {};

    if (hreflangTags.length === 0) {
      readableResult = {
        "Hreflang Tags": "No hreflang tags found.",
        "Status": "Missing",
        "Message": "Your page does not have any hreflang tags, which are essential for international SEO."
      };
    } else {
      readableResult = {
        "Hreflang Tags": `${hreflangTags.length} hreflang tags found.`,
        "Status": "Present",
        "Details": hreflangTags.map(tag => ({
          "Hreflang": tag.hreflang,
          "URL": tag.href
        }))
      };
    }

    // Console Output in structured format
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Hreflang Check for: ${url} <===============`);
    console.log(` Hreflang Tags Status: ${readableResult["Status"]}`);
    console.log(` Total Hreflang Tags: ${readableResult["Hreflang Tags"]}`);
    
    if (readableResult["Details"]) {
      console.log(` =========Details=========`);
      readableResult["Details"].forEach(tag => {
        console.log(` Hreflang: ${tag.Hreflang}, URL: ${tag.URL}`);
      });
    } else {
      console.log(` Message: ${readableResult["Message"]}`);
    }

    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return readableResult;

  } catch (error) {
    const errorResult = {
      message: `Failed to retrieve hreflang tags for ${url}. Error: ${error.message}`,
      priority: 'High'
    };

    // Console Output in case of error
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Hreflang Check for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { checkHreflang };
