import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

/**
 * @desc Middleware to verify JWT token and check if it is blacklisted
 * @access Protected routes
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been invalidated. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
