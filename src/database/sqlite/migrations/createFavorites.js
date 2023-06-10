const createFavorites = `
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users (id),
        dish_id INTEGER NOT NULL REFERENCES dishes (id) ON DELETE CASCADE
    );
`;

module.exports = createFavorites;