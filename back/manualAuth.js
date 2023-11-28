const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const router = express.Router();

router.post('/auth/manual/login', async (req, res) => {
    const { email, password } = req.body;
    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const userResult = await client.query('SELECT password, roles FROM employees WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ email: user.email, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { email, roles: user.roles } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: 'Login failed' });
    } finally {
        client.end();
    }
});

module.exports = router;
