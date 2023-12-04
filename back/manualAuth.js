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

router.post('/auth/manual/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM employees WHERE email = $1;';
        const dbRes = await pool.query(query, [email]);
        const user = dbRes.rows[0];

        const customerQuery = 'SELECT * FROM customers WHERE email = $1';
        const dbCustomerRes = await pool.query(customerQuery, [email]);
        const customerUser = dbCustomerRes.rows[0];

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const userForToken = {
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.roles,
                    profilePic: user.profile_pic,
                };

                const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } 
        }

        else if (customerUser) {
            const passwordMatch = await bcrypt.compare(password, customerUser.password);
            if (passwordMatch) {
                const customerUserToken = {
                    firstName: customerUser.first_name,
                    lastName: customerUser.last_name,
                    role: 'customer',
                    email: customerUser.email,
                    profilePic: customerUser.profile_pic,
                }

                const token = jwt.sign(customerUserToken, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            }
        }
        else {
            return res.status(404).json({ message: 'Manual Log-In: No User Found' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Manual Log-In: Server Connection Cannot Be Established' });
    }
});

module.exports = router;
