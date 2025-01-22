const express = require('express');
const router = express.Router();

const CurrencyExchangeController = require('../controllers/CurrencyExchangeController');

// customer
router.get(
  '/history',
  CurrencyExchangeController.getHistory
);
router.get(
  '/currencies',
  CurrencyExchangeController.getCurrencies
);
router.post(
  '/exchange',
  CurrencyExchangeController.exchange
);

module.exports = router;
