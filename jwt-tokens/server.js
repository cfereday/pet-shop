require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

//allows app to use json from body that gets passed in from request
app.use(express.json());

const posts = [
    {
        username: 'Charlotte',
        title: 'Post 1'
    },
    {
        username: 'Felipe',
        title: 'Post 2'
    }
];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/login', (req, res) => {
    // authenticate user checking password done here

    //authenticate & use JWT
    const username = req.body.username;
    const user = { name: username };

    // payload = what we want to serialise
    // secret key to serialise
    //can also add expiration date
    // accessToken will have user info saved in it
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json( { accessToken: accessToken });
});

app.listen(3000);
