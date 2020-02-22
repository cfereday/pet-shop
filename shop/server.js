const {create, migrateDb} = require("./store/db");
const {userTable} = require('./model/userTable');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

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
    const cookieInfo = {roles: ['user'], username};

    if (username === 'admin') {
        cookieInfo.roles.push('admin')
    }
    return jwt.sign(cookieInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});
}

const verifiedJwt = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return false;
    }
};

const checkExpiry = (validated) => {
    return Date.now() < validated.exp * 1000;
};

const kind = (user) => user === 'admin' ? 'admin' : 'user';

function checkUserRole(verified) {
    const roles = verified.roles;
    const isAdmin = roles.includes('admin');
    let userOrAdmin;

    isAdmin ? userOrAdmin = 'admin' : userOrAdmin = 'user';
    return userOrAdmin;
}

const createAuthCookie = (res, token) => {
    console.log('token in cookie', token);
    res.cookie('petShopAuthCookie', `${token}`, {expires: token.expiresIn, httpOnly: true});
};


function getAuthCookies(req) {
    let cookies = req.headers.cookie || "";
    let allCookiesAsStrings = cookies.split('; ');
    return allCookiesAsStrings.find(name => name.match(/petShopAuthCookie=./));
}

const removeAuthCookie = (res) => {
    res.cookie('petShopAuthCookie', '', {expires: new Date(), httpOnly: true})
};

function checkCookie(req) {
    const matchedCookie = getAuthCookies(req);
    if (matchedCookie) {
        const tokenToVerify = matchedCookie.split('=')[1];
        return verifiedJwt(tokenToVerify);
    }
}

function findUserInDb(usernameToCheck) {
    return userTable.findAll({
        where: {
            username: usernameToCheck
        }
    });
}

const currentUser = (users) => users[0];

function showLogout(res) {
    res.render('logout.html', {title: 'You are now logged out!'});
}

function showAdminPage(res, verified) {
    res.render('admin.html', {username: verified.username, kindOfUser: 'admin'});
}

function showLogin(res) {
    res.render('login.html', {title: 'Please login'});
}

function showPetshop(res, verified) {
    res.render('my-pet-shop.html', {username: verified.username, kindOfUser: kind(checkUserRole(verified))});
}

const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(9).max(50).required()
});

app.route('/registration')
    .get((req, res) => {
        res.render('registration.html', {title: 'Please register'});
    }).post((req, res) => {
    const user = req.body;
    const validation = schema.validate(user);
    if (validation.error) {
        console.error('Invalid data request - something went wrong validating');
        res.redirect(301, '/something-went-wrong');
    } else {
        console.log('success you have a username & password that look ok');
        userTable.create(validation.value);
        res.redirect(301, '/login');
    }
});

app.route('/login').get((req, res) => {
    const verified = checkCookie(req);
    if (verified) {
        findUserInDb(verified.username).then(function (users) {
            if (!currentUser(users) || !checkExpiry(verified)) {
                showLogin(res)
            } else {
                console.log('successfully logged into shop via valid JWT & checking username in db');
                res.redirect(301, '/my-pet-shop');
            }
        })
    } else {
        showLogin(res);
    }
}).post((req, res) => {
    const user = req.body;
    const validated = schema.validate(user);
    const inputUsername = validated.value.username;
    const inputPassword = validated.value.password;
    let token;

    if (validated.error) {
        console.log('Invalid data request - something went wrong validating');
        res.redirect(301, '/something-went-wrong');
    } else {
        findUserInDb(inputUsername).then(function (users) {
            const user = currentUser(users);
            if (!user) {
                console.error('Could not find the user');
                res.redirect(301, '/something-went-wrong');
            } else {
                if (user.validPassword(inputPassword)) {
                    token = generateAccessToken(user);
                    createAuthCookie(res, token);
                    console.log('successfully logged in');
                    res.redirect(301, '/my-pet-shop');
                } else {
                    console.error('Could not find the password');
                    res.redirect(301, '/registration');
                }
            }
        });
    }
});

app.route('/my-pet-shop')
    .get((req, res) => {
        const verified = checkCookie(req);
        if (verified) {
            checkExpiry(verified) ? showPetshop(res, verified) : res.redirect('/login', 301);
        }
    });

const checkIsAdmin = (req, res) => {
    const verified = checkCookie(req);
    if (verified) {
        const roles = verified.roles;
        if (roles.includes('admin')) {
            findUserInDb(verified.username).then(function (users) {
                if (!currentUser(users) || !checkExpiry(verified)) {
                    res.redirect('/login', 301);
                } else {
                    console.log('successfully logged into admin via valid JWT & checking username in db');
                    showAdminPage(res, verified);
                    return;
                }
            })
        } else {
            console.error('there was not a matching user or jwt expired so going to show login page');
            res.redirect('/login', 301);
        }
    } else {
        console.log('there was not a matched cookie so going to show login page');
        res.redirect('/login', 301);
    }
    removeAuthCookie(res);
};

app.route('/admin')
    .get((req, res) => {
        checkIsAdmin(req, res);
    }).post((req, res) => {
    checkIsAdmin(req, res);
});

app.route('/logout')
    .get((req, res) => {
        showLogout(res);
        removeAuthCookie(res);
    }).post((req, res) => {
    showLogout(res);
    removeAuthCookie(res);
});

app.route('/something-went-wrong')
    .get((req, res) => {
        res.render('something-went-wrong.html');
    });

startDb.then(() => app.listen(4000));
