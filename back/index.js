const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

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

    client.query(`SELECT * FROM served_items ORDER BY item_id`, (err, result) => {
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

    client.query(`SELECT * FROM stock_items ORDER BY stock_id`, (err, result) => {
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

    client.query(`SELECT *, to_char(order_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_order_date FROM orders order by order_date desc limit 20`, (err, result) => {
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
 * not sure why it needs to be a post request, cant get axios to submit params with axios.get()
 */
app.post('/getOrdersBetweenDates', (req, res) => {

    let { start_date, end_date } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT *, to_char(order_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_order_date FROM orders WHERE order_date BETWEEN $1 AND $2 ORDER by order_date`, [start_date, end_date], (err, result) => {
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
 * get order items for a given order id
 */
app.post('/getOrderItems', (req, res) => { 
    let { order_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('SELECT item_id FROM orderServedItem WHERE order_id = $1', [order_id], (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        } else {
            let item_ids = result.rows.map(row => row.item_id);
            // Query the database for the served_items info related to the given ids
            client.query('SELECT * FROM served_items WHERE item_id = ANY($1)', [item_ids], (err, result) => {
                if (!err) {
                    res.status(200).send({
                        data: result.rows
                    })
                } else {
                    res.status(400).send(err.message);
                }
                client.end();
            });
        }
    });
});

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
 * given stock_name, find its id, then add entry
 */
app.post('/addServedItemStockItem', (req, res) => {

    let { item_id, stock_item } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    // Query database to find matching stock_item id
    client.query('SELECT stock_id FROM stock_items WHERE stock_item = $1', [stock_item], (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        } else {
            let stock_id = result.rows[0].stock_id;

            // Query the database for the max served_stock_id
            client.query('SELECT MAX(served_stock_id) FROM serveditemstockitem', (err, result) => {
                if (err) {
                    res.status(400).send(err.message);
                    client.end();
                    return;
                }

                let maxServedStockId = result.rows[0].max || 0; // If no records exist, default to 0
                let newServedStockId = maxServedStockId + 1;

                // Insert the new entry with the incremented served_stock_id
                client.query('INSERT INTO serveditemstockitem (served_stock_id, item_id, stock_id) VALUES ($1, $2, $3)', [newServedStockId, item_id, stock_id], (err, result) => {
                    if (!err) {
                        res.status(200).send('success!');
                    } else {
                        res.status(400).send(err.message);
                    }
                    client.end();
                });
            });
        }
    });
});


/**
 * edit served_items entry 
 * will be provided with all values
 */
app.post('/editServedItem', (req, res) => {
    let { item_id, served_item, item_price } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('UPDATE served_items SET served_item = $1, item_price = $2 WHERE item_id = $3', [served_item, item_price, item_id], (err, result) => {
        if (!err) {
            res.status(200).send('success!');
        } else {
            res.status(400).send(err.message);
        }
        client.end();
    })
});
/**
 * edit stock_items entry
 * will be provided with all values
 */
app.post('/editStockItem', (req, res) => {
    let { stock_id, stock_item, cost, stock_quantity, max_amount } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('UPDATE stock_items SET stock_item = $1, cost = $2, stock_quantity = $3, max_amount = $4 WHERE stock_id = $5', [stock_item, cost, stock_quantity, max_amount, stock_id], (err, result) => {
        if (!err) {
            res.status(200).send('success!');
        } else {
            res.status(400).send(err.message);
        }
        client.end();
    })
});

/**
 * Delete served_items entry
 * will be provided with id
 */
app.post('/deleteServedItem', (req, res) => {
    let { item_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    //delete from joint table
    client.query('DELETE FROM serveditemstockitem WHERE item_id = $1', [item_id], (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        }

        //Insert the new entry with the incremented served_stock_id
        client.query('DELETE FROM served_items WHERE item_id = $1', [item_id], (err, result) => {
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
 * Delete stock_items entry
 * will be provided with id
 */
app.post('/deleteStockItem', (req, res) => {
    let { stock_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    //Delete from stock_items
    client.query('DELETE FROM stock_items WHERE stock_id = $1', [stock_id], (err, result) => {
        if (!err) {
            res.status(200).send('success!');
        } else {
            res.status(400).send(err.message);
        }
        client.end();
    });
});



app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman