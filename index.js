
const { fetchRates, parseXml } = require('./lib/helpers');
const moment = require('moment');

const BASE_URL = 'https://www.tcmb.gov.tr/kurlar/';

// Bugünün döviz kurlarını alır
async function fetchTodayRates() {
  const today = moment().format('YYYYMMDD');
  const url = `${BASE_URL}${today}.xml`;
  return await fetchRates(url);
}

// Tarih bazında döviz kurları çeker
async function fetchCurrencyRateByDate(currencyCode, date) {
  const formattedDate = moment(date).format('YYYYMMDD');
  const url = `${BASE_URL}${formattedDate}.xml`;
  try {
    const data = await fetchRates(url);
    return getCurrencyRateFromData(currencyCode, data);
  } catch (error) {
    console.error(`Failed to fetch historical exchange rates for ${date}:`, error.message);
    return null;
  }
}

// Dövizler arasında dönüşüm yapar
function convertCurrency(amount, fromRate, toRate) {
  return (amount * fromRate) / toRate;
}

// Belirli bir tarihte döviz dönüşümü yapma
async function convertCurrencyByDate(amount, fromCurrency, toCurrency, date) {
  const fromRate = await fetchCurrencyRateByDate(fromCurrency, date);
  const toRate = await fetchCurrencyRateByDate(toCurrency, date);

  if (!fromRate || !toRate) {
    throw new Error("Currency conversion rates not found for the given date.");
  }

  // Dönüşüm işlemi
  const convertedAmount = (amount * fromRate.ForexBuying) / toRate.ForexBuying;
  return convertedAmount;
}

// Birden fazla döviz kurunu karşılaştırır
function compareRates(currencies) {
  return currencies.sort((a, b) => a.rate - b.rate);
}

// En yüksek ve en düşük döviz kurları
async function getHighestAndLowestRate(currencyCode, startDate, endDate) {
  let highestRate = null;
  let lowestRate = null;
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const rate = await fetchCurrencyRateByDate(currencyCode, currentDate.format('YYYY-MM-DD'));

    if (rate) {
      if (!highestRate || rate.ForexSelling > highestRate) {
        highestRate = rate.ForexSelling;
      }
      if (!lowestRate || rate.ForexSelling < lowestRate) {
        lowestRate = rate.ForexSelling;
      }
    }

    currentDate = currentDate.add(1, 'day');
  }

  return {
    highest: highestRate,
    lowest: lowestRate
  };
}

// Faiz oranlarını çekme
async function fetchInterestRates() {
  const interestRateUrl = 'https://www.tcmb.gov.tr/interest-rates.xml';
  try {
    const response = await axios.get(interestRateUrl);
    const rates = await parseXml(response.data);
    return rates;
  } catch (error) {
    console.error('Failed to fetch interest rates:', error.message);
    return null;
  }
}

// XML verisinden belirli bir döviz kuru çekme
function getCurrencyRateFromData(currencyCode, data) {
  for (const currency of data.Currency) {
    if (currency['@attributes']['CurrencyCode'] === currencyCode.toUpperCase()) {
      return {
        CurrencyCode: currency['@attributes']['CurrencyCode'],
        Unit: currency.Unit,
        ForexBuying: currency.ForexBuying,
        ForexSelling: currency.ForexSelling
      };
    }
  }
  throw new Error("Currency code not found.");
}

module.exports = {
  fetchTodayRates,
  fetchCurrencyRateByDate,
  convertCurrency,
  convertCurrencyByDate,
  compareRates,
  getHighestAndLowestRate,
  fetchInterestRates
};
