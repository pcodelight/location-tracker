const Location = require("../model/location-data")
const AWS = require('aws-sdk')
const config = require('../aws-config')

const kinesis = new AWS.Kinesis(config)

/**
 * GET
 */
exports.fetchLocations = function (req, res) {
    const { username } = req
    console.log("[REQ] Get All Locations")

    Location.find({ username: username })
        .exec((err, docResult) => {
            if (!err) {
                res.status(200).json(docResult)
            } else {
                res.status(500).json({
                    message: err
                })
            }
        })
}

/**
 * GET
 * Monthly data of requested year
 */
exports.fetchMonthlyData = function (req, res) {
    const { username } = req

    Location.aggregate([
        { "$project": { "username": "$username", "month": { "$month": "$timestamp" }, "year": { "$year": "$timestamp" } } },
        { $match: { "username": username, "year": 2020 } },
        { "$group": { "_id": "$month", "count": { "$sum": 1 } } }
    ]).exec((err, docResult) => {
        if (!err) {
            let filledResult = []
            for (_month = 1; _month <= 12; _month++) {
                let dataCount = docResult.find(data => data._id === _month)
                filledResult.push({
                    month: _month,
                    count: dataCount == null ? 0 : dataCount.count
                })
            }
            res.status(200).json(filledResult)
        } else {
            res.status(500).json({
                message: err
            })
        }
    })
}

/**
 * POST 
 */
exports.saveLocation = async function (req, res) {
    try {
        const { username } = req
        const { latitude, longitude, ip_address, timestamp } = req.body
        console.log("Request Lat: " + latitude + " Lng: " + longitude)

        let locationData = Location()
        locationData.username = username
        locationData.latitude = latitude
        locationData.longitude = longitude
        locationData.ip_address = ip_address
        locationData.timestamp = JSON.stringify(timestamp)

        await locationData.save()
        res.status(200).json(locationData)

        // let awsNotes = ""
        // sendDataToKinesis(longitude, latitude, ip_address, timestamp, async (err) => {
        //     if (err) {
        //         awsNotes = err
        //         throw "Kinesis can't send data " + err
        //     } else {
        //         await locationData.save()
        //         res.status(200).json(locationData)
        //     }
        // })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Can not save to database, reason " + e
        })
    }
}

function sendDataToKinesis(long, lat, ipAddress, time, callback) {
    let _loc = {
        latitude: lat,
        longitude: long,
        time: time,
        ipaddress: ipAddress
    }

    let randomNumber = Math.floor(Math.random() * 100000)
    let data = {
        Data: JSON.stringify(_loc),
        StreamName: process.env.STREAM_NAME.toString(),
        PartitionKey: 'pk-' + randomNumber
    }

    kinesis.putRecord(data, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            callback()
            console.log("Data sent")
            console.log(data)
        }
    })
}