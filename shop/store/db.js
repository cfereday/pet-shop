// import pgp from 'pg-promise'
const {createDb, migrate} = require("postgres-migrations");
const { databaseConfig } = require("config");

// const db = pgp(databaseConfig);
async function create() {
    return await createDb('shop', {
        ...databaseConfig,
        defaultDatabase: "postgres",
    });
}
async function migrateDb() {
    return await migrate(databaseConfig, "./store/migrations");
}

module.exports = {
    create,
    migrateDb
};
