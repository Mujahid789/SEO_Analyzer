const axios = require('axios');
const xml2js = require('xml2js');

async function parseSitemap(url) {
  try {
    // Fetch the sitemap XML
    const response = await axios.get(url);
    const sitemapXml = response.data;

    // Parse the XML using xml2js with options to handle special characters
    const parser = new xml2js.Parser({
      strict: false, // Allow non-strict parsing to handle malformed XML
      normalizeTags: true, // Normalize tags to lowercase
      explicitArray: false, // Prevent wrapping single elements in an array
      tagNameProcessors: [xml2js.processors.stripPrefix], // Strip XML namespace prefixes
    });

    const parsedSitemap = await parser.parseStringPromise(sitemapXml);

    // Ensure there's a urlset object in the parsed sitemap
    if (!parsedSitemap.urlset || !parsedSitemap.urlset.url) {
      const noUrlsResult = {
        message: 'No URLs found in the sitemap.',
        priority: 'High',
      };

      // Log output
      console.log(`/////////////////////`);
      console.log(`/////////////////////`);
      console.log(`===============> Sitemap Parsing for: ${url} <===============`);
      console.log(` Message: ${noUrlsResult.message}`);
      console.log(` Priority: ${noUrlsResult.priority}`);
      console.log(`/////////////////////`);
      console.log(`/////////////////////`);

      return noUrlsResult;
    }

    // Extract URLs from the parsed sitemap
    const urls = parsedSitemap.urlset.url instanceof Array ? parsedSitemap.urlset.url : [parsedSitemap.urlset.url];
    const totalUrls = urls.length;

    const readableResult = {
      "Sitemap Summary": `The sitemap contains ${totalUrls} URLs.`,
      "Non-Indexable URLs": "Not applicable in basic parsing.",
      "Canonical URLs": "Not parsed directly from the sitemap XML.",
    };

    // Console Output in structured format
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Sitemap Parsing for: ${url} <===============`);
    console.log(` Sitemap Summary: ${readableResult["Sitemap Summary"]}`);
    console.log(` Non-Indexable URLs: ${readableResult["Non-Indexable URLs"]}`);
    console.log(` Canonical URLs: ${readableResult["Canonical URLs"]}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return readableResult;
  } catch (error) {
    const errorResult = {
      message: `Failed to parse the sitemap at ${url}. Error: ${error.message}`,
      priority: 'High',
    };

    // Console Output for error
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);
    console.log(`===============> Sitemap Parsing for: ${url} <===============`);
    console.log(` Error: ${errorResult.message}`);
    console.log(` Priority: ${errorResult.priority}`);
    console.log(`/////////////////////`);
    console.log(`/////////////////////`);

    return errorResult;
  }
}

module.exports = { parseSitemap };
