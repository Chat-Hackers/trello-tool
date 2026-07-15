export type Context = {
    [key: string]: any;
}

export type MatrixEvent = {
    content: {
        body: string;
        context: Context;
        [key: string]: any;
    },
    sender: string;
    room_id: string;
}

export type MatrixReactionEvent = MatrixEvent & {
    prevEvent: MatrixEvent
}

export type Board = {
    room_id: string;
    board_id: string;
    token: string;
    key: string;
}