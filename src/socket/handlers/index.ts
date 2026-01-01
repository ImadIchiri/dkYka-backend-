import { Server, Socket } from "socket.io";
import { connectionHandler } from "./connection";
import { inboxHandler } from "./inbox";
import { notificationHandler } from "./notification";
import { postHandler } from "./posts";

export const registerEventHandlers = (io: Server, socket: Socket) => {
  connectionHandler(io, socket);
  inboxHandler(io, socket);
  notificationHandler(io, socket);
  postHandler(io, socket);
};
