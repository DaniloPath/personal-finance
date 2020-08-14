const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('../services/transactionService');

transactionRouter.get('/', async (req, res) => {
  const { query } = req;

  try {
    if (!query.period) {
      throw new Error(
        'Parâmetro "period" incorreto, tem que ser no formato yyyy-mm'
      );
    }

    const { period } = query;

    if (period.length !== 7) {
      throw new Error('Período inválido. Use o formato yyyy-mm');
    }

    const filteredTransactions = await transactionService.getTransactionsFrom(
      period
    );

    res.send({
      length: filteredTransactions.length,
      transactions: filteredTransactions,
    });
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

transactionRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    if (JSON.stringify(body) === '{}') {
      throw new Error('Conteúdo inexistente');
    }

    const { description, value, category, year, month, day, type } = body;
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    const yearMonthDay = `${yearMonth}-${day.toString().padStart(2, '0')}`;

    const postTransaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    };

    const newTransaction = await transactionService.postTransactions(
      postTransaction
    );

    res.send({ status: 'Ok', transaction: newTransaction });
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

transactionRouter.put('/', async (req, res) => {
  try {
    throw new Error('Conteúdo inexistente');

    //Mongo DB
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

transactionRouter.put('/:id', async (req, res) => {
  const { body, params } = req;

  console.log(params);

  try {
    if (JSON.stringify(body) === '{}') {
      throw new Error('Conteúdo inexistente');
    }

    const { description, value, category, year, month, day, type } = body;
    const { id } = params;
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    const yearMonthDay = `${yearMonth}-${day.toString().padStart(2, '0')}`;

    const updateTransaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    };

    const updatedTransaction = await transactionService.updateTransaction(
      id,
      updateTransaction
    );

    res.send({ status: 'Ok', transaction: updatedTransaction });
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

transactionRouter.delete('/', async (req, res) => {
  try {
    throw new Error('Conteúdo inexistente');

    //Mongo DB
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

transactionRouter.delete('/:id', async (req, res) => {
  const { params } = req;

  console.log(params);

  try {
    const { id } = params;

    const deleted = await transactionService.deleteTransaction(id);

    if (deleted) {
      res.send({ status: 'Ok', message: `${id} excluído com sucesso!` });
    } else {
      throw new Error('Não foi possível excluir');
    }
  } catch ({ message }) {
    console.log(message);
    res.status(400).send({ error: message });
  }
});

module.exports = transactionRouter;
