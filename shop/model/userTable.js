const bcrypt = require('bcrypt');
const {dbAccess} = require('../store/db');
const {Sequelize, DataTypes} = require('sequelize');

const userTable = dbAccess.define('customer', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accesstoken: {
        type: DataTypes.STRING,
        allowNull: false
    }
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
