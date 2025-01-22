/**
 * Currency Exchange Service Module
 *
 * This module provides services for currency exchange and list exchange history use third parties API.
 *
 * Functions:
 *
 * 1. getHistory()
 *    - Retrieves a list of currency exchange history.
 *    - Returns an array of currency exchange model.
 *
 * 2. getCurrencies()
 *    - Retrieves a list of currency code available.
 *    - Returns an array of currency code.
 *
 * 3. exchange(body)
 *    - Exchange two currency.
 *    - Returns the exchange data.
 *
 * Models:
 *
 * - Currency Exchange: Represents an currency exchange in the system.
 *
 * Errors:
 *
 * - NotFoundError: Thrown when a requested resource is not found.
 * - ValidationError: Thrown when validation of input data fails.
 * - BadRequestError: Thrown when a bad request is made.
 *
 * Example Usage:
 *
 * const currencyExchangeService = require('./CurrencyExchangeService');
 *
 * // Get History
 * currencyExchangeService.getHistory()
 *   .then(rates => console.log(exchangeHistory))
 *   .catch(err => console.error(err));
 *
 * // Get Currencies Code
 * currencyExchangeService.getCurrencies()
 *   .then(currencyCodes => console.log(currencyCodes))
 *   .catch(err => console.error(err));
 *
 * // Exchange currency
 * currencyExchangeService.exchange(exchangeData)
 *   .then(exchangeData => console.log(exchangeData))
 *   .catch(err => console.error(err));
 *
 */
const CurrencyExchange = require('../models/CurrencyExchange');
const {
  NotFoundError,
  ValidationError,
  BadRequestError,
} = require('../utils/errors');
const {
  EXCHANGE_RATE_API_URL,
  EXCHANGE_RATE_API_KEY,
} = require('../config/constant');
const axios = require('axios');

exports.getHistory = async () => {
  let esxchangeHistory = await CurrencyExchange.find()
    .sort({ createdAt: -1 })
    .exec();
  return esxchangeHistory;
};

exports.getCurrencies = async () => {
  return axios(
    `${EXCHANGE_RATE_API_URL}/latest?access_key=${EXCHANGE_RATE_API_KEY}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }
  )
    .then(async (response) => {
      if (response?.data?.success) {
        const { rates } = response?.data;

        return Object.keys(rates);
      } else {
        throw new ValidationError("API don't fetch successful data.");
      }
    })
    .catch(function (error) {
      throw new ValidationError(JSON.stringify(error));
    });
};

exports.exchange = async (body) => {
  const { currencyIn, currencyOut, valueIn } = body;
  if (!currencyIn)
    throw new ValidationError('Currency In must be a valid currency code.');
  if (!currencyOut)
    throw new ValidationError('Currency Out must be a valid currency code.');
  if (isNaN(valueIn)) throw new ValidationError('Value In must be a number.');
  return axios(
    `${EXCHANGE_RATE_API_URL}/latest?access_key=${EXCHANGE_RATE_API_KEY}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }
  )
    .then(async (response) => {
      if (response?.data?.success) {
        const { date, base, rates } = response?.data;
        let valueOut = 1;

        const rateIn = rates[currencyIn];
        if (isNaN(rateIn))
          throw new NotFoundError('Currency In code not found.');

        const rateOut = rates[currencyOut];
        if (isNaN(rateOut))
          throw new NotFoundError('Currency In code not found.');

        if (base === currencyIn) {
          valueOut = valueIn * rateOut;
        } else {
          valueOut = valueIn / rateIn;
        }

        let exchangeCurrency = new CurrencyExchange({
          currencyIn,
          currencyOut,
          valueIn,
          valueOut,
        });

        await exchangeCurrency.save();

        return exchangeCurrency;
      } else {
        throw new ValidationError("API don't fetch successful data.");
      }
    })
    .catch(function (error) {
      throw new ValidationError(JSON.stringify(error));
    });
};
