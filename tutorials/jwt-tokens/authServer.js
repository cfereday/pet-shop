require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

//allows app to use json from body that gets passed in from request
app.use(express.json());

//normally store tokens in db or redis cache - for purpose of tutorial storing stuff in an array but in real thing best thing is db / redis cache
let refreshTokens = [];
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return re.sendStatus(403);
        // extract out only relevant data
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken })
    })
});

// allows delete refresh tokens so a user can't infinitely have access
// normally you'd delete from a db
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

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
    refreshTokens.push(refreshToken);
    res.json( { accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {

    // in a real app would want 10 - 15 mins expiry time
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}
app.listen(4000);
