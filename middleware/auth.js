const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function auth(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (token) {
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;
            next();
        } catch(ex) {
            console.log(ex);
            return res.status(400).send("Invalid token");
        }
    } else {
        // its fine, we just dont have the user        
        next();
    }


}

