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
    const eventsResponse = await fetch(`${BASE_URL}/api/trello?roomId=${roomId}`);
    const eventsResult = await eventsResponse.json();

    return eventsResult;
}

export async function postBoard(roomId: string, boardId: string, token: string) {
    const eventsResponse = await fetch(`${BASE_URL}/api/trello?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify({ boardId, token }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const eventsResult = await eventsResponse.json();

    return eventsResult;
}

export async function deleteBoard(roomId: string) {
    const eventsResponse = await fetch(`${BASE_URL}/api/trello?roomId=${roomId}`, {
        method: "DELETE"
    });
    const eventsResult = await eventsResponse.json();

    return eventsResult;
}