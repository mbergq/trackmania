import { Database } from "bun:sqlite";

// DEV
export const db = new Database("./data/tm-db.sqlite", {
	create: true,
	strict: true,
});

// PROD
// export const db = new Database("/usr/src/app/data/tm-db.sqlite");

// Some performance enhancing query I probably don't need
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`CREATE TABLE IF NOT EXISTS maps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    map_id TEXT NOT NULL UNIQUE,
    map_uid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    author TEXT NOT NULL,
    author_score INTEGER NOT NULL,
    bronze_score INTEGER NOT NULL,
    silver_score INTEGER NOT NULL,
    gold_score INTEGER NOT NULL,
    collection_name TEXT,
    created_with_gamepad_editor BOOLEAN NOT NULL DEFAULT 0,
    created_with_simple_editor BOOLEAN NOT NULL DEFAULT 0,
    file_url TEXT NOT NULL,
    filename TEXT NOT NULL,
    is_playable BOOLEAN NOT NULL DEFAULT 1,
    map_style TEXT,
    map_type TEXT,
    submitter TEXT,
    thumbnail_url TEXT,
    timestamp INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

db.exec(`CREATE TABLE IF NOT EXISTS app_user (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES app_user(id) ON DELETE CASCADE
)`);
