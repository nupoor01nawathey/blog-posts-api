const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
        req.userData = decode;
        next();
    }
    catch(error) {
        return res.status(401).json({
            message: 'Auth failed',
            error: error
        });    
    
    }
}