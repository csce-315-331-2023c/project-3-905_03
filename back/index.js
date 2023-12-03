const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = 8080;
var cors = require('cors');

const authRoutes = require('./authRoutes'); 
const manualAuth= require('./manualAuth');
const bodyParser = require('body-parser');
const { authenticateToken, allowRole} = require('./authenticateToken');


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(manualAuth);

const { Client } = require('pg')

app.use(express.static(path.join(__dirname, '../front/dist')));


app.get('/cashier', authenticateToken, allowRole(['cashier', 'admin']), (req, res) => {
    
});

app.get('/manager', authenticateToken, allowRole(['manager', 'admin']), (req, res) => {

});

app.get('/test', (req, res) => {
    res.status(200).send('success!');
});

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
            });

        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return entree items in json form
 */
app.get('/getFamilyItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return entree items in json form
 */
app.get('/getEntreeItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family WHERE family_category = 'entree' ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  
    });
});

/**
 * return w&t items in json form
 */
app.get('/getW&TItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family WHERE family_category = 'w&t' ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return side items in json form
 */
app.get('/getSideItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family WHERE family_category = 'side' ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return drink items in json form
 */
app.get('/getDrinkItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family WHERE family_category = 'drink' ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return special items in json form
 */
app.get('/getSpecialItems', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items_family WHERE family_category = 'special' ORDER BY family_id`, (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return served items in family given family id
 */
app.post('/getServedItemsInFamily', (req, res) => {
    let { family_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('select * from served_items where family_id = $1', [family_id], (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });
      
        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
});

/**
 * return served item's corresponding add-ons in family given family id
 */
app.post('/getToppingsInFamily', (req, res) => {
    let { family_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('select * from served_items_topping where family_id = $1', [family_id], (err, result) => {
        if (!err) {
            res.status(200).send({
                data: result.rows
            });

        }
        else {
            console.log(err.message);
            res.status(500).send(err.message);
        }
        client.end();  // Ensure the client connection is closed
    });
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

    client.query('SELECT * FROM orderServedItem WHERE order_id = $1', [order_id], (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            client.end();
            return;
        } else {
            let idMapping = {};

            for (let i = 0; i < result.rows.length; i++) {
                idMapping[result.rows[i].order_item_id] = result.rows[i].item_id;
            }
            // Query the database for the served_items info related to the given ids
            client.query('SELECT * FROM served_items WHERE item_id = ANY($1)', [Object.values(idMapping)], (err, result) => {
                if (!err) {
                    let data = [];

                    for (let row of result.rows) {
                        for (let order_item_id in idMapping) {
                            if (idMapping[order_item_id] === row.item_id) {
                                data.push({
                                    order_item_id: order_item_id,
                                    item_id: row.item_id,
                                    served_item: row.served_item,
                                    item_price: row.item_price,
                                    family_id: row.family_id
                                });
                            }
                        }
                    }

                    res.status(200).send({ data });
                } else {
                    res.status(400).send(err.message);
                }
                client.end();
            });
        }
    });
});

/**
 * get item toppings for a given order id and item id
 */
app.post('/getOrderItemToppings', (req, res) => {
    let { order_item_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    // Query the database for the served_items info related to the given ids
    client.query('SELECT topping_id FROM order_served_item_topping WHERE order_served_item_id = $1', [order_item_id], (err, result) => {
        if (!err) {
            if (result.rows.length == 0) {
                res.status(200).send({
                    data: []
                });
                client.end();
            } else {
                let topping_ids = result.rows.map(row => row.topping_id);
                client.query('SELECT * FROM served_items_topping WHERE topping_id = ANY($1)', [topping_ids], (err, result) => {
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
        } else {
            res.status(400).send(err.message);
            client.end();
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
        client.query('INSERT INTO served_items (item_id, served_item, item_price, family_id) VALUES ($1, $2, $3, $4)', [newItemId, served_item, item_price, 37], (err, result) => {
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
 * given sender_id (for now assume is given to you), a list of item ids, order total, takeout, and split, submit the order to the database
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
        let { receipt, total, sender_id, split, dineIn } = req.body;

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

        let dineInInt = dineIn ? 1 : 0;
        let splitInt = split ? 1 : 0;
        await client.query('INSERT INTO orders (employee_id, order_id, order_total, takeout, split, order_date) VALUES ($1, $2, $3, $4, $5, $6)', [sender_id, neworderId, total, dineInInt, splitInt, dateTime]);

        const maxOrderItemIdResult = await client.query('SELECT MAX(order_item_id) FROM orderserveditem');
        let maxOrderItemId = maxOrderItemIdResult.rows[0].max || 0;
        let newOrderItemId = maxOrderItemId + 1;

        //receipt = JSON.parse(receipt);

        for (const item of receipt) {
            await client.query('INSERT INTO orderserveditem (order_id, item_id, order_item_id) VALUES ($1, $2, $3)', [neworderId, item.id, newOrderItemId]);

            const stock_ids_usedResult = await client.query('SELECT stock_id FROM serveditemstockitem WHERE item_id = $1', [item.id]);
            const stock_ids_used = stock_ids_usedResult.rows;

            for (const stock_id of stock_ids_used) {
                await client.query('UPDATE stock_items SET stock_quantity = stock_quantity - 1 WHERE stock_id = $1', [stock_id.stock_id]);
            }

            const maxOrderServedItemToppingIdResult = await client.query('SELECT MAX(order_served_item_topping_id) FROM order_served_item_topping');
            let maxOrderServedItemToppingId = maxOrderServedItemToppingIdResult.rows[0].max || 0;
            let newOrderServedItemToppingId = maxOrderServedItemToppingId + 1;

            // toppings = item.toppings;
            // toppings = JSON.parse(toppings);
            console.log(item.toppings);
            if (item.toppings && Array.isArray(item.toppings)) {
                for (const topping of item.toppings) {
                    if (topping.chosen == true) {
                        await client.query('INSERT INTO order_served_item_topping (order_served_item_topping_id, order_served_item_id, topping_id) VALUES ($1, $2, $3)', [newOrderServedItemToppingId, newOrderItemId, topping.id]);
                        newOrderServedItemToppingId++;
                    }
                    else {
                        continue;
                    }
                }
            }
            newOrderItemId++;
        }

        res.status(200).json({ message: 'success!', OrderId: neworderId });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});


{ /* Managerial Analytics / Reports */ }
app.get('/generateRestockReport', async (req, res) => {
    const restockQuery = `
        SELECT stock_id, stock_item, cost, stock_quantity, max_amount
        FROM stock_items
        WHERE stock_quantity <= max_amount / 3;
    `;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const result = await client.query(restockQuery);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database Query Error', err);
        res.status(500).json({ error: err.message });
    } finally {
        try {
            await client.end();
        } catch (endError) {
            console.error('Error on disconnecting', endError);
        }
    }
});



app.post('/generateSalesReport', async (req, res) => {
    const { startDate, endDate } = req.body;
    const salesReportQuery = `
    SELECT si.item_id, si.served_item, COUNT(*) as number_of_sales
    FROM orders o
    JOIN orderServedItem osi ON o.order_id = osi.order_id
    JOIN served_items si ON osi.item_id = si.item_id
    WHERE o.order_date BETWEEN $1 AND $2
    GROUP BY si.item_id, si.served_item
    ORDER BY number_of_sales DESC;
  `;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const { rows } = await client.query(salesReportQuery, [startDate, endDate]);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Database Query Error', err);
        res.status(500).json({ error: err.message });
    } finally {
        try {
            await client.end();
        } catch (endError) {
            console.error('Error on disconnecting', endError);
        }
    }
});

app.post('/generateExcessReport', async (req, res) => {
    const { startDate, endDate } = req.body;

    const combinedQuery = `
    SELECT si.stock_id, si.stock_quantity, COALESCE(sq.sold_quantity, 0) AS sold_quantity
    FROM stock_items si
    LEFT JOIN (
        SELECT sisi.stock_id, COUNT(*) AS sold_quantity
        FROM orders o
        JOIN orderServedItem osi ON o.order_id = osi.order_id
        JOIN serveditemstockitem sisi ON osi.item_id = sisi.item_id
        WHERE o.order_date BETWEEN $1 AND $2
        GROUP BY sisi.stock_id
    ) sq ON si.stock_id = sq.stock_id
    WHERE COALESCE(sq.sold_quantity, 0) < (si.stock_quantity * 0.1);

    `;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const excessItemsResult = await client.query(combinedQuery, [startDate, endDate]);
        const excessItems = excessItemsResult.rows;
        res.status(200).json(excessItems);
    } catch (err) {
        console.error('Database Query Error', err);
        res.status(500).json({ error: err.message });
    } finally {
        try {
            await client.end();
        } catch (endError) {
            console.error('Error on disconnecting', endError);
        }
    }
});


app.post('/generateUsageReport', async (req, res) => {
    const { startDate, endDate } = req.body;
    const usageQuery = `
        SELECT si.stock_id, COUNT(*) as usage_count
        FROM orders o
        JOIN orderServedItem osi ON o.order_id = osi.order_id
        JOIN serveditemstockitem si ON osi.item_id = si.item_id
        WHERE o.order_date BETWEEN $1 AND $2
        GROUP BY si.stock_id;
        `;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const usageResult = await client.query(usageQuery, [startDate, endDate]);
        const usageQuantities = usageResult.rows.map(row => ({
            stock_id: row.stock_id,
            usage_count: parseInt(row.usage_count)
        }));
        res.status(200).json(usageQuantities);
    } catch (err) {
        console.error('Database Query Error', err);
        res.status(500).json({ error: err.message });
    } finally {
        try {
            await client.end();
        } catch (endError) {
            console.error('Error on disconnecting', endError);
        }
    }
});


app.post('/generateFreqPairsReport', async (req, res) => {
    const { startDate, endDate } = req.body;

    const freqPairsQuery = `
        SELECT a.served_item AS item1, b.served_item AS item2, COUNT(*) AS occurences
        FROM (
            SELECT osi1.order_id, osi1.item_id AS item1_id, osi2.item_id AS item2_id
            FROM orderServedItem AS osi1
            JOIN orderServedItem AS osi2 ON osi1.order_id = osi2.order_id AND osi1.item_id < osi2.item_id
            JOIN orders AS o ON osi1.order_id = o.order_id
            WHERE o.order_date BETWEEN $1 AND $2
        ) AS sub
        JOIN served_items AS a ON sub.item1_id = a.item_id
        JOIN served_items AS b ON sub.item2_id = b.item_id
        GROUP BY a.served_item, b.served_item
        ORDER BY occurences DESC;
    `;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    });

    try {
        await client.connect();
        const result = await client.query(freqPairsQuery, [startDate, endDate]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database Query Error', err);
        res.status(500).json({ error: err.message });
    } finally {
        try {
            await client.end();
        } catch (endError) {
            console.error('Error on disconnecting', endError);
        }
    }
});


//// SERVER

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/dist/index.html'));
});

//// END SERVER

app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman