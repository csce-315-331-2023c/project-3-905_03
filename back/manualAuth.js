const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
}

router.post('/auth/manual/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const employeeQuery = 'SELECT * FROM employees WHERE email = $1';
        const employeeRes = await pool.query(employeeQuery, [email]);
        const employee = employeeRes.rows[0];

        let customer = null;
        if (!employee) {
            const customerQuery = 'SELECT * FROM customers WHERE email = $1';
            const customerRes = await pool.query(customerQuery, [email]);
            customer = customerRes.rows[0];
        }

        if (employee || customer) {
            const user = employee || customer;
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const userForToken = {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role || 'customer', 
                    profilePic: user.profile_pic
                };

                const accessToken = generateAccessToken(userForToken);
                const refreshToken = generateRefreshToken(userForToken);

                return res.status(200).json({ accessToken, refreshToken });
            }
        }

        return res.status(401).json({ message: 'Invalid Credentials' });
    } catch (error) {
        console.error('Error in manual login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
