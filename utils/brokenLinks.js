const axios = require('axios');

async function checkBrokenLinks(urlList) {
  const results = {
    "Working Links": [],
    "Broken Links": [],
    "Failed Requests": []
  };

  for (const url of urlList) {
    try {
      const response = await axios.get(url);
      if (response.status === 404) {
        results["Broken Links"].push({ url: url, status: response.status, message: "404 Not Found" });
      } else {
        results["Working Links"].push({ url: url, status: response.status, message: "Link is working fine" });
      }
    } catch (error) {
      results["Failed Requests"].push({ url: url, error: error.message || "Unknown error" });
    }
  }

  console.log(`/////////////////////`);
  console.log(`/////////////////////`);
  console.log(`===============> Broken Links Check Result <===============`);
  console.log(` 'Total URLs Checked': ${urlList.length}`);
  console.log(` 'Working Links': ${results["Working Links"].length}`);
  console.log(` 'Broken Links': ${results["Broken Links"].length}`);
  console.log(` 'Failed Requests': ${results["Failed Requests"].length}`);
  console.log(` =========Details=========`);
  
  if (results["Working Links"].length > 0) {
    console.log(`----Working Links (${results["Working Links"].length})----`);
    results["Working Links"].forEach(link => {
      console.log(` URL: ${link.url}, Status: ${link.status}, Message: ${link.message}`);
    });
  }

  if (results["Broken Links"].length > 0) {
    console.log(`----Broken Links (${results["Broken Links"].length})----`);
    results["Broken Links"].forEach(link => {
      console.log(` URL: ${link.url}, Status: ${link.status}, Message: ${link.message}`);
    });
  }

  if (results["Failed Requests"].length > 0) {
    console.log(`----Failed Requests (${results["Failed Requests"].length})----`);
    results["Failed Requests"].forEach(link => {
      console.log(` URL: ${link.url}, Error: ${link.error}`);
    });
  }

  console.log(`/////////////////////`);
  console.log(`/////////////////////`);

  return results;
}

module.exports = { checkBrokenLinks };
