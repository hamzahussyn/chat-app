import * as http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { randomUUID } from "crypto";
import ChatModel from "./models/Chat";

interface IRooms {
  roomId: string;
  users: string[];
}

interface IIncommingMessage {
  sender: string;
  reciever: string;
  message: string;
}

export class Sockets {
  private httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private socketsArray: Array<
    Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  >;
  private socketsToUsersMap: Object;
  private usersToSocketsMap: Object;
  private rooms: Array<IRooms>;

  private _createRoomId() {
    return randomUUID();
  }
  
  private _findSocket(socketId: string) {
    return this.socketsArray.find((socket) => socket.id === socketId);
  }

  private async _saveChatToMongoDB(message: IIncommingMessage) {
    const chat = new ChatModel({
      senderId: message.sender,
      recieverId: message.reciever,
      body: message.message,
    });

    await chat.save();
  }

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.httpServer = server;
    this.socketsArray = new Array();
    this.socketsToUsersMap = new Object({});
    this.usersToSocketsMap = new Object({});
    this.rooms = new Array();
  }

  public init() {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
      },
    });
  }

  public eventsInit() {
    this.io.on("connection", (socket) => {
      // Keeping the reference of the socket.
      this.socketsArray.push(socket);

      console.log(`[socket.io]: client with socket id ${socket.id} joined.`);

      socket.on("joined_chat", (userId) => {
        console.log(`[socket.io]: {userId: ${userId}, socketId: ${socket.id}}`);
        this.usersToSocketsMap[userId] = socket.id;
        this.socketsToUsersMap[socket.id] = userId;
      });

      console.log(this.socketsToUsersMap);

      socket.on("create_room_request", ({ sender, reciever }) => {
        const senderSocketId = this.usersToSocketsMap[sender];
        const recieverSocketId = this.usersToSocketsMap[reciever];

        const room = this.rooms.find(
          (room) => room.users.includes(sender) && room.users.includes(reciever)
        );

        if (!room) {
          const roomId = this._createRoomId();

          this.rooms.push({
            roomId: roomId,
            users: [sender, reciever],
          });

          const senderSocket = this._findSocket(senderSocketId);
          const recieverSocket = this._findSocket(recieverSocketId);

          if (senderSocket) {
            senderSocket.join(roomId);
          }
          if (recieverSocket) {
            recieverSocket.join(roomId);
          }
        }
      });

      socket.on("send_message", (msgObject) => {
        console.log(msgObject);
        console.log("roooms -> ", this.rooms);

        const room = this.rooms.find(
          (room) =>
            room.users.includes(msgObject.sender) &&
            room.users.includes(msgObject.reciever)
        );

        const senderSocketId = this.usersToSocketsMap[msgObject.sender];
        const recieverSocketId = this.usersToSocketsMap[msgObject.reciever];

        const senderSocket = this._findSocket(senderSocketId);
        const recieverSocket = this._findSocket(recieverSocketId);

        if (senderSocket) {
          senderSocket.join(room.roomId);
        }
        if (recieverSocket) {
          recieverSocket.join(room.roomId);
        }

        this._saveChatToMongoDB(msgObject);

        socket.to(room.roomId).emit("recieve_message", msgObject);
      });

      socket.on("disconnect", () => {
        console.log("[socket.io]: socket disconnected -> ", socket.id);

        delete this.socketsToUsersMap[socket.id];
        
        const key = Object.entries(this.usersToSocketsMap).find(
          ([key, value]) => value === socket.id
        );
        if (key) {
          delete this.usersToSocketsMap[key[0]];
        }
      });
    });
  }
}
