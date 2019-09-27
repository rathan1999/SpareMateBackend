const User = require("../models/user");
const Transaction = require("../models/transactions");
const Budget = require("../models/budget");
f1 = async(cursor,field,res,curUser)=>{
    var transactions = [];
    // console.log("Hello",cursor.length);
    var len = cursor.length;
    var i=0
    cursor.forEach(async(user) => {
        await Transaction.find({userId:user._id})
        .then(trans=>{
            // console.log("Lol");
            transactions= transactions.concat(trans);
            i++;
            if(i==len){
                f3(transactions,field,res,curUser);
            }
        });
    });
        //f2(cursor,transactions);
};
f2 = (cursor,transactions,curUser)=>{
    cursor.on('error',function(err){
        transactions = [];
        return transactions;
    })
}
f3 = (transactions,field,res,curUser)=>{
            
        console.log("here",curUser);
            // console.log("==-=-=-=-=-=-=-=-=-",transactions);
            if(field){
                transactions = transactions.filter(transaction => {
                    return transaction.spendType.toString() === field.toString();
                });
            }
            if(transactions.length == 0){
                return res.send({"data": []});
            }
            transactions.sort((a, b) => {
                var yA = a.created.getFullYear();
                var yB = b.created.getFullYear();
                var mA = a.created.getMonth();
                var mB = b.created.getMonth();
                if(yA < yB)
                    return -1;
                if(yA > yB)
                    return 1;
                if(mA < mB)
                    return -1;
                if(mA > mB)
                    return 1;
                return 0;
            });
            // console.log(transactions);
            var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var y1 = [0];
            var yG = [transactions[0].amount];
            var x = [month[transactions[0].created.getMonth()] + " " + transactions[0].created.getFullYear().toString()];
            var ind1 = 0;
            var indG = 0;
            var sett = [transactions[0].userId];
            for(var i = 1; i < transactions.length; i++){
                if(!(sett.includes(transactions[i].userId)))
                    sett.push(transactions[i].userId);
                var yA = transactions[i].created.getFullYear();
                var yB = transactions[i-1].created.getFullYear();
                var mA = transactions[i].created.getMonth();
                var mB = transactions[i-1].created.getMonth();
                if(yA == yB && mA == mB){
                    yG[indG] += transactions[i].amount;
                }
                else{
                    yG.push(transactions[i].amount);
                    x.push(month[transactions[i].created.getMonth()] + " " + transactions[i].created.getFullYear().toString());
                    indG++;
                }
                if(transactions[i].userId.toString() === curUser.toString()){
                    // console.log("why here");
                    while(ind1 < indG){
                        y1.push(0);
                        ind1++;
                        // console.log("zeros");
                    }
                    // console.log(ind1);
                    y1[ind1] += transactions[i].amount;
                }
            }
            for(var i = 0; i < yG.length; i++)
                yG[i] /= sett.length/10;
            var returnable1 = [];
            for(var i = 0; i < yG.length; i++){
                returnable1.push({"x": x[i], "y": y1[i]});
            }
            var returnable2 = [];
            for(var i = 0; i < yG.length; i++){
                returnable2.push({"x": x[i], "y": yG[i]});
            }
            return res.send({"data": [
                {"seriesName": "Current User", "data": returnable1, "color": "#297AB1"},
                {"seriesName": "Global Users", "data": returnable2, "color": "green"}
            ]});

}
exports.getBandComparison = (req, res, next) => {
    const userId = req.body.userId;
    const delta = req.body.delta;
    const field = req.body.field;
    let curUser;
    let cursor;
    let len;    
    User.findById(userId)
    .then(user => {
        curUser = user._id;
        cursor = User.find({$and: [{salary: {$gt: 0}} , {salary: { $gt: user.salary - user.salary*delta/100 , $lt: user.salary + user.salary*delta/100 }}]}); 
        return cursor;
    })
    .then((cursor)=>f1(cursor,field,res,curUser));//.then((transactions)=>f2(cursor,transactions)).then((transactions)=>f3(cursor,transactions,field));
}

exports.getMonthlyDivision = (req, res, next) => {
    const userId = req.body.userId;

    Budget.findOne({userId: userId}, {}, {sort: {"created": -1}})
    .then(budget => {
        // saveBudgetId = budget._id;
        return Transaction.find({$and: [{userId: userId}, {budgetId: budget._id.toString()}]});
    })
    .then(transactions => {
        var dict = {"ENTERTAINMENT": 0, "FOOD": 0, "TRAVEL": 0, "SHOPPING": 0, "HEALTHCARE": 0, "OTHERS": 0};
        for(var i = 0; i < transactions.length; i++){
            if(transactions[i].spendType in dict)
                dict[transactions[i].spendType] += transactions[i].amount;
            else
                dict[transactions[i].spendType] = transactions[i].amount;
        }
        var colors = ["grey", "red", "yellow", "blue", "orange", "green"];
        var returnable = [
            {"value": dict["OTHERS"], "label": "Others", "color": colors[0]},
            {"value": dict["ENTERTAINMENT"], "label": "Entertainment", "color": colors[1]},
            {"value": dict["FOOD"], "label": "Food", "color": colors[2]},
            {"value": dict["TRAVEL"], "label": "Travel", "color": colors[3]},
            {"value": dict["SHOPPING"], "label": "Shopping", "color": colors[4]},
            {"value": dict["HEALTHCARE"], "label": "Healthcare", "color": colors[5]},
        ];
        return res.send({"data": returnable});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

exports.getTransactions = (req, res, next) => {
    const userId = req.body.userId;
    const field = req.body.field;
    Transaction.find({userId: userId})
    .then(transactions => {
        if(field){
            transactions = transactions.filter(transaction => {
                return transaction.spendType.toString() === field.toString();
            });
        }
        if(transactions.length == 0){
            return res.send({"data": []});
        }
        transactions.sort((a, b) => {
            var yA = a.created.getFullYear();
            var yB = b.created.getFullYear();
            var mA = a.created.getMonth();
            var mB = b.created.getMonth();
            if(yA < yB)
                return -1;
            if(yA > yB)
                return 1;
            if(mA < mB)
                return -1;
            if(mA > mB)
                return 1;
            return 0;
        });
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var y = [transactions[0].amount];
        var x = [month[transactions[0].created.getMonth()] + " " + transactions[0].created.getFullYear().toString()];
        var ind = 0;
        for(var i = 1; i < transactions.length; i++){
            var yA = transactions[i].created.getFullYear();
            var yB = transactions[i-1].created.getFullYear();
            var mA = transactions[i].created.getMonth();
            var mB = transactions[i-1].created.getMonth();
            if(yA == yB && mA == mB){
                y[ind] += transactions[i].amount;
            }
            else{
                y.push(transactions[i].amount);
                x.push(month[transactions[i].created.getMonth()] + " " + transactions[i].created.getFullYear().toString());
                ind++;
            }
        }
        var returnable = []
        for(var i = 0; i < x.length; i++)
            returnable.push({"x": x[i], "y": y[i]});
        return res.send({"data": returnable});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
};