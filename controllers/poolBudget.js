const User = require('../models/user');
const Transaction = require("../models/transactions");
const PoolBudget = require("../models/poolBudget");

exports.createPoolBudget = (req,res,next) => {
    const userId = req.body.userId;
    var users = req.body.users;
    if(!users)
        users = [];
    if(!users.includes(userId))
        users.push(userId);
    console.log(users);
    const amount = req.body.amount;
    const name = req.body.name;
    console.log(typeof(users), users, amount);
    var poolBudget = new PoolBudget({
        users: users,
        name: name,
        amount: amount,
    });
    poolBudget.save()
    .then(result => {
        return res.send({"mess": "Pool Created Successfully"});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.getAllPools = (req, res, next) => {
    const userId = req.body.userId;
    PoolBudget.find()
    .then(pools => {
        return pools.filter(pool => {
            return pool.users.includes(userId);
        });
    })
    .then(pools => {
        return pools.map(pool => {
            return {"name": pool.name, "amount": pool.amount};
        });
    })
    .then(obj => {
        return res.send({"data": obj});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}