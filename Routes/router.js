const express = require('express')
const router = express.Router();
//importing Json for example purpose from a separate data module.
const userlistData = require('./JsonData')
const {createPool} = require('mysql');
const { Int } = require('msnodesqlv8');

//Mysql database connection module using "createpool" that is used to do parrallel database queries
const pool = createPool({
    host : "localhost",
    user : "root",
    password : "root123", // We changed the original password to connect with db.
    database:'company',
    connectionLimit: 10,

})


const data = userlistData;

const clientData = []





//Get Request
router.get('/tweets', (req, res) => {
    
/*
    res.send(JSON.stringify(str));
    console.log(res.end(JSON.stringify(str))) 
*/
    //sending only json data to the route
    //res.json(data)

    //sending the data to the particular route independent of any data type(json,arrays,plain-text,etc...)
    res.send(data); //sending json data, in client side we must write code to handle & store it 
    res.end();
});

/* router.post('/postuser', (req,res) => {
    //The data sent from the client/frontend will strored in this variable 'receivedData' .
    const receivedData = JSON.stringify(req.body);
    
    //console.log(typeof(req.body))
    console.log(`Data recived from frontend successfully, ${receivedData}`);
    res.send('FROM SERVER : Data Recived from Frontend')
    res.end();
}); */

//POST method that access to data sent from client and add that into existed List of JSON variable
router.post('/controledcompo',(req, res) => {
    const data = JSON.stringify(req.body); //This data in string format
    const jsonObj = JSON.parse(data); // converting string data into Json Data
    //Anonumus Function directly called when executtion approch it.
    {
        //This is the place we need to change the formate of data and send it to DB to store. 
        userlistData.push(jsonObj)
    }
    res.send(`FROM SERVER : Data Recived`)
    


    console.log(userlistData)
    console.log(typeof(userlistData[0]))
    console.log(typeof(jsonObj))
})

/* global Id to store which Id is given to change the data , in some cases whether user want to change the Id also
In that case if we use local id variable in "PUT" method there might be chance of change data of other id users
 */
let gid; 

//PUT method that recive ID from frontendand serch for the user details by Id and send the all details to frontend
router.post('/updatedata', (req,res) => {
    //Destructuring values from req body
     gid = req.body.id
    console.log(gid)
    const format = {fromat : 'object'}
    //filtering the UserlistData Array of JSON
    const idData =  userlistData.filter(
        (ele) => {
            return ele.id== gid;
        }
    )
    if(idData.length == 0){
        res.send(`No User Found By That Id = ${gid}, `)
        //we can use only one res.send() in a request
        //res.send(`{format : 'obj'}`)
    }
    else{
        res.send(idData);

    }
    console.log(idData)   
})


//PUT method we recive the data to update in DB we write the Query to update where Id=gid(given id)
router.put('/updatedata', (req,res) => {
    const {id, name, role} = req.body;

    //filtering the user with id 1 and update the data
/*     const user = userlistData.filter(
        (ele) => {
            return ele.id = gid;
        }
    ) */
    console.log(id)
    const userIndex = userlistData.findIndex(item => item.id === gid);

    if (userIndex === -1) {
        // User with the given ID not found, send an error response
        res.status(404).send('User not found');
    } else {
        // Update the user's data
        userlistData[userIndex].id = id;
        userlistData[userIndex].name = name;
        userlistData[userIndex].role = role;

        console.log(userlistData[userIndex]);

        res.send('Data Updated Successfully');
    }
    
    console.log("Json[0] = "+ userlistData[0].name)

})



//DATA BASE OPERATIONS

//DataBase data retriving
router.get('/getquery', (req, res) => {
    pool.query('SELECT * FROM employee', (err, results, fields) => {
      if (err) {
        console.log('DATABASE ERR: ' + err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // The "results" retrieved from MySQL is an array of objects
       // console.log(results);
        res.json(results);
      }
    });
  });


  //InsertData 
router.post('/dbinsert', (req, res) => {

    const {id, name, role} = req.body;
    q1 = "INSERT INTO employee(emp_id, emp_name, emp_role) VALUES (?,?,?)";

    pool.query(q1,[id, name, role], (err, result) => {
        if(err){
                return console.log('DATABASE ERR : '+err);            
        }
        return console.log("Data Inserted Successfully");
        
    })
    
    res.send('Data Inserted Into Data Base');
})
  







module.exports = router;