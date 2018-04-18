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

function createTransaction(id, body) {
    const errors = [];

    const title = body.title;
    const amount = body.amount;
    const pending = body.pending;

    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);
    const account = accounts.find(account => account.id === id);
    
    let response;
    if (account) {
        if (!title) {
            errors.push('Title is required');
            response = { errors };
        } 
        if (!amount) {
            errors.push('Amount is required');
            response = { errors };
        }
        if (!pending) {
            errors.push('Pending is required');
            response = { errors };
        }
        else {
            const transaction = { id: uuid(), title, amount, pending: true };

            account.transactions.push(transaction.id);
            const json = JSON.stringify(accounts);
            fs.writeFileSync(file, json);

            const transactions_contents = fs.readFileSync(transactions_file, 'utf-8');
            const transactions = JSON.parse(transactions_contents);
            transactions.push(transaction);

            const tr_json = JSON.stringify(transactions);
            fs.writeFileSync(transactions_file, tr_json);

            response = transaction;
        }
    }
    else {
        errors.push('Account not found');
        response = { errors };
    }

    return response
}

// ID: (You Choose) A unique id that represents the transaction. Created automatically.
// Title: (String) A title for the transaction. Cannot be more than 8 characters. Required.
// Amount: (Number) A positive or negative number depending on the type of transaction. Required.
// Pending: (Boolean) A true/false value for whether or not the transaction is pending. Required. Defaults to true.


///// helper funcs
function getArrayOfTransactions(arr_ids) {
    const contents = fs.readFileSync(transactions_file, 'utf-8');
    const transactions = JSON.parse(contents);

    const filteredTransactions = transactions.filter(transaction => arr_ids.includes(transaction.id));

    return filteredTransactions;
}

function findAccount(id) {
    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);

    return accounts.find(account => account.id === id);
}

module.exports = { getAll, getOne, remove, update, create, getAllTransactions, createTransaction };
