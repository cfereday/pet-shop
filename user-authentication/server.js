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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log('salt', salt);
        console.log('hashed', hashedPassword);
        const user = { name: req.body.name, password: hashedPasword };
        users.push(user);
        res.status(201).send();
    } catch {
        req.status(500).send();
    }
});

app.listen(3000);
