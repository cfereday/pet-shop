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

function getAuthCookies(req) {
    let cookies = req.headers.cookie || "";
    let allCookiesAsStrings = cookies.split('; ');
    return allCookiesAsStrings.find(name => name.match(/petShopAuthCookie=./));
}

function generateAccessToken(user) {
    const username = user.username;
    const cookieInfo = {roles: ['user'], username};

    if (username === 'admin') {
        cookieInfo.roles.push('admin')
    }
    return jwt.sign(cookieInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2min'});
}

const createAuthCookie = (res, token) => {
    console.log('token in cookie', token);
    res.cookie('petShopAuthCookie', `${token}`, {expires: token.expiresIn, httpOnly: true});
};

const removeAuthCookie = (res) => {
    res.cookie('petShopAuthCookie', '', {expires: new Date(), httpOnly: true})
};

const checkIsAdmin = (req, res) => {
    const matchedCookie = getAuthCookies(req);

    if (matchedCookie) {
        const tokenToVerify = matchedCookie.split('=')[1];
        const verified = verifiedJwt(tokenToVerify);
        const roles = verified.roles;
        if (verified && roles.includes('admin')) {
            userTable.findAll({
                where: {
                    username: verified.username
                }
            }).then(function (users) {
                const user = users[0];
                if (!user) {
                    showLogin(res)
                } else {
                    console.log('successfully logged into admin via valid JWT & checking username in db');
                    res.redirect(301, '/admin');
                }
            })
        } else {
            showLogin(res);
        }
    } else {
        showLogin(res)
    }


    res.cookie('petShopAuthCookie', '', {expires: new Date(), httpOnly: true})
};

const verifiedJwt = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return false;
    }
};

function logout(res) {
    res.sendFile(__dirname + '/public/logout.html', function (err) {
        if (err) {
            console.log('Unable to load logout page', err.status)
        } else {
            console.log('Successfully loaded logout page');
        }
    })
}

function admin(res) {
    res.sendFile(__dirname + '/public/admin.html', function (err) {
        if (err) {
            console.log('Unable to load admin page', err.status)
        } else {
            console.log('Successfully loaded admin page');
        }
    })
}

app.route('/logout')
    .get((req, res) => {
        logout(res);
    })
    .post((req, res) => {
        removeAuthCookie(res);
        logout(res);
    });

app.route('/admin')
    .get((req, res) => {
        checkIsAdmin(req, res);
    }).post((req, res) => {
    checkIsAdmin(req, res);
});

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

function showLogin(res) {
    return res.sendFile(__dirname + '/public/login.html', function (err) {
        console.log('Failed sending login  page', err);
    })
}

app.route('/login').get((req, res) => {
    const matchedCookie = getAuthCookies(req);

    if (matchedCookie) {
        const tokenToVerify = matchedCookie.split('=')[1];
        const verified = verifiedJwt(tokenToVerify);
        console.log('tokenToVerify', tokenToVerify);
        if (verified) {
            userTable.findAll({
                where: {
                    username: verified.username
                }
            }).then(function (users) {
                const user = users[0];
                if (!user) {
                    showLogin(res)
                } else {
                    console.log('successfully logged into shop via valid JWT & checking username in db');
                    res.redirect(301, '/my-pet-shop');
                }
            })
        } else {
            showLogin(res);
        }
    } else {
        showLogin(res)
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
});

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
