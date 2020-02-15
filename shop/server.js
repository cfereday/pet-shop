const {create, migrateDb} = require("./store/db");
const {userTable} = require('./model/userTable');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 4000);

let startDb = (async () => {
    await create();
    return await migrateDb();
})();
console.log('Finished migrating db');

function generateAccessToken(user) {
    const username = user.username;
    const cookieInfo = {roles: 'user', username};
    return jwt.sign(cookieInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2min'});
}

const createAuthCookie = (res, token) => {
    console.log('token in cookie', token);
    res.cookie('petShopAuthCookie', `${token}`, {expires: token.expiresIn, httpOnly: true});
};

const verifiedJwt = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return err;
    }
};

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
        res.redirect(301, '/login');
    }
});

app.route('/login')
    .get((req, res) => {
        let cookies = req.headers.cookie;
        let allCookiesAsStrings = cookies.split('; ');
        const nameRegex = /petShopAuthCookie=./;
        const matchedCookie = allCookiesAsStrings.filter(name => name.match(nameRegex));
        const tokenToVerify = matchedCookie[0].split('=')[1];

        if (matchedCookie && tokenToVerify) {
            const attemptedVerify = verifiedJwt(tokenToVerify);
            if (attemptedVerify instanceof Error) {
                res.sendFile(__dirname + '/public/login.html', function (err) {
                    if (err) {
                        res.redirect(301, '/registration');
                        console.log('Unable to load login page: perhaps you need to register', err.status)
                    } else {
                        console.log('Successfully on login  page');
                    }
                })
            } else {
                const jwtUsername = attemptedVerify.username;
                userTable.findAll({
                    where: {
                        username: jwtUsername
                    }
                }).then(function (users) {
                    const user = users[0];
                    if (!user) {
                        console.log('Could not find the username after validating JWT - going to registration page');
                        res.redirect(301, '/registration');
                    } else {
                        console.log('successfully logged into shop via valid JWT & checking username in db');
                        res.redirect(301, '/my-pet-shop');
                    }

                })
            }
        }
    }).post((req, res) => {
    const inputUsername = req.body.username;
    const inputPassword = req.body.password;
    let token;

    userTable.findAll({
        where: {
            username: inputUsername
        }
    }).then(function (users) {
        const user = users[0];
        if (!user) {
            console.log('Could not find the user');
            res.redirect(301, '/something-went-wrong');
        } else {
            if (user.validPassword(inputPassword)) {
                console.log('successfully logged in');
                token = generateAccessToken(user);
                createAuthCookie(res, token);
                console.log('successfully created cookie');
                res.redirect(301, '/my-pet-shop');
            } else {
                console.log('Could not find the password');
                res.redirect(301, '/registration');
            }
        }
    });
})
;

app.route('/my-pet-shop')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/my-pet-shop.html', function (err) {
            if (err) {
                res.redirect(301, '/login');
                console.log('Unable to load login page', err.status)
            } else {
                console.log('Successfully on login  page');
            }
        })
    }).post((req, res) => {
    console.log('hey made it to post login here is my req body', req.body);
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

startDb.then(() => app.listen(4000));
