const uuid = require('uuid/v4')
const accounts = []

function getAll (limit) {
  return limit ? accounts.slice(0, limit) : accounts
}

function getOne(id){
    const account = accounts.find(account => account.id === id);

    if(account) {
      return { data: account };
    }
    else {
      return { error: 'account Not Found'};
    }
}

function create (body) {
    const errors = []
    const name = body.name
  
    let response
    if (!name) {
      errors.push('Name is required')
      response = { errors }
    } else {
      const account = { id: uuid(), name }
      accounts.push(account)
      response = account
    }
  
    return response
}

function update(name, id) {
    const account = accounts.find(account => account.id === id);

    if (name && account) {
        account.name = name;
        return {data: account};
    }
    else {
        return { error: 'account Not Found'};
    }
}

function remove(id) {
    const account = accounts.find(account => account.id === id);

    if (account) {
        const index = accounts.indexOf(account);
        accounts.splice(index, 1);
        return {data: account};
    }
    else
        return {error: 'account Not Found'};
}


module.exports = { getAll, getOne, update, remove, create };
