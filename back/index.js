const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

var cors = require('cors');
app.use(cors());

const { Client } = require('pg')

/**
 * return served items in json form
 */
app.get('/getServedItems', (req, res) => {
    
    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

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
        client.end();
    })
});

/**
 * return stock items in json form
 */
app.get('/getStockItems', (req, res) => {
    
    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })
    
    client.connect();

    client.query(`SELECT * FROM stock_items`, (err, result) => {
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
 * get 20 most recent orders
 */
app.get('/getRecentOrders', (req, res) => {
    
    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`select * from orders order by order_date desc limit 20`, (err, result) => {
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
 * get orders between 2 dates
 */

/**
 * add entry to served items table in database
 */
app.post('/addServedItem', (req, res) => {

    let { served_item, item_price } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    // Query the database for the max item_id
    client.query('SELECT MAX(item_id) FROM served_items', (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        }

        let maxItemId = result.rows[0].max || 0; // If no records exist, default to 0
        let newItemId = maxItemId + 1;

        // Insert the new entry with the incremented item_id
        client.query('INSERT INTO served_items (item_id, served_item, item_price) VALUES ($1, $2, $3)', [newItemId, served_item, item_price], (err, result) => {
            if (!err) {
                res.status(200).send('success!');
            } else {
                res.status(400).send(err.message);
            }
            client.end();
        });
    });
});


/**
 * add entry to stock items table in database
 */
app.post('/addStockItem', (req, res) => {

    let { stock_item, cost, stock_quantity, max_amount } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    // Query the database for the max stock_id
    client.query('SELECT MAX(stock_id) FROM stock_items', (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        }

        let maxStockId = result.rows[0].max || 0; // If no records exist, default to 0
        let newStockId = maxStockId + 1;

        // Insert the new entry with the incremented stock_id
        client.query('INSERT INTO stock_items (stock_id, stock_item, cost, stock_quantity, max_amount) VALUES ($1, $2, $3, $4, $5)', [newStockId, stock_item, cost, stock_quantity, max_amount], (err, result) => {
            if (!err) {
                res.status(200).send('success!');
            } else {
                res.status(400).send(err.message);
            }
            client.end();
        });
    });
});


/**
 * add entry to served item stock item table in database
 */
app.post('/addServedItemStockItem', (req, res) => {
    let { item_id, stock_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    //Query the database for the max served_stock_id
    client.query('SELECT MAX(served_stock_id) FROM serveditemstockitem', (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        }

        let maxServedStockId = result.rows[0].max || 0; // If no records exist, default to 0
        let newServedStockId = maxServedStockId + 1;

        //Insert the new entry with the incremented served_stock_id
        client.query('INSERT INTO serveditemstockitem (served_stock_id, item_id, stock_id) VALUES ($1, $2, $3)', [newServedStockId, item_id, stock_id], (err, result) => {
            if (!err) {
                res.status(200).send('success!');
            } else {
                res.status(400).send(err.message);
            }
            client.end();
        });
    });
});

/**
 * edit served_items entry 
 * will be provided with all values
 */
app.post('/editServedItem', (req, res) => { 

});
/**
 * edit stock_items entry
 * will be provided with all values
 */
app.post('/editStockItem', (req, res) => {
    
    });

/**
 * Delete served_items entry
 * will be provided with id
 */

/**
 * Delete stock_items entry
 * will be provided with id
 */



app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman
