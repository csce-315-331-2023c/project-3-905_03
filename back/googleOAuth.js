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

function generateAccessToken(user) {
    // Generate short-lived access token
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    // Generate long-lived refresh token
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

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
        const employeeQuery = 'SELECT * FROM employees WHERE email = $1';
        const employeeRes = await pool.query(employeeQuery, [googleUser.email]);
        const employee = employeeRes.rows[0];

        let customer = null;
        if (!employee) {
            const customerQuery = 'SELECT * FROM customers WHERE email = $1';
            const customerRes = await pool.query(customerQuery, [googleUser.email]);
            customer = customerRes.rows[0];
        }

        if (employee || customer) {
            const user = employee || customer;
            let userForToken = {
                ...user, 
                email: googleUser.email,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                profilePic: googleUser.picture,
            };

            const accessToken = generateAccessToken(userForToken);
            const refreshToken = generateRefreshToken(userForToken);

            return res.status(200).json({ accessToken, refreshToken });
        } else {
            return res.status(404).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
