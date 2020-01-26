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

app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/public/registration.html', function (err) {
        if (err) {
            next(err);
            console.log('Unable to load registration page', err.status)
        } else {
            console.log('Successfully loaded registration page');
        }
    });
});

f.then(() => app.listen(4000));
