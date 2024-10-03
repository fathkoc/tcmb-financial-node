
const axios = require('axios');
const xml2js = require('xml2js');

// Döviz kurlarını çeker ve parse eder
async function fetchRates(url) {
  try {
    const response = await axios.get(url);
    // XML response'u parse et
    const rates = await parseXml(response.data);
    return rates;
  } catch (error) {
    console.error(`Error fetching rates: ${error.message}`);
    return null;
  }
}

// XML verisini parse eden fonksiyon
async function parseXml(xmlData) {
  const parser = new xml2js.Parser();
  const parsedData = await parser.parseStringPromise(xmlData);
  return parsedData;
}

module.exports = {
  fetchRates,
  parseXml
};
