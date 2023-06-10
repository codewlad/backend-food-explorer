const createIngredients = `
    CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id INTEGER NOT NULL REFERENCES dishes (id) ON DELETE CASCADE,
        name VARCHAR NOT NULL
    );
`;

module.exports = createIngredients;