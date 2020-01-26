const express = require('express');
const app = express();

app.use(express.json());
app.set('port', process.env.PORT);

app.get('/', (req, res) => {
    res.sendStatus(200);
});


app.listen(4000);

