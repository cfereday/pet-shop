const express = require('express');
const app = express();

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
app.listen(3000);
