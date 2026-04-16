import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("pacevault.db");

export function initDb() {
	db.execSync(`
        CREATE TABLE IF NOT EXISTS rallies (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            date TEXT,
            location TEXT
        );

        CREATE TABLE IF NOT EXISTS stages (
            id TEXT PRIMARY KEY NOT NULL,
            rallyId TEXT,
            name TEXT,
            "order" INTEGER
        );

        CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY NOT NULL,
            stageId TEXT,
            pageNumber INTEGER,
            imageUri TEXT,
            createdAt TEXT
        );
    `);
}
