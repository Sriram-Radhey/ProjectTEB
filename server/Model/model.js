const mongo = require('mongoose')

const mongoS = new mongo.Schema({
    task:{
        type :String
    },
    done:{
        type : Boolean,
        default : false
    }
});

const task = mongo.model("Task",mongoS);

module.exports = task;

