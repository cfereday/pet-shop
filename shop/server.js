const {createDb, migrate} = require('postgres-migrations');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
async function startDb() {
    const dbConfig = {
        database: 'shop',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: 'localhost',
        port: 5432
    };

    await createDb('shop', {
        ...dbConfig,
        defaultDatabase: "postgres",
    });
    await migrate(dbConfig, "store/postgres/0001.create-schema.sql");
};

app.set('port', process.env.PORT);

app.get('/', (req, res) => {
    res.sendStatus(200);
});


app.listen(4000);

