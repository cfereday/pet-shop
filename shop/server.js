const {create, migrateDb} = require("./store/db");
const {connecting, userTable} = require('./model/userTable');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');

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

    console.log('hey made it to post registration here is my req body', req.body);
    const user = req.body;
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(9).max(50).required()
    });

    const validation = schema.validate(user);
    if (validation.error) {
        console.log('Invalid data request - something went wrong validating');
        res.redirect(301, '/something-went-wrong');
    } else {
        console.log('success you have a username & password that look ok');
        userTable.create(validation.value);
        res.redirect(301, '/log-in');
    }
});

app.route('/something-went-wrong')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/something-went-wrong.html', function (err) {
            if (err) {
                res.redirect(301, '/something-went-wrong.html');
                console.log('Unable to load error page', err.status)
            } else {
                console.log('Successfully on error  page');
            }
        })
    });


app.route('/log-in')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/login.html', function (err) {
            if (err) {
                res.redirect(301, '/registration');
                console.log('Unable to load login page', err.status)
            } else {
                console.log('Successfully on login  page');
            }
        })
    }).post((req, res) => {
    console.log('hey made it to post login here is my req body', req.body);
});

startDb.then(() => app.listen(4000));
