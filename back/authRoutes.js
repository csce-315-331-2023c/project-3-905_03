const express = require('express');
const router = express.Router();
const googleAuthController = require('./googleOAuth');

// Middleware to validate the incoming token (assuming it's in the body)
// This could be a function you define elsewhere to check the structure and presence of the token
const validateTokenMiddleware = (req, res, next) => {
    if (!req.body.idToken) {
        return res.status(400).send({ error: 'idToken is required' });
    }
    next();
};


router.post('/verify-google-token', validateTokenMiddleware, googleAuthController.verifyGoogleToken);

module.exports = router;
