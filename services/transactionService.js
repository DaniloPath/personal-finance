const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

//Busca os dados no banco, por período e descrição
async function find(req, res) {
  try {
    let data;
    const { period, description } = req.query;
    if (!description) {
      data = await getData(period);
      console.log(`GET: Objects(${period ? '?period=' + period : ''}) `);
    }
    if (period && description) {
      data = await getDataByDescription(description, period);
      console.log(`GET: Object (?period=${period}&description=${description})`);
    }
    res.send(data);
  } catch (err) {
    res.status(!!err.errNumber ? err.errNumber : 400).send(err.message);
  }
}

async function getDataByDescription(description = '', filter) {
  //Filtro descrição por período
  const desFilter = /^[12]\d{3}-(0[1-9]|1[012])$/;
  if (!filter.match(desFilter)) {
    throw { message: 'Informar perído no formato AAAA-MM' };
  }
  if (!description) {
    throw { message: 'Descrição vazia', errNumber: 406 };
  }
  const regEx = new RegExp(description, 'i');
  return TransactionModel.find({ yearMonth: filter, description: regEx }).sort({
    yearMonthDay: 'asc',
  });
}
// Função busca por período (data)
function getData(filter) {
  const regEx = /^[12]\d{3}-(0[1-9]|1[012])$/;
  if (filter) {
    if (!filter.match(regEx)) {
      throw { message: 'Informar período no formato AAAA-MM' };
    }
    return TransactionModel.find({ yearMonth: filter }).sort({
      yearMonth: 'asc',
    });
  }
  return TransactionModel.find();
}
//http://localhost:3001/api/transaction?2019-01
//(localiza todas as trasções em janeiro de 2019)
async function findDistincPeriods(_, res) {
  try {
    const data = await TransactionModel.distinct('yearMonth');
    console.log(`GET: Objects (.distinct('yearMonth'))`);
    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function create(req, res) {
  try {
    const data = await TransactionModel.create(req.body);
    console.log(`POST: Object (id=${data._id})`);
    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function update(req, res) {
  const id = req.params.id;
  try {
    const { _id } = req.query(`/?_id=${id}`);
    console.log(_id);
    if (!_id) throw { message: 'Informar id do elemento', errNumber: 400 };
    const data = await TransactionModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    console.log(`PUT: Object (id=${_id})`);
    res.send(data);
  } catch (err) {
    res.status(!!err.errNumber ? err.errNumber : 500).send(err.message);
  }
}

//http://localhost:3001/api/transaction/id:5f173dc3822799348c486b54
async function remove(req, res) {
  const id = req.params.id;
  console.log(id);
  try {
    const data = await TransactionModel.findByIdAndDelete({ _id: id });
    res.status(200).send(data);
    console.log(`DELETE: Object (id=${_id})`);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { find, findDistincPeriods, create, update, remove };
