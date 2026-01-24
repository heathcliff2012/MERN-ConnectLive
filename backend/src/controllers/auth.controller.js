import User from "../models/User.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";

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

        let index = Math.floor(Math.random() * 100) + 1;
        index = index.toString().substring(7);
        const randomAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`;        
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatarUrl
        });

        try{
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || randomAvatarUrl,
        })
        console.log("Stream user created successfully for:", newUser.fullName);
        }catch(error){
            console.error("Error creating Stream user during signup:", error);
        }

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

export async function onboarding(req, res) {
    try {
        const userId = req.user._id;
        const { profilePic, bio, location } = req.body;

        if(!profilePic || !bio || !location) {
            return res.status(400).json({ message: "All fields are required for onboarding.",
                missingFields: {
                    profilePic: !profilePic,
                    bio: !bio,
                    location: !location
                }
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic, bio, location, isOnboarded: true },
            { new: true }
        ).select("-password");

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        try {
        await upsertStreamUser({
            id: updatedUser._id.toString(),
            image: updatedUser.profilePic,
        });
        console.log("Stream user updated successfully for onboarding:", updatedUser.fullName);
        } catch (error) {
            console.error("Error updating Stream user during onboarding:", error);
        }

        res.status(200).json({ success: true, user: updatedUser });


    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Server error during onboarding." });
    }   
}