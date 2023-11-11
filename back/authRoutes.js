const express = require('express');
const router = express.Router();
const googleAuthController = require('./googleOAuth');

const validateTokenMiddleware = (req, res, next) => {
    if (!req.body.idToken) {
        return res.status(400).send({ error: 'idToken is required' });
    }
    next();
};


router.post('/verify-google-token', validateTokenMiddleware, googleAuthController.verifyGoogleToken);

module.exports = router;
