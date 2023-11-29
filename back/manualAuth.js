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

        const query = 'SELECT * FROM employees WHERE email = $1';
        const dbRes = await client.query(query, [email]);
        const user = dbRes.rows[0];
        console.log("user.email: ",user.email);
        console.log("email: ", email);
        console.log("user.password: ", user.password);
        console.log("password: ", password);
       
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        console.log("password comparison ", passwordMatch);
        if (user && passwordMatch) {

            res.status(200).json({
                message: 'Login successful',
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
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.end();
    }
});

module.exports = router;
