const User = require('../model/user-data')
const Bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")

function invalidUserInfo(res) {
    return res.status(400)
        .json({
            message: "Invalid username or password"
        })
}

function serverErrorResponse(res) {
    return res.status(500)
        .json({
            message: "Server problem occured"
        })
}

/**
 * GET
 */
exports.login = async function (req, res) {
    const { username, password } = req.body
    console.log("Username : " + username + " Pass: " + password)

    let user = await User.findOne({ username: username })
    try {
        if (!user) {
            console.log("User not found")
            return invalidUserInfo(res)
        }

        let isValidPassword = await Bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            console.log("Invalid password")
            return invalidUserInfo(res)
        }

        let payload = {
            username: user.username
        }

        JWT.sign(
            payload,
            process.env.SECRETKEY.toString(),
            {
                expiresIn: 36000
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token
                })
            }
        )
    } catch (e) {
        console.log(e)
        serverErrorResponse(res)
    }
}

exports.register = async function (req, res) {
    try {
        const { username, password } = req.body

        let user = await User.findOne({ username: username })
        if (user) {
            throw "Username already exist"
        }

        if (password.length < 6) {
            throw "Password is too short"
        }

        let newUser = User()
        let salt = await Bcrypt.genSalt(10)
        newUser.username = username
        newUser.password = await Bcrypt.hash(password, salt)
        await newUser.save()
        
        res.status(200).json({
            message: "User added"
        })
    } catch (e) {
        console.log(e)
        serverErrorResponse(res)
    }
}