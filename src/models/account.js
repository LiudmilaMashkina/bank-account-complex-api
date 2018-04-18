const uuid = require('uuid/v4')
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, 'accounts_data.json')
const transactions_file = path.join(__dirname, 'transactions_data.json')

function getAll (limit) {
    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)
    return { accounts }
  //return limit ? accounts.slice(0, limit) : accounts
}

function getOne(id){
    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)

    const account = accounts.find(account => account.id === id);

    if(account) {
      return { data: account };
    }
    else {
      return { error: 'Account Not Found'};
    }
}

function create (body) {
    const errors = []
    const name = body.name
    const bankName = body.bankName
    const description = body.description

    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)
  
    let response
    if (!name) {
        errors.push('Name is required')
        response = { errors }
    } else {
        const account = { id: uuid(), name, bankName, description, transactions: [] }
        accounts.push(account)
        const json = JSON.stringify(accounts)
        fs.writeFileSync(file, json)
        response = account
    }
  
    return response
}

function update(name, id) {
    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)
    const account = accounts.find(account => account.id === id);

    if (name && account) {
        account.name = name;
        const json = JSON.stringify(accounts)
        fs.writeFileSync(file, json)
        return {data: account};
    }
    else {
        return { error: 'account Not Found'};
    }
}

function remove(id) {
    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);
    const account = accounts.find(account => account.id === id);

    if (account) {
        const index = accounts.indexOf(account);
        accounts.splice(index, 1);
        const json = JSON.stringify(accounts);
        fs.writeFileSync(file, json);
        return {data: account};
    }
    else
        return {error: 'Account Not Found'};
}

//////////////////
// TRANSACTIONS //

function getAllTransactions(id) {
    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);
    const account = accounts.find(account => account.id === id);

    if (account) {
        const transactions = getArrayOfTransactions(account.transactions);
        return { data: transactions };
    }
    else
        return { error: 'Account Not Found'};
}

function getArrayOfTransactions(arr_ids) {
    const contents = fs.readFileSync(transactions_file, 'utf-8');
    const transactions = JSON.parse(contents);
    const filteredTransactions = transactions.filter(transaction => arr_ids.includes(transaction.id));

    return filteredTransactions;
}

module.exports = { getAll, getOne, remove, update, create, getAllTransactions };
