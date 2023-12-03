const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
});

const logMessage = (action, message) => {
    console.log(`Action: ${action} | Info: ${message}`);
};

router.post('/auth/manual/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM employees WHERE email = $1;';
        const dbRes = await pool.query(query, [email]);
        const user = dbRes.rows[0];
        if (!user) {
            logMessage('ManualLogin', 'User not found');
            return res.status(404).json({ message: 'Manual Log-In: Unauthorized Access Attempt' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            logMessage('ManualLogin', 'Login successful');
            return res.status(200).json({
                message: 'Manual Log-In: Valid Credentials',
                user: {
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.roles,
                    profilePic: user.profile_pic,
                    profileComplete: user.profile_complete
                }
            });
        } else {
            logMessage('ManualLogin', 'Invalid credentials');
            return res.status(401).json({ message: 'Manual Log-In: Invalid Credentials' });
        }
    } catch (error) {
        logMessage('ManualLogin', 'Server error');
        return res.status(500).json({ message: 'Manual Log-In: Server Connection Cannot Be Established' });
    }
});

router.post('/auth/google/login', async (req, res) => {
    const { userEmail, userFirstName, userLastName } = req.body;
    try {
        const query = 'SELECT * FROM employees WHERE email = $1 AND first_name = $2 AND last_name = $3';
        const dbRes = await pool.query(query, [userEmail, userFirstName, userLastName]);
        const user = dbRes.rows[0];
        if (!user) {
            logMessage('GoogleLogin', 'User not found');
            return res.status(404).json({ message: 'OAuth Log-In: Unauthorized Access Attempt' });
        }
        logMessage('GoogleLogin', 'Login successful');
        return res.status(200).json({
            message: 'OAuth Log-In: Valid Credentials',
            user: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.roles,
                profilePic: user.profile_pic,
                profileComplete: user.profile_complete
            }
        });
    } catch (error) {
        logMessage('GoogleLogin', 'Server error');
        return res.status(500).json({ message: 'OAuth Log-In: Server Connection Cannot Be Established' });
    }
});

module.exports = router;
