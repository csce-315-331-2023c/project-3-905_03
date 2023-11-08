const jwtDecode = require('jwt-decode');
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyGoogleToken = async (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is not set in the environment variables.");
    }

    
    console.log(req.body); 

    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();



        res.status(200).json({ message: 'Token verified', user: payload });
    } catch (error) {
        res.status(400).json({ message: 'Token verification failed', error: error.toString() });
    }
};