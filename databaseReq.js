const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const routes = require('./Routes/router')
const retiveData = require('./Database/database')
//MYsql DataBase Connection and Run Queryies
const {createPool} = require('mysql')

//Mysql database connection module using "createpool" that is used to do parrallel database queries
const pool = createPool({
    host : "localhost",
    user : "root",
    password : "root123", // We changed the original password to connect with db.
    database:'fastoodb',
    connectionLimit: 10,

})


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const coreOptions = {
    origin : '*',
    credentials : true,
    optionSuccessStatus : 200
}








