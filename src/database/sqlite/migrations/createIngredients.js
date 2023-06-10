const createIngredients = `
    CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id INTEGER NOT NULL REFERENCES dishes (id),
        name VARCHAR NOT NULL
    );
`;

module.exports = createIngredients;