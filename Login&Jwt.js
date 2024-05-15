const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const routes = require('./Routes/router')
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

//Authencation && JWT token creation
app.post('/login',async(req, res) => {
    //Authencation done here 
        const {username, password} = req.body;

        console.log(`${username}, ${password}`)

        res.cookie('cookie', username)
    }
)


//always write this after all the code
app.use('/',routes)

const PORT = 4000;
app.listen(PORT,() =>{
    console.log("server is running...")
})


