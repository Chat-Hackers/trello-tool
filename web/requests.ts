const { VITE_TRELLO_KEY } = import.meta.env;
const { origin, pathname } = window.location;
const BASE_URL = `${origin}${pathname}`;

export async function getTrelloBoards(token: string) {
    const response = await fetch(
        `https://api.trello.com/1/members/me/boards?fields=id,name,url,closed&key=${VITE_TRELLO_KEY}&token=${token}`
    );
    return response.json();
}

export async function getTrelloBoardDetails(boardId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/board/${boardId}?key=${VITE_TRELLO_KEY}&token=${token}`);
    return response.json();
}

export async function getBoard(roomId: string) {
    const boardResponse = await fetch(`${BASE_URL}api/trello?roomId=${roomId}`);
    const boardResult = await boardResponse.json();

    return boardResult;
}

export async function postBoard(roomId: string, boardId: string, token: string) {
    const boardResponse = await fetch(`${BASE_URL}api/trello?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify({ boardId, token }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const boardResult = await boardResponse.json();

    return boardResult;
}

export async function deleteBoard(roomId: string) {
    const boardResponse = await fetch(`${BASE_URL}api/trello?roomId=${roomId}`, {
        method: "DELETE"
    });
    const boardResult = await boardResponse.json();

    return boardResult;
}