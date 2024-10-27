async function runLighthouse(url) {
  try {
    const puppeteer = await import("puppeteer");
    const lighthouse = await import("lighthouse");

    const browser = await puppeteer.launch({ headless: true });
    const options = {
      logLevel: "info",
      output: "json",
      port: new URL(browser.wsEndpoint()).port,
    };

    const runnerResult = await lighthouse.default(url, options);
    const report = JSON.parse(runnerResult.report);

    await browser.close();

    const lighthouseOutput = {
      "Performance Score": report.categories.performance.score * 100,
      "Accessibility Score": report.categories.accessibility.score * 100,
      "Best Practices Score": report.categories["best-practices"].score * 100,
      "SEO Score": report.categories.seo.score * 100,
      Suggestions: report.audits["diagnostics"].details.items,
    };

    console.log(`/////////////////////`);
    console.log(
      `===============>\nLighthouse Result for: ${url}\n===============>`
    );
    console.log(
      ` 'Performance Score': ${lighthouseOutput["Performance Score"].toFixed(
        2
      )}%,`
    );
    console.log(
      ` 'Accessibility Score': ${lighthouseOutput[
        "Accessibility Score"
      ].toFixed(2)}%,`
    );
    console.log(
      ` 'Best Practices Score': ${lighthouseOutput[
        "Best Practices Score"
      ].toFixed(2)}%,`
    );
    console.log(` 'SEO Score': ${lighthouseOutput["SEO Score"].toFixed(2)}%,`);

    console.log(` =========Suggestions=========`);
    if (lighthouseOutput.Suggestions.length > 0) {
      const suggestions = lighthouseOutput.Suggestions[0];
      for (const [key, value] of Object.entries(suggestions)) {
        console.log(` ${key}: ${value},`);
      }
    } else {
      console.log(` No suggestions available.`);
    }

    console.log(`/////////////////////`);

    return lighthouseOutput;
  } catch (error) {
    console.error("Error running Lighthouse analysis:", error);
  }
}

module.exports = { runLighthouse };
