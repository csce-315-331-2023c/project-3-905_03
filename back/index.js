const express = require('express');
const path = require('path'); // SERVER
const app = express();
const PORT = 8080;

app.use(express.json());

var cors = require('cors');
app.use(cors());

const { Client } = require('pg')

// FOR SERVER
app.use(express.static(path.join(__dirname, '../front/vite-project/dist')));

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

/**
 * given employee_id (for now assume is given to you), a list of item ids, order total, takeout, and split, submit the order to the database
 * get max order id
 * get the date
 * add to orders table
 * for each item add to orderserveditems table
 * for each item in the list of item_ids, get the ingredients used from the serveditemstockitem table
 * for each of these ingredients decrement the stock_quantity in the stock_items table
 */
app.post('/submitOrder', async (req, res) => { 
    let client;
    
    try {
        let { item_list, employee_id, order_total, takeout, split} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const maxOrderIdResult = await client.query('SELECT MAX(order_id) FROM orders');
        let maxorderId = maxOrderIdResult.rows[0].max || 0;
        let neworderId = maxorderId + 1;

        const currentDate = new Date();
        const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
        const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0') + ':' + currentDate.getSeconds().toString().padStart(2, '0');
        const dateTime = formattedDate + ' ' + formattedTime;

        await client.query('INSERT INTO orders (employee_id, order_id, order_total, takeout, split, order_date) VALUES ($1, $2, $3, $4, $5, $6)', [employee_id, neworderId, order_total, takeout, split, dateTime]);

        const maxOrderItemIdResult = await client.query('SELECT MAX(order_item_id) FROM orderserveditem');
        let maxOrderItemId = maxOrderItemIdResult.rows[0].max || 0;
        let newOrderItemId = maxOrderItemId + 1;

        for (const item of item_list) {
            await client.query('INSERT INTO orderserveditem (order_id, item_id, order_item_id) VALUES ($1, $2, $3)', [neworderId, item, newOrderItemId]);

            const stock_ids_usedResult = await client.query('SELECT stock_id FROM serveditemstockitem WHERE item_id = $1', [item]);
            const stock_ids_used = stock_ids_usedResult.rows;

            for (const stock_id of stock_ids_used) {
                await client.query('UPDATE stock_items SET stock_quantity = stock_quantity - 1 WHERE stock_id = $1', [stock_id.stock_id]);
            }
            newOrderItemId++;
        }

        res.status(200).send('success!');
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

//// SERVER

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/vite-project/dist/index.html'));
});

//// END SERVER

app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman