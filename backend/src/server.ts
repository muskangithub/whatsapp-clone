// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import message from "./models/message";
import messageRoutes from "./routes/messageRoutes";
import authRoutes from "./routes/authRoute";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

mongoose.connect("mongodb://localhost:27017/chat-app");

// SOCKET CONNECTION
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
        const msg = await message.create({
            sender: data.senderId,
            content: data.content,
            roomId: data.roomId,
        });

        io.to(data.roomId).emit("receive_message", msg);
    });

    socket.on("typing", ({ roomId, user }) => {
        socket.to(roomId).emit("typing", user);
    });

    socket.on("stop_typing", ({ roomId }) => {
        socket.to(roomId).emit("stop_typing");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


server.listen(5000, () => console.log("Server running on 5000"));