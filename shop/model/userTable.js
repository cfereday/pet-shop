const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/shop');
const bcrypt = require('bcrypt');

function connecting() {
    const connected = sequelize.authenticate();
    return connected
        .then(() => {
            console.log('Connection has been established successfully.');
            return true;
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return false;
        });
}

const userTable = sequelize.define('customer', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    },
    freezeTableName: true
});

userTable.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

sequelize.sync()
    .then(() => console.log('users has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('An error occurred', error));


module.exports = {
    connecting,
    userTable,
};
