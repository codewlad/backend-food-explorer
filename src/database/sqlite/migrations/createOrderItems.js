const createOrderItems = `
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL REFERENCES orders (id),
        dish_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        total NUMERIC(10,2)
    );
`;

module.exports = createOrderItems;