const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
    email:{
        type:String,
        required:true,
    },
    phone:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    salary:{
        type: Number,
    }
});

user.methods.getSalary = function(){
    return this.salary;
};

user.methods.updateSalary = function(amt){
    this.salary = amt;
    return this.save();
};

user.methods.decrementSalary = function(amt){
    this.salary -= amt;
    return this.save();
}


module.exports = mongoose.model('User',user);