const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost.com:5432/shop');

function experiment() {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}


module.exports = {
  experiment
};
