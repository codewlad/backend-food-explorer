const path = require("path");

module.exports = {
  development: {
    client: 'sqlite3',
    /*debug: true,*/
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    useNullAsDefault: true
  }
};