const {connecting, User, validateUser} = require("./model/user");

const {create, migrateDb} = require("./store/db");
const express = require('express');
const app = express();

app.use(express.json());
app.set('port', 4000);

let startDb = (async () => {
    await create();
    return await migrateDb();
})();
console.log('Finished migrating db');

let createUser = (async () => {
       return await connecting();
});
console.log('Finished connecting to sequelize');

app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/public/registration.html', function (err) {
        if (err) {
            next(err);
            console.log('Unable to load registration page', err.status)
        } else {
            console.log('Successfully loaded registration page');
        }
    });
}).post((req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    User.create({
        username: req.body.username,
        password: req.body.password,
    }).then(user => {
        // req.session.user = user.dataValue;
        res.redirect('/log-in')
    }).catch(error => {
        res.redirect('/registration');
    });
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

startDb.then(() => createUser.then(() => app.listen(4000)));
