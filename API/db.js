const postgres = require('postgres');

const sql = postgres({
  host: "127.0.0.1",
  port: 5432,
  username: "admin",
  password: "changeme",
  database: "postgres",
});

module.exports = sql;
