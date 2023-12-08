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
        console.log(googleUser);
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
            console.log(user);
            let userForToken = {};

            if (employee) {
                userForToken = {
                    employeeId: user.employee_id,
                    createdAt: user.created_at,
                    preferredName: user.preferred_name,
                    email: googleUser.email,
                    altEmail: user.alt_email,
                    phone: user.phone,
                    address: user.address,
                    firstName: googleUser.first_name,
                    lastName: googleUser.last_name,
                    role: user.role,
                    profilePic: googleUser.picture,
                    emergencyContactFirstName: user.emergency_contact_first_name,
                    emergencyContactLastName: user.emergency_contact_last_name,
                    emergencyContactPhone: user.emergency_contact_phone
                };
            } else {
                userForToken = {
                    createdAt: user.created_at,
                    customerID: user.user_id,
                    firstN: googleUser.first_name,
                    lastName: googleUser.last_name,
                    email: googleUser.email,
                    profilePic: googleUser.picture,
                };
            }

            const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ token});
        } else {
            return res.status(404).json({ message: "User Not Found" });
        }   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;
