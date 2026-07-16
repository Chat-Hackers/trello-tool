import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";
import path from "node:path";
import { Board } from "../types";

let connection: DuckDBConnection;
let instance: DuckDBInstance;

export async function startDuckDB() {
    const trelloDuckDBFileName = "trello_duckdb.db";

    const dataDir = process.env.DUCKDB_DATA_DIR ?? path.resolve(__dirname, "../..");
    const dbPath = path.join(dataDir, trelloDuckDBFileName);

    instance = await DuckDBInstance.create(dbPath);
    connection = await instance.connect();

    const tables = [
        {
            name: "Boards",
            creationCommand:
                "CREATE TABLE Boards (room_id VARCHAR NOT NULL, board_id VARCHAR NOT NULL, token VARCHAR NOT NULL);",
        }
    ]

    const existingTablesRows = await connection.run("SHOW TABLES;");
    const existingTables = await existingTablesRows.getRowObjects();

    tables.forEach(async (table) => {
        const tableExists = existingTables.filter((existingTable) => existingTable.name === table.name).length > 0;

        if (tableExists) {
            console.log(`${table.name} already exists`);
        } else {
            await connection.run(table.creationCommand);
            console.log(`${table.name} created`);
        }
    });
}

export async function getBoardByRoomId(roomId: string) {
    const getTrello = `SELECT * FROM Boards WHERE room_id = $1;`;
    const prepared = await connection.prepare(getTrello);
    prepared.bindVarchar(1, roomId);
    const boardRows = await prepared.run();
    const boards = await boardRows.getRowObjects();
    return boards[0] as Board;
}

export async function insertBoard(roomId: string, boardId: string, token: string) {
    const insertBoard = `INSERT INTO Boards values ($1, $2, $3, $4);`;
    const prepared = await connection.prepare(insertBoard);
    prepared.bindVarchar(1, roomId);
    prepared.bindVarchar(2, boardId);
    prepared.bindVarchar(3, token);
    await prepared.run();
    return;
}

export async function deleteBoard(roomId: string) {
    const deleteBoard = `DELETE FROM Boards WHERE room_id=$1`;
    const prepared = await connection.prepare(deleteBoard);
    prepared.bindVarchar(1, roomId);
    await prepared.run();
    return;
}

startDuckDB();
