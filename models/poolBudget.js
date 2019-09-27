const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const poolBudget = new Schema({
    users:{
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
        required: false,
        default: [],
    },
    name:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    created:{
        type: Date,
        default: Date.now,
    }
});

poolBudget.methods.decrement = function(amount){
    this.amount -= amount;
    return this.save();
}

module.exports = mongoose.model('PoolBudget', poolBudget);