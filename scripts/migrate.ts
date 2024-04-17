#! ~/.bun/bin/bun
import { Database } from 'bun:sqlite';

const db = new Database('./db.sqlite');

console.log('DROPPING TABLES');
db.exec(`DROP TABLE IF EXISTS users`);
db.exec(`DROP TABLE IF EXISTS sessions`);

console.log('CREATING TABLES');
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sub TEXT UNIQUE,
  name TEXT,
  given_name TEXT,
  family_name TEXT,
  picture TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN,
  local TEXT,
  username TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id INTEGER,
  code_verifier VARCHAR(32)
)`);
