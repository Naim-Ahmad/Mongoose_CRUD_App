const jwt = require('jsonwebtoken')
const checkLogin = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userName = decoded.name
        req.userId = decoded.id
        next()
    } catch {
        next("Authentication failure!")
   }
}
module.exports = checkLogin