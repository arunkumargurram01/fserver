const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')

//importing user defined modules
const dbmodule = require('./Database/database')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const coreOptions = {
    origin : '*',
    credentials : true,
    optionSuccessStatus : 200
}
app.use(cors(coreOptions))



//other module methods accessing 
// Use an async function to wait for the data to be retrieved
const fetchData = async () => {
    try {
        const dbdata = await dbmodule.retriveData();
        console.log(dbdata);
    } catch (error) {
        console.error(`ERROR Occurred: ${error}`);
    }
}
// Call the async function to retrieve and use the data
fetchData();


const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`)
})