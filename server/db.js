import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const {
  MYSQL_HOST = "127.0.0.1",
  MYSQL_PORT = "3306",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "root",
  MYSQL_DATABASE = "heritage_conquest",
} = process.env;

export const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

/** Creates the database (if missing) and applies schema.sql on boot. */
export async function initSchema() {
  const bootstrap = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    multipleStatements: true,
  });
  await bootstrap.query(
    `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await bootstrap.changeUser({ database: MYSQL_DATABASE });
  const sql = fs.readFileSync(path.join(import.meta.dirname, "schema.sql"), "utf8");
  await bootstrap.query(sql);
  await bootstrap.end();
}
