import { Database } from "bun:sqlite";
import { createMapsTable } from "./init-db";

export const db = new Database("tm-db.sqlite");
db.exec(createMapsTable);
