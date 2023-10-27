const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman
app.get('/tshirt', (req, res) => {
    res.status(200).send({
        tshirt: 'red',
        size: 'large',
    })
});

app.post('/tshirt/:id', (req, res) => {

    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
        res.status(418).send({ message: 'We need a logo!'})
    }

    res.send({
        tshirt: `tshirt with your ${logo} and ID of ${id}`,
    });

});

app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)