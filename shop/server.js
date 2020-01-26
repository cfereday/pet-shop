const {create, migrateDb} = require("./store/db");
const express = require('express');
const app = express();

app.use(express.json());
app.set('port', 4000);

let f = (async () => {
    await create();
    return await migrateDb();
})();

console.log('Finished migrating db');

app.get('/', (req, res) => {
    res.sendStatus(200);
});

f.then(() => app.listen(4000));

