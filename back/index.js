const app = require('express')();
const PORT = 8080;

// when "get /arg" is called this function will be executed
// req is incoming data, response is data we want to send back to client
// try GET http://localhost:8080/arg on postman
app.get('/arg', (req, res) => {
    res.status(200).send({
        example1: 'test1',
        example2: 'test2',
    })
});

app.listen(
    PORT,
    () => console.log(`it alive on http://localhost:${PORT}`)
)