const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    try {
        //by default genSalt is 10- can add in rounds a number of entropy you'd like
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('hashed', hashedPassword);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send('created password')
    } catch(err) {
        console.log('err',err);
        req.status(500).send(JSON.stringify(err));
    }
});

app.listen(3000);
