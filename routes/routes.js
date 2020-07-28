const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('../services/transactionService');
const dateHelpers = require('../helpers/dateHelpers');

/* transactionRouter.get('/', async (req, res) => {
  const { query } = req;

  try {
    if (!query.period) {
      throw new Error('Parâmetro "period" em formato AAAA-MM');
    }
    const { period } = query;
    dateHelpers.validatePeriod(period);

    const filterTrasactions = await transactionService.find(period);
    res.send({
      length: filterTrasactions.length,
      transactions: filterTrasactions,
    });
  } catch ({ mess }) {
    console.log(mess);
    res.status(400).send({ error: mess });
  }
}); */

transactionRouter.get('/', transactionService.find);
transactionRouter.get(
  'periods/distinct',
  transactionService.findDistincPeriods
);
transactionRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    await validateTransactionData(body);

    const { description, value, category, year, month, day, type } = body;
    const period = dateHelpers.createPeriodFrom(year, month);
    const newTransaction = await transactionService.create({
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: period,
      yearMonthDay: dateHelpers.createPeriodFrom(year, month, day),
      type,
    });
    res.send({ status: 'Ok!', transaction: newTransaction });
  } catch ({ mess }) {
    console.log(mess);
    res.status(400).send({ error: mess });
  }
});
transactionRouter.put('/:id', async (req, res) => {
  const { body, params } = req;

  try {
    await validateTransactionId(params);
    await validateTransactionData(body);

    const { description, value, category, year, month, day, type } = body;
    const { id } = params;
    const period = dateHelpers.createPeriodFrom(year, month);

    const newTransaction = await transactionService.update(id, {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: period,
      yearMonthDay: dateHelpers.createPeriodFrom(year, month, day),
      type,
    });
    res.send({ status: 'Ok!', transaction: newTransaction });
  } catch ({ mess }) {
    console.log(mess);
    res.status(400).send({ error: mess });
  }
});

transactionRouter.delete('/:id', async (req, res) => {
  const { params } = req;

  try {
    await validateTransactionId(params);
    const { id } = params;

    await transactionService.remove(id);
    res.send({
      status: 'Ok!',
      message: `Lançamento com id (${id} excluído com sucesso!)`,
    });
  } catch ({ mess }) {
    console.log(mess);
    res.status(400).send({ error: mess });
  }
});

module.exports = transactionRouter;
