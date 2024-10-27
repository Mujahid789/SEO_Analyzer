const axios = require('axios');

async function checkRedirects(urlList) {
  const results = {
    "No Redirects": [],
    "Redirects": [],
    "Failed Requests": []
  };

  for (const url of urlList) {
    try {
      const response = await axios.get(url, { maxRedirects: 0 });
      results["No Redirects"].push({
        "URL": url,
        "Status": response.status,
        "Message": "No redirect detected."
      });
    } catch (error) {
      if (error.response && error.response.status >= 300 && error.response.status < 400) {
        results["Redirects"].push({
          "URL": url,
          "Status": error.response.status,
          "Redirect Location": error.response.headers.location,
          "Message": `Redirect detected to ${error.response.headers.location}`
        });
      } else {
        results["Failed Requests"].push({
          "URL": url,
          "Error": error.message || "Unknown error",
          "Message": "Request failed while checking redirects."
        });
      }
    }
  }

  // Console Output in structured format
  console.log(`/////////////////////`);
  console.log(`/////////////////////`);
  console.log(`===============> Redirect Check Results <===============`);

  // No Redirects
  if (results["No Redirects"].length > 0) {
    console.log(` No Redirects Detected: ${results["No Redirects"].length}`);
    results["No Redirects"].forEach(entry => {
      console.log(` URL: ${entry.URL}`);
      console.log(` Status: ${entry.Status}`);
      console.log(` Message: ${entry.Message}`);
    });
  } else {
    console.log(` No URLs without redirects.`);
  }

  // Redirects
  if (results["Redirects"].length > 0) {
    console.log(` Redirects Detected: ${results["Redirects"].length}`);
    results["Redirects"].forEach(entry => {
      console.log(` URL: ${entry.URL}`);
      console.log(` Status: ${entry.Status}`);
      console.log(` Redirect Location: ${entry["Redirect Location"]}`);
      console.log(` Message: ${entry.Message}`);
    });
  } else {
    console.log(` No redirects detected.`);
  }

  // Failed Requests
  if (results["Failed Requests"].length > 0) {
    console.log(` Failed Requests: ${results["Failed Requests"].length}`);
    results["Failed Requests"].forEach(entry => {
      console.log(` URL: ${entry.URL}`);
      console.log(` Error: ${entry.Error}`);
      console.log(` Message: ${entry.Message}`);
    });
  } else {
    console.log(` No failed requests.`);
  }

  console.log(`/////////////////////`);
  console.log(`/////////////////////`);

  return results;
}

module.exports = { checkRedirects };
