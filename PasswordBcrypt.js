
//MYsql DataBase Connection to Run Queryies
const {createPool} = require('mysql')

//Importing bcrypt module/libreary
const bcrypt = require('bcrypt')

//Importing whole "database.js" module to use the functions of it to do DB operations
const dbModule = require('./Database/database')

//Mysql database connection module using "createpool" that is used to do parrallel database queries
const pool = createPool({
    host : "localhost",
    user : "root",
    password : "root123", // We changed the original password to connect with db.
    database:'fastoodb',
    connectionLimit: 10,

})

//converting the password into hash code for security purpose by using async function "bc"
const bc = async(password) => {
    
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword;

}


exports.hashPwd = bc;


