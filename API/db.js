const postgres = require('postgres');
require('dotenv').config();

const sql = postgres({
  host: process.env.POSTGRES_IP || "127.0.0.1",
  port: process.env.POSTGRES_PORT ||5432,
  username: process.env.POSTGRES_USER || "",
  password: process.env.POSTGRES_PWD || "",
  database: process.env.POSTGRES_DB || "postgres",
});

module.exports = sql;
