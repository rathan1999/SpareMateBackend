const User = require('../models/user');
const Budget = require("../models/budget");

exports.createBudget = (req,res,next)=>{
    const userId = req.body.userId;
    User.findById(userId)
    .then(user => {
        if(!user){
            return res.status(400).send({"mess": "User not found."});
        }
        else{
            var budget = new Budget({
                userId: user._id,
                amount: user.salary,
            });
            return budget.save().then(result => {
                return res.send({'mess':'Successfully saved.'});
            });
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.updateBudget = (req,res,next)=>{
    const userId = req.body.userId;
    const amt = req.body.amount;
    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        if(!budget){
            return res.status(400).send({"mess": "Budget not created for this user in this month."});
        }
        else{
            return budget.decrement(amt)
            .then(res => {
                return res.send({"mess": "Success"});
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.getBudgetDetails = (req,res,next)=>{
    const userId = req.body.userId;
    let amount;
    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        if(!budget){
            return res.status(400).send({"mess": "Budget not created for this user in this month."});
        }
        else{
            amount = budget.amount;
            return User.findById(userId)
            .then(user => {
                return user.getSalary();
            })
            .then(salary => {
                return res.send({"salary": salary, "budget": amount});
            });
        }
    })
    .catch(err =>{
        console.log(err);
        return res.status(400).send(err);
    });
}