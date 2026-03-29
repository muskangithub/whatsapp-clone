import express from "express";
import User from "../models/users";

const router = express.Router();

router.get("/", async (req: any, res) => {
    try {
        const currentUserId = req.query.userId; // 👈 get from query

        const users = await User.find({
            _id: { $ne: currentUserId }, // ✅ exclude self
        }).select("-password");

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

export default router;