const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUsers");
const createOrders = require("./createOrders");
const createDishes = require("./createDishes");
const createIngredients = require("./createIngredients");
const createOrderItems = require("./createOrderItems");
const createFavorites = require("./createFavorites");

async function migrationsRun() {
    const schemas = [
        createUsers,
        createOrders,
        createDishes,
        createIngredients,
        createOrderItems,
        createFavorites,
    ].join('');

    sqliteConnection()
        .then(db => db.exec(schemas))
        .catch(error => console.error(error));
}

module.exports = migrationsRun;