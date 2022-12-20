const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function auth(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send("Access denied: no token provided");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch(ex) {
        console.log(ex);
        res.status(400).send("Invalid token");
    }        
}

