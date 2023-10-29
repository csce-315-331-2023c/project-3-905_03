const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

const { Client } = require('pg')

const client = new Client({
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
})

/**
 * return served items in json form
 */
app.get('/getServedItems', (req, res) => {
    client.connect();

    client.query(`SELECT * FROM served_items`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            })
        }
        else {
            console.log(err.message);
        }
        client.end;
    })
});

/**
 * add menu item
 */
app.post('/addMenuItem', (req, res) => {
    
    let { item_id, served_item, item_price } = req.body;

    client.connect();

    client.query('INSERT INTO served_items (item_id, served_item, item_price) VALUES ($1, $2, $3)', [item_id, served_item, item_price], (err, result) => {
        if (!err) {
            res.status(200).send('success!');
        }
        else {
            res.status(400).send(err.message);
        }
        client.end;
    })
});

app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)

// // when "get /arg" is called this function will be executed
// // req is incoming data, response is data we want to send back to client
// // try GET http://localhost:8080/arg on postman
// app.get('/tshirt', (req, res) => {
//     res.status(200).send({
//         tshirt: 'red',
//         size: 'large',
//     })
// });

// app.post('/tshirt/:id', (req, res) => {

//     const { id } = req.params;
//     let { num } = req.body;

//     if (!num) {
//         res.status(418).send({ message: 'We need a num!'})
//     }
//     else {
//         num = num * 20;
//     }

//     res.send({
//         tshirt: `tshirt with num of ${num} and ID of ${id}`,
//     });

// });