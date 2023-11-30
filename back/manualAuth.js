const express = require('express');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const router = express.Router();

const dbConfig = {
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
};

router.post('/auth/manual/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("email: ", email);
    console.log("password: ", password);
    const client = new Client(dbConfig);

    try {
        await client.connect();

        const query = 'SELECT * FROM employees WHERE email = $1;';
        const dbRes = await client.query(query, [email]);
        const user = dbRes.rows[0];

        console.log("user details: ", user);
        
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log("password comparison ", passwordMatch);

            if (passwordMatch) {
                res.status(200).json({
                    message: 'Manual Login Successful',
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
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.end();
    }
});


router.post('/auth/google/login', async (req, res) => {
    const { userEmail, userFirstName, userLastName } = req.body;

    const client = new Client(dbConfig);
    try {
        await client.connect();

        const query = 'SELECT * FROM employees WHERE email = $1 AND first_name = $2 AND last_name = $3';
        const dbRes = await client.query(query, [userEmail, userFirstName, userLastName]);
        const user = dbRes.rows[0];
        console.log("oAuth user: ", user);
        if (user) {
     
            res.status(200).json({
                message: 'OAuth Login',
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
            res.status(401).json({ message: 'User not found or invalid credentials' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.end();
    }
});

module.exports = router;
