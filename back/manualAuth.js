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

        if (!user) {
            return res.status(404).json({ message: 'Manual Log-In: No User Found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const userForToken = {
                id: user.id, 
                email: user.email
            };

            const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                token:token, 
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
            return res.status(401).json({ message: 'Manual Log-In: Invalid Credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Manual Log-In: Server Connection Cannot Be Established' });
    }
});

module.exports = router;
