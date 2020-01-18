require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

//allows app to use json from body that gets passed in from request
app.use(express.json());

app.post('/login', (req, res) => {
    // authenticate user checking password done here

    //authenticate & use JWT
    const username = req.body.username;
    //value serialised
    const user = { name: username };

    // payload = what we want to serialise
    // secret key to serialise
    //can also add expiration date
    // accessToken will have user info saved in it
    const accessToken = generateAccessToken(user);
    //same user is inside both tokens
    //manually handle expiration time on refreshToken rather than setting a time - want to manage it ourselves
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.json( { accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {

    // in a real app would want 10 - 15 mins expiry time
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}
app.listen(4000);
