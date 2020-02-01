const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost.com:5432/shop');
const Joi = require('@hapi/joi');

async function connecting() {
    return sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

const User =  sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
});

function validateUser(user) {
    const schemea = {
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(9).max(250).required()
    };

    return Joi.validate(user, schema);
}

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

sequelize.sync()
    .then(() => console.log('users has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('An error occurred', error));


module.exports = {
    connecting,
    User,
    validateUser
};
