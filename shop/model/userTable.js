const bcrypt = require('bcrypt');
const { dbAccess } = require('../store/db');
const Sequelize = require('sequelize');

const userTable = dbAccess.define('customer', {
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

module.exports = {
    userTable,
};
