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

app.get('/posts', authenticateToken, (req, res) => {
    console.log('req.user.name', req.user.name);
    res.json(posts.filter(post => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // token will be undefined or the token
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    });
}
app.listen(3000);
