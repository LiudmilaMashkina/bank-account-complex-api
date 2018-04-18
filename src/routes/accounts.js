const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/accounts');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

//////////////////
// TRANSACTIONS //

router.get('/:id/transactions', ctrl.getAllTransactions);
router.get('/:id/transactions/:trid', ctrl.getOneTransaction); // <---- HERE
router.post('/:id', ctrl.createTransaction);
// router.put('/id/transactions/:trid', ctrl.updateTransaction);
// router.delete('/id/transactions', ctrl.removeAllTransactions);
// router.delete('/id/transactions/:trid', ctrl.removeTransaction);


module.exports = router;