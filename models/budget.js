const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const budget = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
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

budget.methods.decrement = function(amt){
    this.amount -= amt;
    return this.save();
}

module.exports = mongoose.model('Budget', budget);