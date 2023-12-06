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
        console.log('Server: Verifying Google ID token');
        const ticket = await client.verifyIdToken({
            idToken: idToken,   
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        console.log('Server: Google ID token verified successfully');
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
    }
}

router.post('/auth/google/login', async (req, res) => {
    console.log('Server: Received Google login request with token:', req.body.idToken);
    const { idToken } = req.body;
    try {

        const googleUser = await verifyGoogleToken(idToken);

        const employeeQuery = 'SELECT * FROM employees WHERE email = $1';
        const employeeRes = await pool.query(employeeQuery, [googleUser.email]);
        const employee = employeeRes.rows[0];
        console.log('Server: Employee query result:', employeeRes.rows);
   
        let customer = null;
        if (!employee) {
            const customerQuery = 'SELECT * FROM customers WHERE email = $1';
            const customerRes = await pool.query(customerQuery, [googleUser.email]);
            customer = customerRes.rows[0];
            console.log('Server: Customer query result:', customerRes.rows);
        }

    
        if (employee || customer) {
            const user = employee || customer;
            const userForToken = {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role || 'customer', 
                profilePic: user.profile_pic,
            };
            console.log('Server: Generating JWT token for user:', userForToken);
            const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.status(200).json({ token });
        } else {
            console.error('Server: Error in /auth/google/login', error);
            res.status(404).json({ message: "Invalid Credentials: User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Error: server is not responding' });
    }
});





module.exports = router;
