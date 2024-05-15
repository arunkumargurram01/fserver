const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
//const routes = require('./Routes/router')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const app = express();

//importing ServerlessHttp for netlify
const serverless =  require('serverless-http')

//importing user defined Database Operations module
const dbModule = require('./Database/database')

//IMporting HAshing module form "passwordCheck.js"
const hfModule = require('./PasswordBcrypt')

//JWT Module
const jwt = require('jsonwebtoken')
require('dotenv').config();


app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())


/* app.use(bodyParser.urlencoded({extended:false}))
const coreOptions = {
    origin: 'http://localhost:3000', // Update with your frontend port
    credentials: true,
    optionSuccessStatus: 200
  }; */
  app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
  }));
  




const getToken = async(username,password) => {
    try{
        const userDetails = await dbModule.credentialsCheck(username);
        const user_Id = userDetails.user_Id;

        console.log('You are logged In');
        const accessToken = jwt.sign({user_Id}, process.env.ACCESS_TOKEN_SECRET) //using uid as payload for serilization and to find a specific user for db operations & authorization in sub sequent requests
        res.cookie('JWTcookie', accessToken );
        res.json({"token" :accessToken, "acess": true,"username":username})
        return user_Id;
            
/*         if(await bcrypt.compare(password, userDetails.user_Pwd)){
            //sending the token to the client for sub sequent requests authorization
        }
        else{
            //console.log('Incorrect Password')
            res.json({"acess": false,"reason":"Incorrect Password"})
        }  */       
    }
    catch(err){
        console.log(`ERROR IS : ${err}`)
        res.sendStatus(401); 
    }
}


//Cookies sending testing routes and data 
/* app.get('/',(req, res) => {
    res.cookie("cokkieName", "cookieData");
    res.json({'status' : 'ok'});
    console.log(`/ route called`)
 })
app.get('/vegetables',(req, res) => {
    res.cookie("cookie", Date.now(), {httpOnly : true})
    res.json({'status' : 'ok'});
    console.log(`/login route get method called`)
 }) */

//for signup (newly creating account by giving name & password)
app.post('/signup',async(req, res) => {
    const {username, password, mail} = req.body
    console.log(`user Details JWT: ${mail}`)
    try {
        const checkUserMail = await dbModule.checkMail(mail);
        //console.log(checkUserMail.length)
        if(checkUserMail.length === 0){
            
        //hashing the user given pwd by using salting and hasing in method(hashPwd()) which is declred in other module(page)
            const hfoperation = await hfModule.hashPwd(password); //hfmodule.hashpwd method code imported from other page
            const dboperation = await dbModule.insertData(username, hfoperation, mail);
            const userDetails = await dbModule.credentialsCheck(mail);
            //console.log(`After DB Query userDetails: ${userDetails.user_Id}`);
        
            //Creating JWT token by adding user_id into it  and sending as a cookie to the client
            const accessToken = jwt.sign({ user_Id: userDetails.user_Id }, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('JWTcookie', accessToken);
            res.json({"access": true, "username": username });
            // Setting cart_id value 
            const cart_id = await dbModule.createCartId(userDetails.user_Id);
            
            //Create the user Specific Cart Table
            const createTable = await dbModule.CartTable(userDetails.user_Id)
            //console.log(`CreateUserCart table : ${createTable}`)
        }
        else{
            //console.log(`Mail already exists`)
            res.json({"acess": false,"reason":"dup mail"})
        }
    } catch (err) {
        res.json({"acess": false,"reason":"dup mail"})
        console.log(`ERROR IS From SignUp: ${err}`);
        //res.sendStatus(401);
    }

})


//Authencation && JWT token creation
 app.post('/login',async(req, res) => {
//Authencation done here 
    const {mail, password} = req.body;
    //console.log(`cookies : ${req.cookies.cokkieName}`)
    try {
        //DB query method from "database.js" to check the user is present or not and retrive the user details for serilization
            const userDetails = await dbModule.credentialsCheck(mail);
            const user_Id = userDetails.user_Id
            //console.log('Data from JWT = ', userDetails.user_Id);
            //comparing given password and existed passwords using "bcrypt.compare()" method in DBMS.
            //we search in the DBMS by user given name here to check password
//we can't include passwords in serilization here bcs we serilize this "user" with webToken that webtoken can expose passwords.
//but we can use any other deatisl like mail or user Id given In data base etc..
            if(await bcrypt.compare(password, userDetails.user_Pwd)){
                console.log('You are logged In')
/* create jwt token by serilizing the "user" object only after if the authentication 
 is successful and use it for user db operations by accessing the name from token sent from client.
 Don't use sensitive data like passwords for token serlilization.
     */         const accessToken = jwt.sign({user_Id}, process.env.ACCESS_TOKEN_SECRET) //using uid for serilization and to find a specific user for db operations & authorization in sub sequent requests
                
                //sending the token to the client for sub sequent requests authorization
                res.cookie('JWTcookie', accessToken );
                res.json({"access": true})
            }
            else{
                //console.log('Incorrect Password')
                res.json({"acess": false,"reason":"pwd"})
            }        
    }
    catch(err)//when there is no user found in the db method it rejects the promise that result in err in catch in this module.
    {
        console.log(`ERROR IS : ${err}`)
        //res.sendStatus(401); 
        res.json({"acess": false,"reason":"mail"})
    }

}) 

//Admin Login code 
app.post('/adminlogin',async(req, res) => {
    //Authencation done here 
        const {mail, password} = req.body; 
        //console.log(`cookies : ${req.cookies.cokkieName}`)
        try {
            console.log(`working...`)
            //DB query method from "database.js" to check the user is present or not and retrive the user details for serilization
            const userDetails = await dbModule.admincredentialsCheck(mail);
            //console.log(`adminlogin : ${userDetails}`)
            const user_Id = userDetails.user_Id
            //console.log('Data from JWT = ', userDetails.user_Id);
         if(await bcrypt.compare(password, userDetails.user_Pwd)){
                    console.log('You are logged In')
                    const accessToken = jwt.sign({user_Id}, process.env.ACCESS_TOKEN_SECRET) //using uid for serilization and to find a specific user for db operations & authorization in sub sequent requests
                    
                    //sending the token to the client for sub sequent requests authorization
                    res.cookie('JWTcookie', accessToken );
                    res.json({"access": true})
                }
                else{
                    //console.log('Incorrect Password')
                    //console.log(`working...`)

                    res.json({"acess": false,"reason":"pwd"})
                }        
        }
        catch(err)//when there is no user found in the db method it rejects the promise that result in err in catch in this module.
        {
            console.log(`ERROR IS : ${err}`)
            //res.sendStatus(401); 
            res.json({"acess": false,"reason":"mail"})
        }
    }) 

//Creating a middleware function to check the token and user details whether the token is vailed or not 
//this method we allocate to every other route after a user logged in for cheking thire token validity
const authenticateToken = (req, res, next)  => {
    //console.log(`Middle ware called`)
    token = req.cookies.JWTcookie;
     try{
   // const token = req.cookie.token;
   // console.log('Cookiee = ', token)
    if(token==null) {
        //console.log(`No token avialable`)
        return res.sendStatus(401)
       // return res.json({"status": "User Not Loged In"})
    }
    //comparing jwt token which comes from client request and real token secretKey && userdata by using "jwt.verify()" method 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if(err){
            //console.log(`From Middleware Token not valied`)
            return res.sendStatus(401)
        }
        //username extracted from the "JWT" token payload sent from the user for db operations
        req.userId = decode.user_Id //here payload is "user_Id"
        //console.log(`From middleware : ${req.userId}`)
        next() //This will allow use to the next step in the "/users" and all other which needs needsto check JWT in route GET method.
    }) 
  }
  catch(err){
     //console.log(`ERROR IN Middleware : ${err}`)
     res.status(401);
  }
}

//The all routes after signin and login must be checked by "authenticateToken" middleware, then proceed to next operations

app.post('/islogin',authenticateToken,async(req, res) => {
    const {Item} = req.body;
    //console.log(req.user)
    try{
          //res.json(`{"status" : "User with Id ${req.user} is logged in and Items can added to Cart"}`)
           res.json({'status' : true})
           //console.log(`user loggedIn`)
    }
    catch(err){
        console.log(err)
    }
})


app.post('/addcart',authenticateToken,async(req, res) => {
    const {pid} = req.body; //destructring and acessing the object item by its name in the req body
    //const userId = req.userId;
        try{
            if(pid != undefined){
                const cartres = await dbModule.addToCart(req.userId, pid);//directly accessing "userId" 
                //console.log(`Data resloved from DB : ${cartres}`)
                res.json({'data from server ' : true})
            }
            else{
                //console.log(`Product Id is not avialable`)
            }
        }
        catch(err){
            console.log(`Err from addcart route: ${err} `)
        }
})

app.get('/cartdata',authenticateToken, async(req, res) => { //To send user cart Data to the frontend by seraching in the DB
    //const userId = req.userId;
    try{
        const dbres = await dbModule.cartData(req.userId); //The data retrived from the DB will send as list of an array
        //console.log(`Data resloved from DB : ${dbres}`)
        dbres.forEach((item, index) => {
            //console.log(`Item ${item.s_no}:`, item);
        });
        res.send(dbres.reverse())
    }
    catch(err){
        console.log(`Err from addcart route: ${err} `)
    }
})

//To Deleting the Cart Item Of a particular user by using userCartTableId and s_no from frontend
app.post('/delitem',authenticateToken,async(req, res)=> {
    const {s_no} = req.body;
    console.log(`s_no : ${s_no}`);
    try{
        const dbres = await dbModule.delItem(req.userId, s_no);
        res.json({'execution' : true})
    }
    catch(err){
        console.log(`ERR from /delItem : ${err}`)
    }
} )


//Route to get user details to display on the profile page
app.get('/userprofile',authenticateToken,async(req,res) => {
    try{
        const dbres = await dbModule.profileData(req.userId); //The data retrived from the DB will send as list of an array
/*         dbres.forEach((item, index) => {
            console.log(`Item :`, item);
        }); */
        //console.log(`Item :`, dbres);
        res.json(dbres)
    }
    catch(err){
        console.log(`ERR In userdetails Route : ${err}`);
    }
})

//Route to send all user details to send Admin
app.get('/allusers',authenticateToken,async(req, res) => {
    try{
        console.log(req.userId)
        const adminCheck = await dbModule.adminCheck(req.userId);
        //console.log(adminCheck)
        if(adminCheck.length !=0){
            const result = await dbModule.allUsers();
            // console.log(`result from alluseres : ${result}`)
            res.json(result)
        }
        else{
            res.json({'acess':false,'reason':'not admin'})
        } 
    }
    catch(err){
        console.log(`Err From allusers route : ${err}`);
        res.json({'acess':false,'reason':'not admin'})
    }
})



/* data request from client by including "jwt" in request, and we check the "jwt" token with "authentcateToken" fun
   and filter the data and provide only data related to that specific given "name" of user here
*/
//We must check the authorization by token comparing for every reqest from the client after successful login by using "authenticateToken"
app.get('',authenticateToken, (req, res) => {

/*     const userCredentialsHeader = req.headers['usercredentials'];
    const uname = userCredentialsHeader && JSON.parse(userCredentialsHeader).username;

    console.log(`From User : ${uname}`)
    //This line of code and data is replaced by Data Base DBMS query
    const  userData = users.filter(user => user.name === uname);
    console.log(userData)
    res.json(userData) */
/*   In the above line we are acessing the name of the user send by the request(name), But see this is
     a "GET" request but also we are acessing name from the "JWT", In "authenticateToken" fun we create
     we can pass some data to server in GET method also by writing in "headers" and acess it like we done "userCredentials"
*/
})

app.get('/dashboard', authenticateToken, (req,res) => {
    //console.log(`dashboard route will execute `)
    const userId = req.userId;
    console.log(`user verified : ${userId}`)
    
    //This line of code and data is replaced by Data Base DBMS query
    //const  userData = users.filter(user => user.name === uname);
    //console.log(`from dashboard route : ${uname}`

    res.cookie("dashboardcookie", "cookieData");
    res.json({'status' : 'ok', 'UserId' : userId});

    //res.json(userData) 
})


//other module methods accessing 
// Use an async function to wait for the data to be retrieved
const fetchData = async () => {
    try {
        const dbdata = await dbModule.retriveData(1);
       // console.log(dbdata);
    } catch (error) {
        console.error(`ERROR Occurred: ${error}`);
    }
}
// Call the async function to retrieve and use the data
fetchData();



//always write this after all the code
//app.use('/',routes)

//here "process.env.PORT" is used to run our serveron the deployed host domain when we depoly our projrct. here we used
// or 3002 because the code will autometically run on deployed server if it is deployed if not it runs server on localhost PORT 3002
const PORT = process.env.PORT || 3002; //process.env.PORT is importent to run server on deployed/hosted in domain.
app.listen(PORT,() =>{
    console.log("server is running...")
})




