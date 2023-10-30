// NOTE this was a test file, is not currently used in the project
const { Client } = require('pg')

const client = new Client({
    host: 'csce-315-db.engr.tamu.edu',
    user: 'csce315_905_03user',
    password: '90503',
    database: 'csce315_905_03db'
})

client.connect();

client.query(`Select * from served_items`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    client.end;
})

