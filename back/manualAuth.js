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
            console.log('Server: Received manual login request for email:', req.body.email);
            
            const query = 'SELECT * FROM employees WHERE email = $1;';
            const dbRes = await pool.query(query, [email]);
            const user = dbRes.rows[0];
            console.log('Server: Employee query result:', dbRes.rows);
            
            const customerQuery = 'SELECT * FROM customers WHERE email = $1';
            const dbCustomerRes = await pool.query(customerQuery, [email]);
            const customerUser = dbCustomerRes.rows[0];
            console.log('Server: Customer query result:', dbCustomerRes.rows);

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
            
                    console.log('Server: Password match for employee:', passwordMatch);
              
                    const userForToken = {
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role: user.role,
                        profilePic: user.profile_pic,
                    };
                    console.log('Server: Generating JWT token for employeee:', userForToken);
                    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
                    console.log('Server: Sending employee token to client listening on auth/manual/login', token);
                    return res.status(200).json({ token });
                } 
            }

            else if (customerUser) {
                const passwordMatch = await bcrypt.compare(password, customerUser.password);
                if (passwordMatch) {
                    console.log('Server: Password match for customer:', passwordMatch);
                    const customerUserToken = {
                        firstName: customerUser.first_name,
                        lastName: customerUser.last_name,
                        role: 'customer',
                        email: customerUser.email,
                        profilePic: customerUser.profile_pic,
                    }
                    console.log('Server: Generating JWT token for customer:', passwordMatch);
                    const token = jwt.sign(customerUserToken, process.env.JWT_SECRET, { expiresIn: '1h' });
                    console.log('Server: Sending customer token to client listening on auth/manual/login: ', userForToken);
                    return res.status(200).json({ token });
                }
            }
            else {
                console.error('Login Error:', error);
                return res.status(404).json({ message: 'Manual Log-In: No User Found' });
            }
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ message: 'Manual Log-In: Server Connection Cannot Be Established' });
        }
    });

    module.exports = router;
