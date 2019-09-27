// const User = require('../models/user');
const Budget = require("../models/budget");
const Transaction = require("../models/transactions");
const PoolBudget = require("../models/poolBudget");

exports.createTransaction = (req,res,next)=>{
    const userId = req.body.userId;
    const amount = req.body.amount;
    const spendType = req.body.spendType;
    const poolId = req.body.poolId;
    console.log(userId,amount,spendType,poolId);
    let saveBudget;
    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        saveBudget = budget;
        var transaction = new Transaction({
            budgetId: budget._id,
            userId: userId,
            amount: amount,
            spendType: spendType,
            poolId: poolId,
        });
        return transaction.save();
    })
    .then(result => {
        return saveBudget.decrement(amount);
    })
    .then(result => {
        return res.send({"mess": "Transaction added successfully"});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.createPoolTransaction = (req,res,next)=>{
    const userId = req.body.userId;
    const amount = req.body.amount;
    const spendType = req.body.spendType;
    const poolId = req.body.poolId;
    let saveBudget;
    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        saveBudget = budget;
        var transaction = new Transaction({
            budgetId: budget._id,
            userId: userId,
            amount: amount,
            spendType: spendType,
            poolId: poolId,
        });
        return transaction.save();
    })
    .then(result => {
        return saveBudget.decrement(amount);
    })
    .then(result => {
        return PoolBudget.findById(poolId)
        .then(pool => {
            return pool.decrement(amount);
        });
    })
    .then(result => {
        return res.send({"mess": "Transaction added successfully"});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.getTransactionsByUserId = (req,res,next)=>{
    const userId = req.body.userId;
    const field = req.body.field;
    Transaction.find({userId: userId})
    .then(transactions => {
        if(field){
            transactions = transactions.filter(transaction => transaction.spendType.toString() === field.toString());
        }
        return res.send({"data": transactions});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.getTransactionsByBudgetId = (req,res,next)=>{
    const userId = req.body.userId;
    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        return Transaction.find({budgetId: budget._id})
        .then(transactions => {
            return res.send({"data": transactions});
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}