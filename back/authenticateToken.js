const jwt = require('jsonwebtoken');

const allowRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; 
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: "Access denied" });
        }
    };
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken , allowRole};
