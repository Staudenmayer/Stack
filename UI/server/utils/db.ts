import pg from "pg";
import log from "./log";

function setupDatabase() {
    const pool = new pg.Pool({
        host: process.env.postgres_host || "127.0.0.1",
        port: parseInt(process.env.postgres_port as string) || 5432,
        user: process.env.postgres_user || "admin",
        password: process.env.postgres_password || "changeme",
        database: process.env.postgres_database || "postgres",
    });
    async function a() {
        try {
            await pool.connect();
            await pool.query(`CREATE TABLE IF NOT EXISTS "users" (id TEXT NOT NULL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL);`);
            await pool.query(`CREATE TABLE IF NOT EXISTS "session" ( id TEXT NOT NULL PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL, user_id TEXT NOT NULL REFERENCES "users"(id) );`);
        } catch (error) {
            if(error instanceof Error){
                log.critical(error.message);
            }
            console.error(error);
        }
    }
    a();
    return pool;
}

const pool = setupDatabase();

export { pool };

export interface DatabaseUser {
    id: string;
    username: string;
    password: string;
}