const JWT = require("jsonwebtoken")

module.exports = async function (req, res, next) {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json({ message: "Authentication Failed" })

    try {
        let decodedUser = JWT.verify(token, process.env.SECRETKEY.toString())
        req.username = decodedUser.username
        next()
    } catch (e) {
        console.error(e)
        res.status(403).send({ message: "Invalid Auth" })
    }
}