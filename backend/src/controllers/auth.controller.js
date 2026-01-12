import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function signup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) {
            return  res.status(400).json({ message: "All fields are required." });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatarUrl = `https://i.pravatar.cc/150?img=${index}`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatarUrl
        });

        const token = jwt.sign({userId : newUser._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});

        res.status(201).json({
            success: true,
            user: newUser,
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during signup." });
    }

};

export async function login(req, res) {
  try{
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});

    res.status(200).json({
        success: true,
        user,
        token
    });
  }catch(error){
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
}

export async function logout(req, res) {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.status(200).json({success: true, message: "Logged out successfully." });
}