const {validateUser} = require("./model/user");

const {create, migrateDb} = require("./store/db");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 4000);

let startDb = (async () => {
    await create();
    return await migrateDb();
})();
console.log('Finished migrating db');

app.route('/registration')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/registration.html', function (err) {
            if (err) {
                console.log('Unable to load registration page', err.status)
            } else {
                console.log('Successfully loaded registration page');
            }
        })
    }).post((req, res) => {
    console.log('hey made it to post here is my req body', req.body);
    const {error} = validateUser(req.body);
    console.log('errored', errpr);
    if (error) return res.status(400).send(error.details[0].message);
    res.redirect('/log-in')
});

app.post('/log-in', (req, res) => {
    res.sendFile(__dirname + '/public/login.html', function (err) {
        if (err) {
            res.redirect(301, '/registration');
            next(err);
            console.log('Unable to load login page', err.status)
        } else {
            console.log('Successfully on logon  page');
        }
    });
});

startDb.then(() => app.listen(4000));
