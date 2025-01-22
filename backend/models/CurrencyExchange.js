const mongoose = require('mongoose');

//------------ Currency Exchange Schema ------------//
const CurrencyExchangeSchema = new mongoose.Schema(
  {
    currencyIn: { type: String, required: true },
    currencyOut: { type: String, required: true },
    valueIn: { type: Number, required: true },
    valueOut: { type: Number, required: true },
  },
  { timestamps: true }
);

const CurrencyExchange = mongoose.model(
  'CurrencyExchange',
  CurrencyExchangeSchema
);

module.exports = CurrencyExchange;
