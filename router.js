'use strict';

const LocationController = require("./controller/location-controller")
const UserController = require("./controller/user-controller")
const Auth = require("./middleware/auth")

module.exports = function (app) {
    app.get("/locations", Auth, LocationController.fetchLocations)
    app.get("/monthlyData", Auth, LocationController.fetchMonthlyData)
    app.post("/location", Auth, LocationController.saveLocation)

    app.post("/login", UserController.login)
    app.post("/register", UserController.register)
}