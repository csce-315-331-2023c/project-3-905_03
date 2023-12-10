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
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30m' });
}

function generateRefreshToken(user) {
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

        let query = 'SELECT * FROM employees WHERE email = $1 OR alt_email = $1';
        let userRes = await pool.query(query, [googleUser.email]);
        let user = userRes.rows[0];
        let isEmployee = true;

        if (!user) {
            query = 'SELECT * FROM customers WHERE email = $1';
            userRes = await pool.query(query, [googleUser.email]);
            user = userRes.rows[0];
            isEmployee = false;
        }

        let userForToken = {};

        if (isEmployee) {
            let updateFields = {};
            if (!user.first_name) updateFields.first_name = googleUser.given_name;
            if (!user.last_name) updateFields.last_name = googleUser.family_name;
            if (!user.profile_pic) updateFields.profile_pic = googleUser.picture;

            if (Object.keys(updateFields).length > 0) {
                const setClause = Object.keys(updateFields).map(field => `${field} = '${updateFields[field]}'`).join(", ");
                const updateUserQuery = `UPDATE employees SET ${setClause} WHERE employee_id = $1`;
                await pool.query(updateUserQuery, [user.employee_id]);
            }

            userForToken = {
                employeeId: user.employee_id,
                email: googleUser.email,
                firstName: user.first_name || googleUser.given_name,
                lastName: user.last_name || googleUser.family_name,
                role: user.role,
                profilePic: user.profile_pic || googleUser.picture
            };
        } else {
            let updateFields = {};
            if (!user.first_name) updateFields.first_name = googleUser.given_name;
            if (!user.last_name) updateFields.last_name = googleUser.family_name;
            if (!user.profile_pic) updateFields.profile_pic = googleUser.picture;

            if (Object.keys(updateFields).length > 0) {
                const setClause = Object.keys(updateFields).map(field => `${field} = '${updateFields[field]}'`).join(", ");
                const updateUserQuery = `UPDATE customers SET ${setClause} WHERE user_id = $1`;
                await pool.query(updateUserQuery, [user.user_id]);
            }

            userForToken = {
                customerId: user.user_id,
                email: googleUser.email,
                firstName: user.first_name || googleUser.given_name,
                lastName: user.last_name || googleUser.family_name,
                profilePic: user.profile_pic || googleUser.picture
            };
        }

        const accessToken = generateAccessToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error in Google login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
