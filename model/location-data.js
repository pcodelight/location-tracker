const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const LocationSchema = mongoose.Schema({
    username: {
        required: true,
        type: String,
    },
    latitude: {
        required: true,
        type: Number,
    },
    longitude: {
        required: true,
        type: Number,
    },
    ip_address: {
        required: true,
        type: String,
    },
    timestamp: {
        required: true,
        type: Date,
    }
})

LocationSchema.plugin(AutoIncrement, { inc_field: 'id' })
module.exports = mongoose.model("location", LocationSchema)