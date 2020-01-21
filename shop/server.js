const { Pool } = require('pg');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.end();

app.set('port', process.env.PORT || 4000);

app.get('/', (req, res) => {
    res.sendStatus(200);
});


app.listen(4000);

