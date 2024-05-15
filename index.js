
/* 
    This is not a main file , it is used for text perpose to check whether the functionalities are
    working properly or not at the bigining of the project.
*/

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


//Creating a new Table 
/*  new_table = 'CREATE TABLE students(s_id INT PRIMARY KEY NOT NULL, s_name VARCHAR(30) NOT NULL, fee INT NOT NULL)'
pool.query(new_table, (err, res) => {
    if (err) return console.log('ERROR'+err)
    else{
        return console.log('Table Created')
        console.log('console after return')
    } 
})  */


//Inserting Data into DB
/* q1 = "INSERT INTO employee(emp_id, emp_name, emp_role) VALUES (?,?,?)";
pool.query(q1,[6, 'Ganesh', 'Frontend Developer'], (err, res) => {
    if(err){
        return console.log('DATABASE ERR : '+err);
    }
    return console.log("Data Inserted Successfully");
})
 */


//Updating Data in a Table using 'UPDATE' keyword
/* upd_qry = 'UPDATE employee SET emp_name= "Prasad" WHERE emp_id = 6'
pool.query(upd_qry,(err, res) => {
    if (err) return console.log(err)
    return console.log('Data Updated \n '+res)

}) */

//Deleting data from the Database (rows)
/* del_qry = 'DELETE FROM employee WHERE emp_id=6'
pool.query(del_qry, (err, res) => {
    if(err) return console.log(err)
    return console.log('Row with Id=6 is deleted')
}) */

//Deleting Whole Table using "DROP"
/* del_table = 'DROP TABLE employee'
pool.query(del_table, (err, res) => {
    if (err) return console.log(err)
    return console.log('Table employee is deleted')
}) */

//Retriving Data from DB
/* pool.query('SELECT * FROM employee ', (err, res, fields) => {
    if(err){
         console.log('DATABASE ERR : '+err);
    }
    else{
         
        //The "res" retrived result from MySql is come to server as array of Objects[obj1, obj2, obj3 ,...]
         object = res
         console.log(object[0].emp_name);
    }
}) */


//Direct DB Connection without Frontend 
new_table = 'CREATE TABLE cart(cart_id INT PRIMARY KEY  AUTO_INCREMENT, user_id INT NOT NULL, Item_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id), FOREIGN KEY(item_id) REFERENCES items(item_id));'
items_table = 'CREATE TABLE items(item_id INT PRIMARY KEY, item_name VARCHAR(50) NOT NULL, item_price INT NOT NULL, item_qty DECIMAL NOT NULL, stock_id INT NOT NULL, FOREIGN KEY(stock_id) REFERENCES stock(stock_id));'
stock_table = 'CREATE TABLE stock(stock_id INT PRIMARY KEY AUTO_INCREMENT, stock_qty INT NOT NULL, restock_date DATE NOT NULL)'
const create = () => {  
        pool.query(items_table, (err, res) => {
            if (err) return console.log('ERROR'+err)
            else{
                return console.log('Table Created')
                console.log('console after return') //code after return will not execute
            } 
        }) 
}
//create();


drop_table = 'DROP TABLE items;'
const Drop = () => {
    pool.query(drop_table,  (err, res) => {
        if(err) return console.log(`ERROR : ${err}`)
        else {
            return console.log('Table Deleted')
        }
    })
}
//Drop();

select_users = 'SELECT * FROM users;'
//slecting all the cart Items which are added to cart by a particular user(user_id)
select_join = `SELECT cart_id,item_id FROM 
               users u RIGHT JOIN cart c
               ON u.user_id = c.user_id 
               WHERE u.user_id = 4;`
const Select = () => {
    pool.query(select_join,  (err, res) => {
        if(err) return console.log(`ERROR : ${err}`)
        else {
            object = res // storing all the retrived data to iterate through each of them
            console.log(`-----------`)
            for(i=0; i<object.length; i++){
                //console.log(`| ${object[i].user_id} | ${object[i].user_name} | ${object[i].user_mail } |` )
                console.log(`| ${object[i].cart_id} | ${object[i].item_id} |`)
            }
            console.log(`-----------`)
        }
    })
}
Select();

/* insert_query = `INSERT INTO items(item_id, item_name, item_price, item_qty, stock_id) VALUES(101, 'Onion', 40, 1, 1),(102, 'Chilli', 60, 0.5,2), (103, 'Tamoto', 20, 1,3),
(104,'Brinjal', 30, 1,4),(105,'Carrot', 80, 1,5),(106,'Graps', 40, 0.5,6),(107,'Cabbage', 40, 0.5,7),
(108,'Potato', 30, 1,8);`
insert = `INSERT INTO items(item_id, item_name, item_price, item_qty, stock_id)
 VALUES(108,'Potato', 30, 1,8);` */

//insert_cart = `INSERT INTO cart(user_id,item_id) VALUES (4,103), (4,108);`
const  Insert = () => {
    pool.query(insert_cart, (err, res) =>{
        if(err) return console.log(`ERROR : ${err}`)
        else{
            console.log(`Data Successfully Inserted`)
        }
    })
}
//Insert();


/* 
update_query = `UPDATE items 
                SET stock_id=4
                WHERE item_id=104;` */
const update = () => {
    pool.query(update_query, (err,res) => {
        if(err) return console.log(`ERROR update: ${err}`)
        else{
            console.log(`Data Successfully Updated`)
        }
    })
}
//update()


const retive = retiveData;
//console.log(retive.Rdata())


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const coreOptions = {
    origin : '*',
    credentials : true,
    optionSuccessStatus : 200
}
app.use(cors(coreOptions))

//always write this after all the code
app.use('/',routes)



const PORT = process.env.PORT || 4000;
app.listen(PORT,() =>{
    console.log("server is running...")
})






