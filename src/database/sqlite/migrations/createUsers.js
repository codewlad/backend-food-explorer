const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR,
        email VARCHAR,
        password VARCHAR,
        avatar VARCHAR NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
    )
`;

module.exports = createUsers;