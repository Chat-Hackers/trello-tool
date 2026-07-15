const { trello_key } = process.env;

export async function createCard(listId: string, cardName: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/cards?idList=${listId}&name=${encodeURIComponent(cardName)}&key=${trello_key}&token=${token}`, {
        method: 'POST'
    });
    return response.json();
}

export async function assignCard(cardId: string, trelloUserId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/idMembers?value=${trelloUserId}&key=${trello_key}&token=${token}`, {
        method: 'POST'
    });
    return response.json();
}

export async function getBoardLists(boardId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${trello_key}&token=${token}`);
    return response.json();
}

export async function getBoardMembers(boardId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${trello_key}&token=${token}`);
    return response.json();
}

export async function getBoardCards(boardId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/cards?key=${trello_key}&token=${token}`);
    return response.json();
}

export async function moveCardList(cardId: string, listId: string, boardId: string, token: string) {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}?idList=${listId}&idBoard=${boardId}&key=${trello_key}&token=${token}`, {
        method: 'PUT'
    });
    return response.json();
}