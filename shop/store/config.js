require('dotenv').config();

let databaseConfig = {
    database: 'shop',
    port: 5432,
    user: process.env.DB_USER,
    host: "localhost",
    password: process.env.DB_PASS
};

module.exports = { databaseConfig };
