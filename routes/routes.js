const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('../services/transactionService');

transactionRouter.get('/', transactionService.find);
transactionRouter.get(
  'periods/distinct',
  transactionService.findDistincPeriods
);
transactionRouter.post('/', transactionService.create);
transactionRouter.put('/:id', transactionService.update);
transactionRouter.delete('/:id', transactionService.remove);

module.exports = transactionRouter;
