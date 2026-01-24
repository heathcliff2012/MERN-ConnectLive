import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId){
            return res.status(401).json({ message: "Token is invalid, authorization denied." });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied." });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Token is invalid, authorization denied." });
    }
};