// routes/messageRoutes.ts
import express from "express";
import Message from "../models/message";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:roomId", authMiddleware, async (req, res) => {
    const messages = await Message.find({ roomId: req.params.roomId })
        .populate("sender", "name")
        .sort({ createdAt: 1 });

    res.json(messages);
});

export default router;