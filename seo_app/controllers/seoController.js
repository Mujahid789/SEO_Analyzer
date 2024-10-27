const { runLighthouse } = require('../utils/lighthouse');
const { analyzePageSpeed } = require('../utils/pagespeed');
const { parseSitemap } = require('../utils/sitemapParser');
const { checkBrokenLinks } = require('../utils/brokenLinks');
const { checkRedirects } = require('../utils/redirects');
const { checkMetaTags } = require('../utils/metaTags');
const { checkHreflang } = require('../utils/hreflang');
const { checkImages } = require('../utils/images');
const { checkHeadings } = require('../utils/headings');
const { checkContent } = require('../utils/content');
const { checkCanonical } = require('../utils/canonical');

// Add this function to your backend code after importing other functions
const calculateOverallScore = (results) => {
  const lighthouseScore = results.lighthouseResult?.["Performance Score"] || 0;
  const pagespeedScore = results.pagespeedResult?.["Performance Score"] || 0;

  const contentIssuesCount =
    results.contentIssues?.["Issues"] === "No content or link issues found."
      ? 0
      : 1;
  const headingIssuesCount =
    results.headingIssues?.["Issues"] === "No heading structure issues found."
      ? 0
      : 1;
  const metaIssuesCount = results.metaIssues?.["Status"] === "Missing" ? 1 : 0;

  const weights = {
    lighthouse: 0.25,
    pagespeed: 0.25,
    contentIssues: 0.1,
    headingIssues: 0.1,
    metaIssues: 0.1,
    redirects: 0.2,
  };

  const overallScore =
    lighthouseScore * weights.lighthouse +
    pagespeedScore * weights.pagespeed -
    contentIssuesCount * 10 * weights.contentIssues +
    headingIssuesCount * 10 * weights.headingIssues +
    metaIssuesCount * 10 * weights.metaIssues;

  return Math.max(0, Math.min(overallScore, 100)).toFixed(2);
};

exports.runSEOAnalysis = async (req, res) => {
  const { url } = req.body;
  console.log("Received URL in Backend:", url);

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const [
      lighthouseResult,
      pagespeedResult,
      sitemap,
      brokenLinks,
      redirects,
      metaIssues,
      hreflangTags,
      imageIssues,
      headingIssues,
      contentIssues,
      canonical,
    ] = await Promise.all([
      runLighthouse(url),
      analyzePageSpeed(url),
      parseSitemap(url),
      checkBrokenLinks([url]),
      checkRedirects([url]),
      checkMetaTags(url),
      checkHreflang(url),
      checkImages(url),
      checkHeadings(url),
      checkContent(url),
      checkCanonical(url),
    ]);

    const seoResults = {
      lighthouseResult,
      pagespeedResult,
      sitemap,
      brokenLinks,
      redirects,
      metaIssues,
      hreflangTags,
      imageIssues,
      headingIssues,
      contentIssues,
      canonical,
    };

    // Log the results for debugging
    console.log("SEO Results:", seoResults);

    // Calculate overall site score
    const overallSiteScore = calculateOverallScore(seoResults);

    res.status(200).json({
      success: true,
      message: "SEO analysis completed successfully",
      data: {
        seoResults,
        overallSiteScore,
      },
    });
  } catch (error) {
    console.error("Error running SEO analysis:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
