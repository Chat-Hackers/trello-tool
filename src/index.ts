import 'dotenv/config';
import express from "express";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import handleReaction from "./reactions";
import { deleteBoard, getBoardByRoomId } from './duckdb';

const { wrapper_url } = process.env;

const port = 5059;

const moduleRegistration = {
  id: "trello",
  uuid: uuidv4(),
  url: `http://localhost:${port}`,
  emoji: "📝",
  introduction: `React to a message with ✏️ to link your trello board, then use ✏️ again to send messages to your board.`,
  title: "Trello Integration",
  description: "Adds tasks to trello board",
  event_types: [
    "m.reaction"
  ]
}

function generateRegistrationFile() {
  fs.writeFileSync(`./${moduleRegistration.id}.json`, JSON.stringify(moduleRegistration));
}

async function start() {

  const app = express();
  app.use(express.json());

  app.get("/", async (req, res) => {
    const htmlPath = path.resolve(__dirname, "../../web/dist/index.html")

    res.sendFile(htmlPath);
  })

  app.post("/", async (req, res) => {
    const { event, botUserId } = req.body;

    console.log("trello tool sees event: ", event);

    let response = {};

    if (event.type === "m.reaction")
      response = await handleReaction(event, botUserId) || {};

    console.log("trello tool responds: ", response)

    res.send({ success: true, response });
  });

  app.get("/api/trello", async (req, res) => {
    const { roomId } = req.query;

    const board = await getBoardByRoomId(roomId as string) || {};

    res.send(board);
  })

  app.post("/api/trello", async (req, res) => {

  })

  app.delete("/api/trello", async (req, res) => {
    const { roomId } = req.query;

    await deleteBoard(roomId as string);

    res.send({ success: true })
  })

  app.listen(port);
};

generateRegistrationFile();
start();
