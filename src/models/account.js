const uuid = require('uuid/v4')
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, 'accounts_data.json')
const transactionsFile = path.join(__dirname, 'transactions_data.json')

function getAll (limit) {
    const contents = fs.readFileSync(file, 'utf-8')
    const accounts = JSON.parse(contents)
    return limit ? accounts.slice(0, limit) : accounts;
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
    const account = findAccount(id);

    if (account) {
        const transactions = getArrayOfTransactions(account.transactions);
        return { data: transactions };
    }
    else
        return { error: 'Account Not Found'};
}

function getOneTransaction(id, trid) {
    const account = findAccount(id);
    if (account) {
        const transactions = getArrayOfTransactions(account.transactions);
        const transaction = transactions.find(transaction => transaction.id === trid);
        if (transaction) return { data: transaction };
        else return { error: 'Transaction Not Found'};
    }
    else return { error: 'Account Not Found'};
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

            writeTransaction(transaction);

            account.transactions.push(transaction.id);
            const json = JSON.stringify(accounts);
            fs.writeFileSync(file, json);

            response = transaction;
        }
    }
    else {
        errors.push('Account not found');
        response = { errors };
    }

    return response
}

function updateTransaction(id, trid, body) {
    const account = findAccount(id);

    if (account) {
        const transactionInAccount = account.transactions.find(transaction => transaction === trid);
        
        if (transactionInAccount) {
            const transactionsContents = fs.readFileSync(transactionsFile, 'utf-8');
            const allTransactions = JSON.parse(transactionsContents);
            const transaction = allTransactions.find(transaction => transaction.id === trid);
            
            if (transaction) {
                // const title = body.title;
                // const amount = body.amount;
                // const pending = body.pending;

                // if (title) transaction.title = title;
                // if (amount) transaction.amount = amount;
                // if (pending) transaction.pending = pending;

                updateTransactionProps(transaction, body.title, body.amount, body.pending);

                const trJSON = JSON.stringify(allTransactions);
                fs.writeFileSync(transactionsFile, trJSON);

                return { data: transaction };
            }
            else return { error: 'Transaction Not Found in Transactions'};
        }
        else return { error: 'Transaction Not Found in the Account'};
    }
    else return { error: 'Account Not Found'};
}

function removeTransaction(id, trid) {
    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);
    const account = accounts.find(account => account.id === id);

    if (account) {
        const transactionInAccount = account.transactions.find(transaction => transaction === trid);
        
        if (transactionInAccount) {
            const transactionsContents = fs.readFileSync(transactionsFile, 'utf-8');
            const allTransactions = JSON.parse(transactionsContents);
            const transaction = allTransactions.find(transaction => transaction.id === trid);

            if (transaction) {
                const trIndex = account.transactions.indexOf(transactionInAccount);
                account.transactions.splice(trIndex, 1);
                
                const toAccounts = JSON.stringify(accounts);
                fs.writeFileSync(file, toAccounts);

                const indexJSON = allTransactions.indexOf(transactionInAccount);
                allTransactions.splice(indexJSON, 1);

                const trJSON = JSON.stringify(allTransactions);
                fs.writeFileSync(transactionsFile, trJSON);

                return { data: transaction };
            }
            else return { error: 'Transaction Not Found in Transactions'};
        }
        else return { error: 'Transaction Not Found in the Account'};
    }
    else return { error: 'Account Not Found'};
}

///// helper funcs
function writeTransaction( transaction ) {
    const transactions_contents = fs.readFileSync(transactionsFile, 'utf-8');
    const transactions = JSON.parse(transactions_contents);
    transactions.push(transaction);

    const tr_json = JSON.stringify(transactions);
    fs.writeFileSync(transactionsFile, tr_json);
}

function getArrayOfTransactions(arr_ids) {
    const contents = fs.readFileSync(transactionsFile, 'utf-8');
    const transactions = JSON.parse(contents);

    const filteredTransactions = transactions.filter(transaction => arr_ids.includes(transaction.id));

    return filteredTransactions;
}

function findAccount(id) {
    const contents = fs.readFileSync(file, 'utf-8');
    const accounts = JSON.parse(contents);

    return accounts.find(account => account.id === id);
}

function updateTransactionProps(transaction, title, amount, pending) {
    if (title) transaction.title = title;
    if (amount) transaction.amount = amount;
    if (pending) transaction.pending = pending;
}

module.exports = { getAll, getOne, remove, update, create, getAllTransactions, createTransaction, getOneTransaction, updateTransaction, removeTransaction };
