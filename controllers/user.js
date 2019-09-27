const User = require('../models/user');

const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

exports.getUser = (req,res,next)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(400).send("Error.. Check the data");
        }
        bcrypt.compare(password,user.password)
        .then(result =>{
            if(result){
                var data = {"data": user._id.toString()};
                return res.send(data);
            }
            else{
                return res.status(400).send("Error.. Check the data");
            }
        })
        .catch(err=>{
            console.log(err);
            return res.status(400).send(err);
        });
    })
    .catch(err=>{
        console.log(err);
        return res.status(400).send(err);
    });
}; 

exports.createUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;
    var salary = req.body.salary;
    User.findOne({$or: [{email: email}, {phone: phone}]})
    .then(user => {
        if(user){
            return res.status(400).send("User already exists for the given data");
        }
        else{
            bcrypt.hash(password, 12)
            .then(hashedPassword => {
                var user = new User({
                    email: email,
                    password: hashedPassword,
                    phone: phone,
                    salary: salary
                });
                return user.save();
            })
            .then(result => {
                return res.send({"mess": "success"});
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err);
            });
        }
    })
};

exports.getUsersByPhone = (req, res, next) => {
    const phone = req.body.phone;
    const userId = req.body.userId;
    if(phone.length < 5){
        return res.send({"data": []});
    }
    else{
        User.find()
        .then(users => {
            return users.filter(user => phone === user.phone.slice(0,phone.length) && user._id.toString() !== userId.toString()).slice(0,5);
        })
        .then(users => {
            return res.send({"data": users});
        })
        .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    }
};