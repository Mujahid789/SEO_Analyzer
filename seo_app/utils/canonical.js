const axios = require('axios');
const cheerio = require('cheerio');

async function checkCanonical(url) {
    try {
        // Fetch the page content
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Get the body text from the page
        const bodyText = $('body').text();

        // Split the text into words and filter out common stop words
        const words = bodyText
            .toLowerCase()
            .replace(/[.,!?;()]/g, '') // Remove punctuation
            .split(/\s+/) // Split by whitespace
            .filter(word => word.length > 2); // Filter out short words

        // Create a frequency map for the words
        const frequencyMap = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

        // Sort the keywords by frequency and get the top 10
        const sortedKeywords = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Get top 10 keywords

        // Return the keywords and their frequency
        const keywords = sortedKeywords.map(([keyword, count]) => ({
            keyword,
            count,
        }));

        return {
            success: true,
            keywords,
        };
    } catch (error) {
        console.error('Error extracting keywords:', error);
        return {
            success: false,
            message: `Failed to retrieve keywords for ${url}. Error: ${error.message}`,
        };
    }
}

module.exports = {
    checkCanonical,
};
