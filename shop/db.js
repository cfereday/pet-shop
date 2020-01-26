var pgp = require('pg-promise')(/* options */);


const db = pgp({
    database: 'shop',
    port: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});


db.none('CREATE DATABASE $1:name', 'shop')
    .then(data => {
        console.log('successfully created');
    })
    .catch(error => {
        console.log(error);
    });
