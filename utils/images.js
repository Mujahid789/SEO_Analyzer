const cheerio = require('cheerio');
const axios = require('axios');

async function checkImages(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const images = $('img');
    const imagesWithoutAlt = images.filter((_, img) => !$(img).attr('alt')).get();
    const totalImages = images.length;

    let readableResult = {};

    if (imagesWithoutAlt.length === 0) {
      readableResult = {
        "Total Images": totalImages,
        "Status": "All images have alt attributes.",
        "Message": "All images on the page have proper alt attributes."
      };
    } else {
      readableResult = {
        "Total Images": totalImages,
        "Images Without Alt": imagesWithoutAlt.length,
        "Details": imagesWithoutAlt.map(img => ({
          "Image Source": $(img).attr('src') || 'No source attribute found',
          "Message": "This image is missing an alt attribute."
        }))
      };
    }

    // Console Output in structured format
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Image Check for: ${url} <===============`);
    console.log(` Total Images: ${readableResult["Total Images"]}`);

    if (readableResult["Images Without Alt"]) {
      console.log(` Images Without Alt Attributes: ${readableResult["Images Without Alt"]}`);
      console.log(` =========Details=========`);
      readableResult["Details"].forEach(img => {
        console.log(` Image Source: ${img["Image Source"]}`);
        console.log(` Message: ${img["Message"]}`);
      });
    } else {
      console.log(` Status: ${readableResult["Status"]}`);
      console.log(` Message: ${readableResult["Message"]}`);
    }

    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return readableResult;

  } catch (error) {
    const errorResult = {
      message: `Failed to retrieve images for ${url}. Error: ${error.message}`,
      priority: 'High'
    };

    // Console Output in case of error
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Image Check for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { checkImages };
