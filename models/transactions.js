const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transaction = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    budgetId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Budget",
    },
    amount:{
        type: Number,
        required: true,
    },
    spendType:{
        type: String,
        enum: ["ENTERTAINMENT", "FOOD", "TRAVEL", "SHOPPING", "HEALTHCARE", "OTHERS"],
        default: "OTHERS",
    },
    created:{
        type: Date,
        default: Date.now,
    },
    poolId:{
        type: mongoose.Types.ObjectId,
        ref: "PoolBudget",
    }
});

module.exports = mongoose.model("Transaction", transaction);