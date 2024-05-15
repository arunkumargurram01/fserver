import express  from 'express'

import ServerlessHttp form 'ServerlessHttp';

const app = express()

app.get('/.netlify/function/api', (req, res) => {
    return res.json({
        msg : "hello wolrd"
    })
}) 

module.exports.handler = ServerlessHttp(app)

module.exports.handler = async(event, context) => {
    const result = await handler(event,context)
    return  result;
}