// import pgp from 'pg-promise'
const { createDb, migrate } = require('postgres-migrations');
const { databaseConfig } = require('./config.js');
const Sequelize = require('sequelize');

const dbAccess = new Sequelize(databaseConfig.database, databaseConfig.user, databaseConfig.password, {
    ...databaseConfig,
    dialect: 'postgres',
    define: {
        timestamps: false
    },
});

async function create() {
    return await createDb('shop', {
        ...databaseConfig,
        defaultDatabase: 'postgres',
    });
}

async function migrateDb() {
    return await migrate(databaseConfig, './store/migrations');
}

module.exports = {
    create,
    migrateDb,
    dbAccess
};
