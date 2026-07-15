import { assignCard, getBoardMembers } from "./requests";
import { getBoardByRoomId } from "./duckdb";
import { MatrixEvent, MatrixReactionEvent, Context } from "../types";
import { getBoardLists, createCard } from "./requests";

const { auth_link, wrapper_url } = process.env;

async function startCardCreation(boardId: string, event: MatrixEvent, token: string) {
    const message = event.content.body;

    const lists = await getBoardLists(boardId, token) as { [key: string]: any }[];

    const nextOptions = [{ message: `Creating new Trello card: "${message}", react with 👍 to the list you want to add it to:` }]

    const listOptions = lists.map(list => ({
        message: list.name,
        context: {
            cardToBeListed: message,
            listId: list.id,
            listName: list.name
        }
    }));

    return nextOptions.concat(listOptions);
}

async function createCardOnList(context: Context, token: string) {
    const { cardToBeListed, listId, listName } = context;

    const card = await createCard(listId, cardToBeListed, token) as { [key: string]: any };

    return {
        message: `Card created and added to ${listName}. React with ❤️ to this message to assign to a member.`,
        context: {
            cardToBeAssigned: {
                cardId: card.id,
                cardName: card.name
            }
        }
    }
}

async function listMembersToAssign(boardId: string, context: Context, token: string) {
    const { cardId, cardName } = context.cardToBeAssigned;

    const nextOptions = [
        { message: `Assigning "${cardName}" to a member, react with 👍 to the member you want to assign it to:` }
    ];

    const members = await getBoardMembers(boardId, token) as { [key: string]: any }[];

    console.log(members);

    const memberOptions = members.map(member => ({
        message: member.fullName,
        context: {
            cardToBeAssigned: {
                cardId,
                cardName
            },
            userName: member.username,
            userId: member.id
        }
    }))

    return nextOptions.concat(memberOptions);
}

async function assignToMember(context: Context, token: string) {
    const { cardToBeAssigned, userId, userName } = context;
    const { cardId, cardName } = cardToBeAssigned;

    await assignCard(cardId, userId, token);

    return { success: true, message: `${cardName} assigned to ${userName}` };
}

export default async function handleReaction(event: MatrixReactionEvent, botUserId: string) {
    const reactionInfo = event.content["m.relates_to"];
    const eventFromReaction = event.prevEvent;
    const { context } = eventFromReaction.content;

    const reactionEmoji = reactionInfo.key.trim();

    const { board_id, token } = await getBoardByRoomId(event.room_id) || {};

    if (!board_id)
        return {
            success: true,
            message: `No trello board attached to this group. Please go to ${auth_link}&return_url=${wrapper_url}/trello/?roomId=${event.room_id} to link a board to this group.`
        };

    if (reactionEmoji.includes("✏️")) {
        return startCardCreation(board_id, eventFromReaction, token);
    }

    if (eventFromReaction.sender !== botUserId) return;

    if (reactionEmoji.includes("👍")) {
        if (context.cardToBeListed)
            return createCardOnList(context, token);

        if (context.cardToBeAssigned)
            return assignToMember(context, token);

    }
    if (reactionEmoji.includes("❤️")) {
        return listMembersToAssign(board_id, context, token);
    }
}