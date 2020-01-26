var pgp = require('pg-promise')(/* options */);

const db = pgp({
    database: 'shop',
    port: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

const table = new pgp.helpers.TableName({table: 'authorisation',
    schema: 'username varchar NOT NULL; password varchar NOT NULL;'});
console.log('created new table ', table);

module.exports = db;
