const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = 8080;
var cors = require('cors');

const googleOAuth= require('./googleOAuth');
const manualAuth= require('./manualAuth');
const bodyParser = require('body-parser');


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(manualAuth);
app.use(googleOAuth);

const { Client } = require('pg')

app.use(express.static(path.join(__dirname, '../front/dist')));


app.get('/test', (req, res) => {
    res.status(200).send('success!');
});

/**
 * Handles the GET request for served items.
 * 
 * @remarks
 * This function is responsible for fetching all served items from the database along with their ingredients.
 * Each served item is an object that includes the item_id, served_item, item_price, family_id, and an array of ingredients.
 * The function connects to the database, executes a SQL query to get the served items, and then for each served item, executes another SQL query to get its ingredients.
 * The function then sends a response with the status code and a JSON object containing a message and the data (all served items with their ingredients).
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getServedItems', async (req, res) => {
    let client;
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        const result = await client.query("SELECT item_id, served_item, item_price, family_id FROM served_items ORDER BY item_id");
        const servedItems = result.rows;

        let allServedItems = [];

        for (const servedItem of servedItems) {
            let servedItemInfo = {
                item_id: servedItem.item_id,
                served_item: servedItem.served_item,
                item_price: servedItem.item_price,
                family_id: servedItem.family_id,
                ingredients: []
            };

            const ingredientsResult = await client.query('SELECT stock_items.stock_item FROM serveditemstockitem JOIN stock_items ON serveditemstockitem.stock_id = stock_items.stock_id WHERE serveditemstockitem.item_id = $1', [servedItem.item_id]);
            const ingredients = ingredientsResult.rows;

            servedItemInfo.ingredients = ingredients;
            allServedItems.push(servedItemInfo);
        }

        res.status(200).json({ message: "success!", data: allServedItems });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the GET request for family items.
 * 
 * @remarks
 * This function is responsible for fetching all family items from the database.
 * The function connects to the database, executes a SQL query to get the family items, and then sends a response with the status code and a JSON object containing the data (all family items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for item categories.
 * 
 * @remarks
 * This function is responsible for fetching all item categories from the database.
 * The function connects to the database, executes a SQL query to get the served items, and then for each served item, executes another SQL query to get its category.
 * The function then sends a response with the status code and a JSON object containing the data (all item categories).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getItemCategories', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT * FROM served_items`, async (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
            client.end();
            return;
        }

        const familyIds = result.rows.map(row => row.family_id);
        const itemCategories = [];

        for (const familyId of familyIds) {
            const result = await client.query(`SELECT family_category FROM served_items_family WHERE family_id = $1`, [familyId]);
            itemCategories.push({ family_category: result.rows[0].family_category});
        }

        res.status(200).send({
            data: itemCategories
        });

        client.end();  // Ensure the client connection is closed
    });
});

/**
 * Handles the POST request for getting a specific item family.
 * 
 * @remarks
 * This function is responsible for fetching a specific item family from the database based on the family_id provided in the request body.
 * The function connects to the database, executes a SQL query to get the family name of the served item with the provided family_id, and then sends a response with the status code and a JSON object containing the data (family name).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/getItemFamily', (req, res) => {

    let { family_id } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT family_name FROM served_items_family WHERE family_id = $1`, [family_id], (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
            client.end();
            return;
        }

        res.status(200).send({
            data: result.rows[0]
        });

        client.end();  // Ensure the client connection is closed
    });
});

/**
 * Handles the GET request for entree items.
 * 
 * @remarks
 * This function is responsible for fetching all entree items from the database.
 * The function connects to the database, executes a SQL query to get the served items where the family category is 'entree', and then sends a response with the status code and a JSON object containing the data (all entree items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for W&T items.
 * 
 * @remarks
 * This function is responsible for fetching all W&T items from the database.
 * The function connects to the database, executes a SQL query to get the served items where the family category is 'w&t', and then sends a response with the status code and a JSON object containing the data (all W&T items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for side items.
 * 
 * @remarks
 * This function is responsible for fetching all side items from the database.
 * The function connects to the database, executes a SQL query to get the served items where the family category is 'side', and then sends a response with the status code and a JSON object containing the data (all side items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for drink items.
 * 
 * @remarks
 * This function is responsible for fetching all drink items from the database.
 * The function connects to the database, executes a SQL query to get the served items where the family category is 'drink', and then sends a response with the status code and a JSON object containing the data (all drink items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for special items.
 * 
 * @remarks
 * This function is responsible for fetching all special items from the database.
 * The function connects to the database, executes a SQL query to get the served items where the family category is 'special', and then sends a response with the status code and a JSON object containing the data (all special items).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for getting served items in a specific family.
 * 
 * @remarks
 * This function is responsible for fetching all served items from a specific family from the database based on the family_id provided in the request body.
 * The function connects to the database, executes a SQL query to get the served items where the family_id matches the provided family_id, and then sends a response with the status code and a JSON object containing the data (all served items in the specific family).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for getting specific served item information.
 * 
 * @remarks
 * This function is responsible for fetching information of a specific served item from the database based on the item_id provided in the request body.
 * The function connects to the database, executes a SQL query to get the served item where the item_id matches the provided item_id, and then sends a response with the status code and a JSON object containing the data (information of the specific served item).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/getServedItemInfo', async (req, res) => {
    let client;
    let { item_id } = req.body;
    
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        const result = await client.query("SELECT * FROM served_items WHERE item_id = $1", [item_id]);

        res.status(200).json({ message: 'success!', data: result.rows});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for getting specific served item information.
 * 
 * @remarks
 * This function is responsible for fetching information of a specific served item from the database based on the item_id provided in the request body.
 * The function connects to the database, executes a SQL query to get the served item where the item_id matches the provided item_id, and then sends a response with the status code and a JSON object containing the data (information of the specific served item).
 * If an error occurs, the function logs the error message and sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the GET request for recent orders.
 * 
 * @remarks
 * This function is responsible for fetching the most recent 1000 orders from the database.
 * The function connects to the database, executes a SQL query to get the most recent 1000 orders ordered by order_id in descending order, and then sends a response with the status code and a JSON object containing the data (recent orders).
 * If an error occurs, the function logs the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getRecentOrders', (req, res) => {

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query(`SELECT *, to_char(order_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_order_date FROM orders order by order_id desc limit 1000`, (err, result) => {
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
 * Handles the POST request for getting orders between two dates.
 * 
 * @remarks
 * This function is responsible for fetching all orders from the database that were placed between the start_date and end_date provided in the request body.
 * The function connects to the database, executes a SQL query to get all orders where the order_date is between start_date and end_date, and then sends a response with the status code and a JSON object containing the data (orders between the two dates).
 * If an error occurs, the function logs the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for getting items in a specific order.
 * 
 * @remarks
 * This function is responsible for fetching all items in a specific order from the database based on the order_id provided in the request body.
 * The function connects to the database, executes a SQL query to get all items where the order_id matches the provided order_id, and then sends a response with the status code and a JSON object containing the data (items in the specific order).
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for getting toppings of a specific order item.
 * 
 * @remarks
 * This function is responsible for fetching all toppings of a specific order item from the database based on the order_item_id provided in the request body.
 * The function connects to the database, executes a SQL query to get all toppings where the order_served_item_id matches the provided order_item_id, and then sends a response with the status code and a JSON object containing the data (toppings of the specific order item).
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for adding a new served item.
 * 
 * @remarks
 * This function is responsible for adding a new served item to the database. The served item information is provided in the request body.
 * The function connects to the database, gets the maximum item_id from the served_items table, increments it by 1 to get the new item_id, gets the family_id corresponding to the provided family_name, and then inserts a new record into the served_items table with the new item_id, served_item, item_price, and family_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/addServedItem', (req, res) => {

    let { served_item, item_price, family_name } = req.body;

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
        let family_id = 0;
        client.query('SELECT family_id FROM served_items_family WHERE family_name = $1', [family_name], (err, result) => {
            if (err) {
                res.status(400).send(err.message);
                client.end();
                return;
            } else{
                family_id = result.rows[0].family_id;
            }
        
            // Insert the new entry with the incremented item_id
            client.query('INSERT INTO served_items (item_id, served_item, item_price, family_id) VALUES ($1, $2, $3, $4)', [newItemId, served_item, item_price, family_id], (err, result) => {
                if (!err) {
                    res.status(200).send('success!');
                } else {
                    res.status(400).send(err.message);
                }
                client.end();
            });
        });
    });
});

/**
 * Handles the POST request for getting families in a specific category.
 * 
 * @remarks
 * This function is responsible for fetching all families in a specific category from the database based on the family_category provided in the request body.
 * The function connects to the database, executes a SQL query to get all families where the family_category matches the provided family_category, and then sends a response with the status code and a JSON object containing the data (families in the specific category).
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/getFamilies', (req, res) => {
    let { family_category } = req.body;

    const client = new Client({
        host: 'csce-315-db.engr.tamu.edu',
        user: 'csce315_905_03user',
        password: '90503',
        database: 'csce315_905_03db'
    })

    client.connect();

    client.query('SELECt * FROM served_items_family where family_category = $1', [family_category], (err, result) => {
        if (!err) {
            const familyNames = result.rows.map(row => ({family_name: row.family_name}));
            res.status(200).send({ data: familyNames });
        } else {
            res.status(400).send(err.message);
        }
        client.end();
    })
});


/**
 * Handles the POST request for adding a new stock item.
 * 
 * @remarks
 * This function is responsible for adding a new stock item to the database. The stock item information is provided in the request body.
 * The function connects to the database, gets the maximum stock_id from the stock_items table, increments it by 1 to get the new stock_id, and then inserts a new record into the stock_items table with the new stock_id, stock_item, cost, stock_quantity, and max_amount.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for adding a new served item stock item.
 * 
 * @remarks
 * This function is responsible for adding a new served item stock item to the database. The item_id and stock_item are provided in the request body.
 * The function connects to the database, gets the stock_id corresponding to the provided stock_item, gets the maximum served_stock_id from the serveditemstockitem table, increments it by 1 to get the new served_stock_id, and then inserts a new record into the serveditemstockitem table with the new served_stock_id, item_id, and stock_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for editing a served item.
 * 
 * @remarks
 * This function is responsible for editing a served item in the database. The item_id, served_item, item_price, family_name, and ingredients are provided in the request body.
 * The function connects to the database, gets the family_id corresponding to the provided family_name, updates the served_items table with the new served_item, item_price, and family_id, deletes the old entries from the serveditemstockitem table for the provided item_id, gets the stock_id for each provided ingredient, and then inserts new entries into the serveditemstockitem table with the provided item_id and the obtained stock_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editServedItem', async (req, res) => {
    let client;

    try {

        let { item_id, served_item, item_price, family_name, ingredients } = req.body;

        const client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        })

        client.connect();

        //get family_id given family name
        const result = await client.query('SELECT family_id FROM served_items_family WHERE family_name = $1', [family_name]);
        const family_id = result.rows[0].family_id;

        //update the served_items table
        client.query('UPDATE served_items SET served_item = $1, item_price = $2, family_id = $4 WHERE item_id = $3', [served_item, item_price, item_id, family_id]);

        //delete from joint table
        client.query('DELETE FROM serveditemstockitem WHERE item_id = $1', [item_id]);

        //get stock_id given stock_item
        for (const stock_item of ingredients) {
            const result = await client.query('SELECT stock_id FROM stock_items WHERE stock_item = $1', [stock_item]);
            const stock_id = result.rows[0].stock_id;

            //add entry to joint table
            client.query('INSERT INTO serveditemstockitem (item_id, stock_id) VALUES ($1, $2)', [item_id, stock_id]);
        }

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing a stock item.
 * 
 * @remarks
 * This function is responsible for editing a stock item in the database. The stock_id, stock_item, cost, stock_quantity, and max_amount are provided in the request body.
 * The function connects to the database, and updates the stock_items table with the new stock_item, cost, stock_quantity, and max_amount for the provided stock_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for deleting a served item.
 * 
 * @remarks
 * This function is responsible for deleting a served item from the database. The item_id is provided in the request body.
 * The function connects to the database, deletes the entries from the serveditemstockitem table for the provided item_id, and then deletes the entry from the served_items table for the provided item_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for deleting a stock item.
 * 
 * @remarks
 * This function is responsible for deleting a stock item from the database. The stock_id is provided in the request body.
 * The function connects to the database, and deletes the entry from the stock_items table for the provided stock_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
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
 * Handles the POST request for submitting an order.
 * 
 * @remarks
 * This function is responsible for submitting an order to the database. The sender_id, a list of item_ids, order total, takeout, and split are provided in the request body.
 * The function connects to the database, gets the maximum order_id from the orders table, gets the current date, adds a new record to the orders table, for each item in the list of item_ids, gets the ingredients used from the serveditemstockitem table, for each of these ingredients, decrements the stock_quantity in the stock_items table.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/submitOrder', async (req, res) => {
    let client;

    try {
        let { receipt, total, sender_id, dineIn } = req.body;

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
        await client.query("INSERT INTO orders (employee_id, order_id, order_total, takeout, order_date, status) VALUES ($1, $2, $3, $4, $5, 'pending')", [sender_id, neworderId, total, dineInInt, dateTime]);

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

/**
 * Handles the POST request for deleting an order.
 * 
 * @remarks
 * This function is responsible for deleting an order from the database. The order_id is provided in the request body.
 * The function connects to the database, gets the order_item_id for each item in the order from the orderserveditem table, deletes the entries from the order_served_item_topping table for each obtained order_item_id, deletes the entries from the orderserveditem table for the provided order_id, and then deletes the entry from the orders table for the provided order_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteOrder', async (req, res) => {
    let client;

    try {
        let { order_id } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const orderItemIdsResult = await client.query('SELECT order_item_id FROM orderserveditem WHERE order_id = $1', [order_id]);
        const orderItemIds = orderItemIdsResult.rows;
        for (const orderItemId of orderItemIds) {
            await client.query('DELETE FROM order_served_item_topping WHERE order_served_item_id = $1', [orderItemId.order_item_id]);
        }
        await client.query('DELETE FROM orderserveditem WHERE order_id = $1', [order_id]);
        await client.query('DELETE FROM orders WHERE order_id = $1', [order_id]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for getting information about an order for the edit order functionality.
 * 
 * @remarks
 * This function is responsible for fetching information about an order from the database. The order_id is provided in the request body.
 * The function connects to the database, gets the order from the orders table, gets the order_item_id and item_id for each item in the order from the orderserveditem table, gets the item information from the served_items table, gets the topping_id for each topping on the item from the order_served_item_topping table, gets the topping information from the served_items_topping table, and then sends a response with the status code and a JSON object containing the order information.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editOrderGetInfo', async (req, res) => {
    let client;

    try {
        let { order_id } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const orderResult = await client.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
        const order = orderResult.rows[0];
        
        let orderInfo = {
            order_id: order_id,
            sender_id: order.employee_id,
            order_total: order.order_total,
            dineIn: order.takeout,
            order_date: order.order_date,
            receipt: []
        };

        const orderItemIdsResult = await client.query('SELECT order_item_id, item_id FROM orderserveditem WHERE order_id = $1', [order_id]);
        const orderItemIds = orderItemIdsResult.rows;

        let receiptInfo = []; // Initialize receiptInfo as an array

        for (const orderItemId of orderItemIds) {
            const itemInfoResult = await client.query('SELECT* FROM served_items WHERE item_id = $1', [orderItemId.item_id]);
            const itemInfo = itemInfoResult.rows[0];
            itemInfo.toppings = []; // Initialize toppings as an array

            const toppingIdsResult = await client.query('SELECT topping_id FROM order_served_item_topping WHERE order_served_item_id = $1', [orderItemId.order_item_id]);
            const toppingIds = toppingIdsResult.rows;

            for(const toppingId of toppingIds){
                const toppingInfoResult = await client.query('SELECT* FROM served_items_topping WHERE topping_id = $1', [toppingId.topping_id]);
                const toppingInfo = toppingInfoResult.rows[0];
                itemInfo.toppings.push(toppingInfo); // Push toppingInfo into toppings array
            }

            receiptInfo.push(itemInfo); // Push itemInfo into receiptInfo array
        }

        orderInfo.receipt = receiptInfo;

        res.status(200).json({ message: "success!", data: orderInfo });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for submitting the edited order.
 * 
 * @remarks
 * This function is responsible for submitting the edited order to the database. The order_id, receipt, total, sender_id, and dineIn are provided in the request body.
 * The function connects to the database, deletes the old entries from the order_served_item_topping table, orderserveditem table, and orders table for the provided order_id, gets the current date and time, inserts a new record into the orders table, for each item in the receipt, inserts a new record into the orderserveditem table, decrements the stock_quantity in the stock_items table for each ingredient used, and if the item has toppings, inserts new records into the order_served_item_topping table.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editOrderSubmit', async (req, res) => {
    let client;

    try {
        let { order_id, receipt, total, sender_id, dineIn } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const orderItemIdsResult = await client.query('SELECT order_item_id FROM orderserveditem WHERE order_id = $1', [order_id]);
        const orderItemIds = orderItemIdsResult.rows;
        for (const orderItemId of orderItemIds) {
            await client.query('DELETE FROM order_served_item_topping WHERE order_served_item_id = $1', [orderItemId.order_item_id]);
        }
        await client.query('DELETE FROM orderserveditem WHERE order_id = $1', [order_id]);
        await client.query('DELETE FROM orders WHERE order_id = $1', [order_id]);

        const currentDate = new Date();
        const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
        const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0') + ':' + currentDate.getSeconds().toString().padStart(2, '0');
        const dateTime = formattedDate + ' ' + formattedTime;

        let dineInInt = dineIn ? 1 : 0;
        await client.query("INSERT INTO orders (employee_id, order_id, order_total, takeout, order_date, status) VALUES ($1, $2, $3, $4, $5, 'pending')", [sender_id, order_id, total, dineInInt, dateTime]);

        const maxOrderItemIdResult = await client.query('SELECT MAX(order_item_id) FROM orderserveditem');
        let maxOrderItemId = maxOrderItemIdResult.rows[0].max || 0;
        let newOrderItemId = maxOrderItemId + 1;

        for (const item of receipt) {
            await client.query('INSERT INTO orderserveditem (order_id, item_id, order_item_id) VALUES ($1, $2, $3)', [order_id, item.id, newOrderItemId]);

            const stock_ids_usedResult = await client.query('SELECT stock_id FROM serveditemstockitem WHERE item_id = $1', [item.id]);
            const stock_ids_used = stock_ids_usedResult.rows;

            for (const stock_id of stock_ids_used) {
                await client.query('UPDATE stock_items SET stock_quantity = stock_quantity - 1 WHERE stock_id = $1', [stock_id.stock_id]);
            }

            const maxOrderServedItemToppingIdResult = await client.query('SELECT MAX(order_served_item_topping_id) FROM order_served_item_topping');
            let maxOrderServedItemToppingId = maxOrderServedItemToppingIdResult.rows[0].max || 0;
            let newOrderServedItemToppingId = maxOrderServedItemToppingId + 1;

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

        res.status(200).json({ message: 'success!', OrderId: order_id });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for changing the status of an order.
 * 
 * @remarks
 * This function is responsible for changing the status of an order in the database. The order_id and status are provided in the request body.
 * The function connects to the database, and updates the status in the orders table for the provided order_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/changeOrderStatus', async (req, res) => {
    let client;
    let { order_id, status } = req.body;
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        await client.query("UPDATE orders SET status = $2 WHERE order_id = $1", [order_id, status]);

        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for setting an order's status to 'pending'.
 * 
 * @remarks
 * This function is responsible for setting an order's status to 'pending' in the database. The order_id is provided in the request body.
 * The function connects to the database, and updates the status in the orders table for the provided order_id to 'pending'.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/pendingOrder', async (req, res) => {
    let client;
    let { order_id } = req.body;
    
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        await client.query("UPDATE orders SET status = 'pending' WHERE order_id = $1", [order_id]);

        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for setting an order's status to 'fulfilled'.
 * 
 * @remarks
 * This function is responsible for setting an order's status to 'fulfilled' in the database. The order_id is provided in the request body.
 * The function connects to the database, and updates the status in the orders table for the provided order_id to 'fulfilled'.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/fulfillOrder', async (req, res) => {
    let client;
    let { order_id } = req.body;
    
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        await client.query("UPDATE orders SET status = 'fulfilled' WHERE order_id = $1", [order_id]);

        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for setting an order's status to 'cancelled'.
 * 
 * @remarks
 * This function is responsible for setting an order's status to 'cancelled' in the database. The order_id is provided in the request body.
 * The function connects to the database, and updates the status in the orders table for the provided order_id to 'cancelled'.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/cancelOrder', async (req, res) => {
    let client;
    let { order_id } = req.body;
    
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        await client.query("UPDATE orders SET status = 'cancelled' WHERE order_id = $1", [order_id]);

        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the GET request for fetching all pending orders.
 * 
 * @remarks
 * This function is responsible for fetching all orders with a status of 'pending' from the database.
 * The function connects to the database, and retrieves all records from the orders table where the status is 'pending'.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getPendingOrders', async (req, res) => {
    let client;
    
    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();
        const result = await client.query("SELECT * FROM orders WHERE status = 'pending'");

        res.status(200).json({ message: 'success!', data: result.rows});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the GET request for fetching all toppings.
 * 
 * @remarks
 * This function is responsible for fetching all toppings from the database.
 * The function connects to the database, and retrieves all records from the served_items_topping table.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getToppings', async (req, res) => {
    let client;

    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const result = await client.query('SELECT * FROM served_items_topping');

        res.status(200).json({ message: 'success!', data: result.rows});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for adding a new topping.
 * 
 * @remarks
 * This function is responsible for adding a new topping to the database. The family_ids, topping, and topping_price are provided in the request body.
 * The function connects to the database, gets the maximum topping_id from the served_items_topping table, increments it by 1, and for each family_id in the family_ids array, inserts a new record into the served_items_topping table with the incremented topping_id, the family_id, the topping, and the topping_price.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/addTopping', async (req, res) => {
    let client;

    try {
        let {family_ids, topping, topping_price } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        let maxTopping_id = await client.query('SELECT MAX(topping_id) FROM served_items_topping');
        let topping_id = (maxTopping_id.rows[0].max || 0) + 1;
        for (const family_id of family_ids) {
            await client.query('INSERT INTO served_items_topping (topping_id, family_id, topping, topping_price) VALUES ($1, $2, $3, $4)', [topping_id, family_id, topping, topping_price]);
            topping_id++;
        }
        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting all instances of a specific topping.
 * 
 * @remarks
 * This function is responsible for deleting all instances of a specific topping from the database. The topping is provided in the request body.
 * The function connects to the database, and deletes all records from the served_items_topping table where the topping matches the provided topping.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteAllOfTopping', async (req, res) => {
    let client;

    try {
        let {topping} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('DELETE FROM served_items_topping WHERE topping = $1', [ topping ]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific topping.
 * 
 * @remarks
 * This function is responsible for deleting a specific topping from the database. The topping_id is provided in the request body.
 * The function connects to the database, and deletes the record from the served_items_topping table where the topping_id matches the provided topping_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteIndividualTopping', async (req, res) => {
    let client;

    try {
        let {topping_id} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('DELETE FROM served_items_topping WHERE topping_id = $1', [ topping_id ]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing a specific topping.
 * 
 * @remarks
 * This function is responsible for editing a specific topping in the database. The topping_id, topping, and topping_price are provided in the request body.
 * The function connects to the database, and updates the record in the served_items_topping table where the topping_id matches the provided topping_id, setting the topping and topping_price to the provided values.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editTopping', async (req, res) => {
    let client;

    try {
        let {topping_id, topping, topping_price} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('UPDATE served_items_topping SET topping_price = $1, topping = $2 WHERE topping_id = $3', [ topping_price, topping, topping_id]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing a specific topping.
 * 
 * @remarks
 * This function is responsible for editing a specific topping in the database. The topping_id, topping, and topping_price are provided in the request body.
 * The function connects to the database, and updates the record in the served_items_topping table where the topping_id matches the provided topping_id, setting the topping and topping_price to the provided values.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getAllFamilies', async (req, res) => {
    let client;

    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const result = await client.query('SELECT * FROM served_items_family ORDER BY family_id');

        res.status(200).json({ message: 'success!', data: result.rows});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for adding a new family of served items.
 * 
 * @remarks
 * This function is responsible for adding a new family of served items to the database. The family_name, family_category, and family_description are provided in the request body.
 * The function connects to the database, gets the maximum family_id from the served_items_family table, increments it by 1, and inserts a new record into the served_items_family table with the incremented family_id, the family_name, the family_category, and the family_description.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/addFamily', async (req, res) => {
    let client;

    try {
        let {family_name, family_category, family_description } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        let maxFamily_id = await client.query('SELECT MAX(family_id) FROM served_items_family');
        let family_id = (maxFamily_id.rows[0].max || 0) + 1;
        await client.query('INSERT INTO served_items_family (family_id, family_name, family_category, family_description) VALUES ($1, $2, $3, $4)', [family_id, family_name, family_category, family_description]);
       
        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific family of served items.
 * 
 * @remarks
 * This function is responsible for deleting a specific family of served items from the database. The family_id is provided in the request body.
 * The function connects to the database, and deletes the record from the served_items_family table where the family_id matches the provided family_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteFamily', async (req, res) => {
    let client;

    try {
        let {family_id} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('DELETE FROM served_items_family WHERE family_id = $1', [ family_id ]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing a specific family of served items.
 * 
 * @remarks
 * This function is responsible for editing a specific family of served items in the database. The family_id, family_name, family_category, and family_description are provided in the request body.
 * The function connects to the database, and updates the record in the served_items_family table where the family_id matches the provided family_id, setting the family_name, family_category, and family_description to the provided values.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editFamily', async (req, res) => {
    let client;

    try {
        let {family_id, family_name, family_category, family_description} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('UPDATE served_items_family SET family_name = $2, family_category = $3, family_description = $4 WHERE family_id = $1', [ family_id, family_name, family_category, family_description]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing the description of a specific family of served items.
 * 
 * @remarks
 * This function is responsible for editing the description of a specific family of served items in the database. The family_id and family_description are provided in the request body.
 * The function connects to the database, and updates the record in the served_items_family table where the family_id matches the provided family_id, setting the family_description to the provided value.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editFamilyDescription', async (req, res) => {
    let client;

    try {
        let {family_id, family_description} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('UPDATE served_items_family SET family_description = $2 WHERE family_id = $1', [ family_id, family_description]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for editing the description of a specific family of served items.
 * 
 * @remarks
 * This function is responsible for editing the description of a specific family of served items in the database. The family_id and family_description are provided in the request body.
 * The function connects to the database, and updates the record in the served_items_family table where the family_id matches the provided family_id, setting the family_description to the provided value.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getEmployees', async (req, res) => {
    let client;

    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const result = await client.query('SELECT * FROM employees');
        const employees = result.rows.map(employee => {
            let { employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, created_at, ...additional_info } = employee;
            return { employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, created_at, additional_info };
        });

        res.status(200).json({ message: 'success!', data: employees });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for adding a new employee.
 * 
 * @remarks
 * This function is responsible for adding a new employee to the database. The employee's details are provided in the request body.
 * The function connects to the database, gets the maximum employee_id from the employees table, increments it by 1, and inserts a new record into the employees table with the incremented employee_id and the provided employee details.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/addEmployee', async (req, res) => {
    let client;

    try {
        let {first_name, last_name, email, password, role, profile_pic, profile_complete, phone, pay_rate, alt_email, prefered_name, address, emergency_contact_first_name, emergency_contact_last_name, emergency_contact_phone } = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const currentDate = new Date();
        const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
        const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0') + ':' + currentDate.getSeconds().toString().padStart(2, '0');
        const dateTime = formattedDate + ' ' + formattedTime;

        let maxEmployee_id = await client.query('SELECT MAX(employee_id) FROM employees');
        let employee_id = (parseInt(maxEmployee_id.rows[0].max || 0)) + 1;
        await client.query('INSERT INTO employees (employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, created_at, phone, pay_rate, alt_email, prefered_name, address, emergency_contact_first_name, emergency_contact_last_name, emergency_contact_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, dateTime, phone, pay_rate, alt_email, prefered_name, address, emergency_contact_first_name, emergency_contact_last_name, emergency_contact_phone]);
       
        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific employee.
 * 
 * @remarks
 * This function is responsible for deleting a specific employee from the database. The employee_id is provided in the request body.
 * The function connects to the database, and deletes the record from the employees table where the employee_id matches the provided employee_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteEmployee', async (req, res) => {
    let client;

    try {
        let {employee_id} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('DELETE FROM employees WHERE employee_id = $1', [ employee_id ]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific employee.
 * 
 * @remarks
 * This function is responsible for deleting a specific employee from the database. The employee_id is provided in the request body.
 * The function connects to the database, and deletes the record from the employees table where the employee_id matches the provided employee_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editEmployee', async (req, res) => {
    let client;

    try {
        let {employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, created_at, additional_info} = req.body;
        let {phone, pay_rate, alt_email, preferred_name, address, emergency_contact_first_name, emergency_contact_last_name, emergency_contact_phone} = additional_info;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('UPDATE employees SET first_name = $2, last_name = $3, email = $4, password = $5, role = $6, profile_pic = $7, profile_complete = $8, created_at = $9, phone = $10, pay_rate = $11, alt_email = $12, preferred_name = $13, address = $14, emergency_contact_first_name = $15, emergency_contact_last_name = $16, emergency_contact_phone = $17 WHERE employee_id = $1', [ employee_id, first_name, last_name, email, password, role, profile_pic, profile_complete, created_at, phone, pay_rate, alt_email, preferred_name, address, emergency_contact_first_name, emergency_contact_last_name, emergency_contact_phone]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the GET request for fetching all customers.
 * 
 * @remarks
 * This function is responsible for fetching all customers from the database.
 * The function connects to the database, and retrieves all records from the customers table.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.get('/getCustomers', async (req, res) => {
    let client;

    try {
        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const result = await client.query(`SELECT *, to_char(created_at::timestamp, 'YYYY-MM-DD HH24:MI:SS') as formatted_created_at FROM customers`);

        res.status(200).json({ message: 'success!', data: result.rows});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for adding a new customer.
 * 
 * @remarks
 * This function is responsible for adding a new customer to the database. The customer's details are provided in the request body.
 * The function connects to the database, gets the maximum user_id from the customers table, increments it by 1, and inserts a new record into the customers table with the incremented user_id and the provided customer details.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/addCustomer', async (req, res) => {
    let client;

    try {
        let {first_name, last_name, email, password, profile_pic} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        const currentDate = new Date();
        const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
        const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0') + ':' + currentDate.getSeconds().toString().padStart(2, '0');
        const created_at = formattedDate + ' ' + formattedTime;

        let maxUser_id = await client.query('SELECT MAX(user_id) FROM customers');
        let user_id = (parseInt(maxUser_id.rows[0].max || 0)) + 1;
        await client.query('INSERT INTO customers (user_id, first_name, last_name, email, password, profile_pic, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', [user_id, first_name, last_name, email, password, profile_pic, created_at]);
       
        res.status(200).json({ message: 'success!' });
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific customer.
 * 
 * @remarks
 * This function is responsible for deleting a specific customer from the database. The user_id is provided in the request body.
 * The function connects to the database, and deletes the record from the customers table where the user_id matches the provided user_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/deleteCustomer', async (req, res) => {
    let client;

    try {
        let {user_id} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('DELETE FROM customers WHERE user_id = $1', [ user_id ]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

/**
 * Handles the POST request for deleting a specific customer.
 * 
 * @remarks
 * This function is responsible for deleting a specific customer from the database. The user_id is provided in the request body.
 * The function connects to the database, and deletes the record from the customers table where the user_id matches the provided user_id.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
app.post('/editCustomer', async (req, res) => {
    let client;

    try {
        let {user_id, first_name, last_name, email, password, profile_pic} = req.body;

        client = new Client({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'csce315_905_03user',
            password: '90503',
            database: 'csce315_905_03db'
        });

        await client.connect();

        await client.query('UPDATE customers SET first_name = $2, last_name = $3, email = $4, password = $5, profile_pic = $6 WHERE user_id = $1', [user_id, first_name, last_name, email, password, profile_pic]);

        res.status(200).json({ message: 'success!'});
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        if (client) {
            client.end();
        }
    }
});

// TEMP TEMPLATE
// app.get('/getToppings', async (req, res) => {
//     let client;

//     try {
//         client = new Client({
//             host: 'csce-315-db.engr.tamu.edu',
//             user: 'csce315_905_03user',
//             password: '90503',
//             database: 'csce315_905_03db'
//         });

//         await client.connect();

//         res.status(200).json({ message: 'success!' });
//     } catch (error) {
//         res.status(400).send(error.message);
//     } finally {
//         if (client) {
//             client.end();
//         }
//     }
// });

// REPORTS

/**
 * Handles the GET request for generating a restock report.
 * 
 * @remarks
 * This function is responsible for generating a restock report from the database. The report includes stock items where the stock quantity is less than or equal to a third of the maximum amount.
 * The function connects to the database, and retrieves the relevant records from the stock_items table.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
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

/**
 * Handles the POST request for generating a sales report.
 * 
 * @remarks
 * This function is responsible for generating a sales report from the database. The report includes the number of sales for each served item between the provided start and end dates.
 * The function connects to the database, and retrieves the relevant records from the orders, orderServedItem, and served_items tables.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
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

/**
 * Handles the POST request for generating an excess report.
 * 
 * @remarks
 * This function is responsible for generating an excess report from the database. The report includes stock items where the sold quantity is less than 10% of the stock quantity between the provided start and end dates.
 * The function connects to the database, and retrieves the relevant records from the orders, orderServedItem, serveditemstockitem, and stock_items tables.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
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

/**
 * Handles the POST request for generating an excess report.
 * 
 * @remarks
 * This function is responsible for generating an excess report from the database. The report includes stock items where the sold quantity is less than 10% of the stock quantity between the provided start and end dates.
 * The function connects to the database, and retrieves the relevant records from the orders, orderServedItem, serveditemstockitem, and stock_items tables.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
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

/**
 * Handles the POST request for generating a frequent pairs report.
 * 
 * @remarks
 * This function is responsible for generating a frequent pairs report from the database. The report includes the pairs of served items that occur together in the same order most frequently between the provided start and end dates.
 * The function connects to the database, and retrieves the relevant records from the orders, orderServedItem, and served_items tables.
 * If an error occurs, the function sends a response with the status code and the error message.
 * 
 * @param req - The incoming request
 * @param res - The outgoing response
 * 
 * @returns void
 */
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