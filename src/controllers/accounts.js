const model = require('../models/account')

function getAll (req, res, next) {
    const limit = req.query.limit
    const data = model.getAll(limit)
    res.status(200).json({ data })
}

function getOne(req, res, next){
    const account = model.getOne(req.params.id)
    if(account.data){
      return res.status(200).send({ data: account.data })
    }
    else if(account.error){
      return next({ status: 404, message: account.error })
    }
}

function create(req, res, next) {
    const result = model.create(req.body);

    if (result.errors) {
        return next({ status: 400, message: `Could not create, no inspiration`, errors: result.errors });
    }

    res.status(201).json({ data: result });
}

function update(req, res, next) {
    if (!req.body.name) {
        return next({ status: 400, message: "Bad Request" });
    }

    const account = model.update(req.body.name, req.params.id);

    if (account.data) {
        return res.status(200).send({data: account.data});
    }
    else if(account.error) {
        return next({ status: 404, message: account.error })
    }
}

function remove(req, res, next) {
    const account = model.remove(req.params.id)
    if(account.data){
        return res.status(200).send({ data: account.data })
     }
    else if(account.error){
        return next({ status: 404, message: account.error })
  }
}

//////////////////
// TRANSACTIONS //

function getAllTransactions(req, res, next) {
    const transactions = model.getAllTransactions(req.params.id)
    res.status(200).json({ data: transactions })
}

function getOneTransaction(req, res, next) {
    const transaction = model.getOneTransaction(req.params.id, req.params.trid);

    if(transaction.data){
        return res.status(200).send({ data: transaction.data })
    }
    else if(transaction.error){
        return next({ status: 404, message: transaction.error })
    }
}

function createTransaction(req, res, next) {
    const transaction = model.createTransaction(req.params.id, req.body);

    if (transaction.errors) {
        return next({ status: 400, message: `Could not create, no inspiration`, errors: transaction.errors });
    }

    res.status(201).json({ data: transaction });
}

function updateTransaction(req, res, next) {
    const transaction = model.updateTransaction(req.params.id, req.params.trid, req.body);

    if(transaction.data){
        return res.status(200).send({ data: transaction.data })
    }
    else if(transaction.error){
        return next({ status: 404, message: transaction.error })
    }
}

function removeTransaction(req, res, next) {
    const transaction = model.removeTransaction(req.params.id, req.params.trid);

    if(transaction.data){
        return res.status(200).send({ data: transaction.data })
    }
    else if(transaction.error){
        return next({ status: 404, message: transaction.error })
    }
}

module.exports = { getAll, getOne, remove, update, create, getAllTransactions, createTransaction, getOneTransaction, updateTransaction, removeTransaction };
