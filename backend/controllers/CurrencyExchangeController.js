const {
  NotFoundError,
  ValidationError,
  BadRequestError,
} = require('../utils/errors');
const CurrencyExchangeServices = require('../services/CurrencyExchangeServices');

exports.getHistory = async (req, res) => {
  const exchangeHistory = await CurrencyExchangeServices.getHistory();
  res.status(200).json(exchangeHistory);
};

exports.getCurrencies = async (req, res) => {
  const currencies = await CurrencyExchangeServices.getCurrencies();
  res.status(200).json(currencies);
}

exports.exchange = async (req, res) => {
  const exchangeCurrency = await CurrencyExchangeServices.exchange(req.body);
  res.status(200).json(exchangeCurrency);
};
