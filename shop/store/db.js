// import pgp from 'pg-promise'
const {experiment} = require("../model/user");
require('dotenv').config();
const {createDb, migrate} = require("postgres-migrations");

let databaseConfig = {
    database: 'shop',
    port: 5432,
    user: process.env.DB_USER,
    host: "localhost",
    password: process.env.DB_PASS
};
// const db = pgp(databaseConfig);
async function create() {
    return await createDb('shop', {
        ...databaseConfig,
        defaultDatabase: "postgres",
    });
}
async function migrateDb() {
    experiment();
    return await migrate(databaseConfig, "./store/migrations");
}

module.exports = {
    create,
    migrateDb
};
