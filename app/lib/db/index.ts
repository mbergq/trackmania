import { Database } from "bun:sqlite";
import { createMapsTable } from "./init-db";

// DEV
export const db = new Database("./data/tm-db.sqlite");

// PROD
// export const db = new Database("/usr/src/app/data/tm-db.sqlite");

db.exec(createMapsTable);
