const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/user');
const budgetRoutes = require("./routes/budget");
const transactionRoutes = require("./routes/transaction");
const poolBudgetRoutes = require("./routes/poolBudget");
const analyticsRoutes = require("./routes/analytics");

const url="mongodb+srv://username:password@cluster0-li5nk.mongodb.net/Backend";

app.use(bodyParser.urlencoded({extended:true}));

app.use('/user',userRoutes);
app.use('/budget', budgetRoutes);
app.use('/transaction', transactionRoutes);
app.use('/pool', poolBudgetRoutes);
app.use('/analytics', analyticsRoutes);

app.use((req,res)=>{
    res.send("Hello World");
});

mongoose.connect(url,{useNewUrlParser:true})
.then(result=>{
    console.log("Connected");
    app.listen(8484);
})
.catch(err=>{
    console.log(err);
})