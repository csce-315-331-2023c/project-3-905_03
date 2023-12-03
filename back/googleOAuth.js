const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const pool = new Pool({
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
});

async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid Google ID token');
    }
}

router.post('/auth/google/login', async (req, res) => {
    const { idToken } = req.body;
    try {
        const googleUser = await verifyGoogleToken(idToken);

        const query = 'SELECT * FROM employees WHERE email = $1';
        const dbRes = await pool.query(query, [googleUser.email]);
        const user = dbRes.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Google OAuth Sign-In Failure: invalid credentials' });
        }

        const userForToken = {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.roles,
            profilePic: user.profile_pic,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Error: server is not responding' });
    }
});

module.exports = router;
