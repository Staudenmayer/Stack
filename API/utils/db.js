"use strict";
const postgres = require('postgres');
require('dotenv').config();

const sql = postgres({
  host: process.env.POSTGRES_IP || "127.0.0.1",
  port: process.env.POSTGRES_PORT ||5432,
  username: process.env.POSTGRES_USER || "",
  password: process.env.POSTGRES_PWD || "",
  database: process.env.POSTGRES_DB || "postgres",
  onnotice: (notice)=>{}
});

async function setup(){
  try {
    await sql`CREATE TABLE IF NOT EXISTS users ( id VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, csrf VARCHAR(255) UNIQUE, PRIMARY KEY (id))`
  } catch (error) {
    console.error(error)
  }
}
setup();

module.exports = sql;
