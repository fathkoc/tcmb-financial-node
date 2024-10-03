
# TCMB Finansal Veriler Kütüphanesi (Node.js)

Bu kütüphane, Türkiye Cumhuriyet Merkez Bankası'ndan döviz kurları ve faiz oranlarını çekmek için kullanılır.

## Özellikler

- Günlük döviz kurlarını alır.
- Belirli bir tarih için döviz kurlarını çeker.
- Dövizler arasında dönüşüm yapar.
- Birden fazla döviz kurunu karşılaştırır.

## Kurulum

Kütüphaneyi npm üzerinden kurabilirsiniz:

```bash
npm install tcmb-financial-node
```

## Kullanım

```js
const { fetchTodayRates, convertCurrency } = require('tcmb-financial-node');

// Bugünün döviz kurlarını alın
fetchTodayRates().then(rates => {
    console.log(rates);
});

// Döviz dönüşümü yapın
const result = convertCurrency(100, 8.5, 10.2);
console.log(`Sonuç: ${result}`);
```

## Lisans

Bu proje [ISC Lisansı](LICENSE) ile lisanslanmıştır.

---

# TCMB Financial Data Library (Node.js)

This library is used to fetch exchange rates and interest rates from the Central Bank of the Republic of Turkey.

## Features

- Fetch daily exchange rates.
- Fetch historical exchange rates by date.
- Convert currencies.
- Compare multiple currency rates.

## Installation

You can install the library via npm:

```bash
npm install tcmb-financial-node
```

## Usage

```js
const { fetchTodayRates, convertCurrency } = require('tcmb-financial-node');

// Fetch today's exchange rates
fetchTodayRates().then(rates => {
    console.log(rates);
});

// Convert currency
const result = convertCurrency(100, 8.5, 10.2);
console.log(`Result: ${result}`);
```

## License

This project is licensed under the [ISC License](LICENSE).
