const mongoose  = require("mongoose");

function dbConnector() {
    mongoose.connect("mongodb://127.0.0.1/Cash2me").then(()=>{
        console.log("Connected to the db")
    }).catch((err)=>{
        console.log(`Error occured boss ${err}`)
    });

}
module.exports.dbConnector = dbConnector;