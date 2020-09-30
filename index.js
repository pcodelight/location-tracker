const express = require("express")
const bodyParser = require("body-parser")
const Route = require("./router")
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 8125
require("dotenv").config()
mongoose.Promise = global.Promise;

function initKinesis(callback) {
    /**
     * Given account is not authorized to perform: kinesis:DescribeStream
     */

    // kinesis.describeStream({ StreamName: process.env.STREAM_NAME }, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //         callback
    //         return
    //     }

    //     if (data.StreamDescription.StreamStatus === 'ACTIVE') callback()
    //     else callback("Stream Status Not Active")
    // })
}

try {
    mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/locationDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} catch (e) {
    console.log(e)
    throw e
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

initKinesis()
Route(app)

app.listen(PORT, (req, res) => {
    console.log(`Server started at port: ${PORT}`)
})