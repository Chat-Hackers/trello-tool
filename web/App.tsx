import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import {
  getTrelloBoards,
  getTrelloBoardDetails,
  getBoard,
  postBoard,
  deleteBoard,
} from "./requests";

const { VITE_AUTH_LINK, VITE_WRAPPER_URL } = import.meta.env;

export default function App() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [urlToken, setUrlToken] = useState("");
  const [boards, setBoards] = useState<{ [key: string]: any }[]>([]);
  const [boardId, setBoardId] = useState("");
  const [boardToken, setBoardToken] = useState("");
  const [boardName, setBoardName] = useState("");
  const [boardUrl, setBoardUrl] = useState("");

  async function getBoardConnection() {
    if (roomId) {
      const board = await getBoard(roomId);
      if (board.board_id) {
        setBoardId(board.board_id);
        setBoardToken(board.token);
      }
    }
  }

  async function checkForUrlToken() {
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const urlToken = hashParams.get("token") || "";

    if (urlToken) setUrlToken(urlToken);
  }

  async function loadTrelloBoards() {
    const boards = await getTrelloBoards(urlToken);
    setBoards(boards);
  }

  async function loadBoardDetails() {
    if (boardId !== "" && boardToken !== "") {
      const boardDetails = await getTrelloBoardDetails(boardId, boardToken);
      setBoardName(boardDetails.name);
      setBoardUrl(boardDetails.url);
    }
  }

  useEffect(() => {
    if (roomId) {
      getBoardConnection();
      checkForUrlToken();
    }
  }, []);

  useEffect(() => {
    if (roomId && urlToken !== "") {
      loadTrelloBoards();
    }
  }, [urlToken]);

  useEffect(() => {
    if (boardId !== "" && boardToken !== "") {
      loadBoardDetails();
    }
  }, [boardId]);

  async function connectBoard(boardId: string) {
    if (roomId && urlToken) {
      setBoardId(boardId);
      postBoard(roomId, boardId, urlToken);
    }
  }

  async function disconnectBoard() {
    if (roomId) {
      deleteBoard(roomId);
      setBoardId("");
      setBoardName("");
      setBoardUrl("");
    }
  }

  const trelloLink = `${VITE_AUTH_LINK}&return_url=${VITE_WRAPPER_URL}/trello/?roomId=${roomId}`;

  return (
    <div>
      <h1>Trello Link</h1>
      {boardId ? (
        <>
          <p>Your board is active.</p>
          <p>Your group is connected to Trello Board: {boardName}</p>
          <a href={boardUrl}>
            <p>View board</p>
          </a>
          <button onClick={disconnectBoard}>Disconnect board</button>
        </>
      ) : boards.length > 0 ? (
        <>
          <p>Please choose a board to connect to your group</p>
          <div id="board-selection-container">
            {boards.map((board) => (
              <button onClick={() => connectBoard(board.id)}>
                {board.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>No board connected to your group.</p>
          <a href={trelloLink}>
            <p>Link a trello board</p>
          </a>
        </>
      )}
    </div>
  );
}
