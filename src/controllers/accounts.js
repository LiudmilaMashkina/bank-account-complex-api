const model = require('../models/account')
//]]const file = path.join(__dirname, 'db.json')

function getAll (req, res, next) {
    // const contents = fs.readFileSync(file, 'utf-8')
    // const accounts = JSON.parse(contents)

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

module.exports = { getAll, getOne, remove, update, create };
