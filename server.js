const express = require('express')
const app = express()
const db = require('./dbConnector')
const homeRoute=require('./routes/home_page')
const morgan = require('morgan');
const AccountRoute=require('./routes/registration')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan("dev"))


app.get('profile_page', (req, res) => {
    res.send(profile_page)
})

db.dbConnector();

app.use("/api/account",AccountRoute)
app.use("/api/home",homeRoute)


app.use((req,res,next)=>{
    res.status(404)
    res.json({"message":"Endpoint not found boss"})

})

app.use((err,req,res,next)=>{
    res.status(500)
    res.json({"message":err})

})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})