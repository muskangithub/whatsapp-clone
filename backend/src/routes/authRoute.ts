// routes/authRoutes.ts
import express from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");

    res.json({ token, user });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: "User not found or invalid" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");

    res.json({ token, user });
});

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔒 Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔍 Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 💾 Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // 🎟️ Generate JWT
        // const token = jwt.sign(
        //     { userId: user._id },
        //     "SECRET_KEY", // 👉 move to .env later
        //     { expiresIn: "7d" }
        // );
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);


        // 🚫 Remove password from response
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        // ✅ Response
        res.status(201).json({
            message: "User created successfully",
            token,
            user: userData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;