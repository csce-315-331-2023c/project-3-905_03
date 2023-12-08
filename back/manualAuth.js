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

/**
 * This is a POST route for manual login.
 * 
 * @remarks
 * This route receives an email and password from the request body.
 * It then queries the `employees` and `customers` tables in the database for a user with the given email.
 * If a user is found in the `employees` table, it checks if the given password matches the user's password.
 * If the passwords match, it creates a JWT token for the user and sends it in the response.
 * If a user is not found in the `employees` table, it checks the `customers` table.
 * 
 * @param req - The request object
 * @param res - The response object
 * 
 * @returns A response with the JWT token if the login is successful, or an error message if the login is unsuccessful
 */
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

        if (employee) {
            const passwordMatch = await bcrypt.compare(password, employee.password);
            if (passwordMatch) {
                const userForToken = {
                    email: employee.email,
                    firstName: employee.first_name,
                    lastName: employee.last_name,
                    role: employee.role,
                    profilePic: employee.profile_pic,
                };
                const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });


                return res.status(200).json({ token});
            }
        } else if (customer) {
            const passwordMatch = await bcrypt.compare(password, customer.password);
            if (passwordMatch) {
                const customerUserToken = {
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    role: 'customer',
                    profilePic: customer.profile_pic,
                };
                const token = jwt.sign(customerUserToken, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            }
        }
        return res.status(401).json({ message: 'Invalid Credentials' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
