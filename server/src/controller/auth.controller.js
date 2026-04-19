import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import redisClient from "../config/redis.js"

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExists = await userModel
            .findOne(
                {
                    $or: [{ email }, { username }]
                });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hash });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json(
            {
                message: "User registered successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await userModel
        .findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        {
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                token
            }
        });
}

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private (requires valid token)
 */

const getCurrentUserController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(
            {
                message: "User found successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private (requires valid token)
 */
const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        // Decode the token to get its expiry time
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // remaining TTL in seconds

        // Blacklist the token in Redis with TTL = remaining token lifetime
        if (expiresIn > 0) {
            await redisClient.set(`blacklist:${token}`, "true", "EX", expiresIn);
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { registerUserController, loginUserController, logoutUserController, getCurrentUserController }