"use strict";
const Pool = require('pg').Pool;
require('dotenv').config();

function createPool() {
  return new Pool({
    host: process.env.POSTGRES_IP || "127.0.0.1",
    port: process.env.POSTGRES_PORT ||5432,
    user: process.env.POSTGRES_USER || "",
    password: process.env.POSTGRES_PWD || "",
    database: process.env.POSTGRES_DB || "postgres",
    onnotice: (notice)=>{}
  })
}

async function setup(){
  try {
    let pool = createPool();
    //setup session table
    await pool.query('CREATE TABLE IF NOT EXISTS "session_store" ( "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL, CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE ) WITH (OIDS=FALSE)');
    await pool.query('CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session_store" ("expire");')
    //Others
    await pool.query('CREATE TABLE IF NOT EXISTS users ( id UUID NOT NULL DEFAULT gen_random_uuid(), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, csrf VARCHAR(255) UNIQUE, PRIMARY KEY (id))');
  } catch (error) {
    console.error(error)
  }
}
setup();

module.exports = createPool();
