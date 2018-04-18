const uuid = require('uuid/v4')
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, 'accounts_data.json')

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

// ID: (You Choose) A unique id that represents the account. Created automatically.
// Name: (String) Name of the account. Required.
// Bank Name: (String) Name of the bank the account is associated with. Required.
// Description: (String) A description of the account. Required.
// Transactions: (Array) An array of transactions.

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
    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)
    const account = accounts.find(account => account.id === id);

    if (account) {
        const index = accounts.indexOf(account);
        accounts.splice(index, 1);
        const json = JSON.stringify(accounts)
        fs.writeFileSync(file, json)
        return {data: account};
    }
    else
        return {error: 'Account Not Found'};
}


module.exports = { getAll, getOne, remove, update, create };
