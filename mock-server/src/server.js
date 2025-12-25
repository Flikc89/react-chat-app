import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getChats } from "./handlers/chatsHandler.js";
import { getMessages } from "./handlers/messagesHandler.js";
import { sendMessage } from "./handlers/sendMessageHandler.js";
import websocketHandler from "./handlers/websocketHandler.js";
import {
  CORS_ORIGIN,
  DEFAULT_PORT,
  CURRENT_USER_ID,
} from "./config/constants.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [CORS_ORIGIN],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

websocketHandler.initialize(io, CURRENT_USER_ID);

app.use(
  cors({
    origin: [CORS_ORIGIN],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/chats", async (req, res) => {
  try {
    const chats = await getChats(CURRENT_USER_ID);
    res.json(chats);
  } catch (error) {
    console.error("Error getting chats:", error);
    if (error.name === "InvalidParameterError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to get chats" });
    }
  }
});

app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessages(chatId, CURRENT_USER_ID);
    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    if (error.name === "InvalidParameterError" || error.name === "ChatNotFoundError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to get messages" });
    }
  }
});

app.post("/api/messages/send/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const message = await sendMessage(chatId, CURRENT_USER_ID, text);
    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    if (error.name === "InvalidParameterError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to send message" });
    }
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.join("chatList");
  console.log(`Client ${socket.id} joined chatList room`);

  socket.on("subscribeToChat", (chatId) => {
    console.log(`Client ${socket.id} subscribed to chat ${chatId}`);
    socket.join(`chat-${chatId}`);
  });

  socket.on("unsubscribeFromChat", (chatId) => {
    console.log(`Client ${socket.id} unsubscribed from chat ${chatId}`);
    socket.leave(`chat-${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(DEFAULT_PORT, () => {
  console.log(`Mock server running on http://localhost:${DEFAULT_PORT}`);
});
