const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const retiveData = require('./Database/database')
//MYsql DataBase Connection and Run Queryies
const {createPool} = require('mysql')


const app = express();

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const coreOptions = {
    origin : '*',
    credentials : true,
    optionSuccessStatus : 200
}
app.use(cors(coreOptions))


//Mysql database connection module using "createpool" that is used to do parrallel database queries
const pool = createPool({
    host : "localhost",
    user : "root",
    password : "root123", // We changed the original password to connect with db.
    database:'fastoodb',
    connectionLimit: 10,

})


exports.RetriveData = () => {
    //Retriving Data from DB
    pool.query('SELECT * FROM employee ', (err, res, fields) => {
        if(err){
            console.log('DATABASE ERR : '+err);
        }
        else{
            
            //The "res" retrived result from MySql is come to server as array of Objects[obj1, obj2, obj3 ,...]
            Rdata = res;
            console.log(object);
            return this.Rdata
        }
    })

}


exports.fun =() => {
    console.log(`Method from DBRoutes module`)
}