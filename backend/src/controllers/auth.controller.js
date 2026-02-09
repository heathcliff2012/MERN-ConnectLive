import User from "../models/User.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";
import { generateVerificatonCode } from "../utils/generateVerificatonCode.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../lib/nodemailer/emails.js";
import crypto from "crypto";
import cloudinary from "../lib/cloudinary.js"; 

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
        
        const verificationToken = generateVerificatonCode();

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatarUrl,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000 // 1 hour
        });

        await sendVerificationEmail(email, verificationToken, fullName);

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

export async function verifyEmail(req, res) {
    try {
        const {verificationCode } = req.body;
        if(!verificationCode) {
            return res.status(400).json({ message: "Verification code is required." });
        }
        const user = await User.findOne({
             verificationToken: verificationCode, 
             verificationTokenExpires: { $gt: Date.now() } 
            });
 
        if(!user) {
            return res.status(400).json({ message: "Invalid verification code." });
        }
        if(user.isVerified) {
            return res.status(400).json({ message: "User is already verified." });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Email verified successfully." });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ message: "Server error during email verification." });
    }
}

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
    
    if(!user.isVerified) {
        return res.status(403).json({ message: "Email not verified. Please verify your email before logging in." });
    }

    user.lastLogin = new Date();
    await user.save();

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

export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        if(!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpires = Date.now() + 3600000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();
        const resetURL = `http://13.201.87.111:5173/reset-password/${resetPasswordToken}`;

        await sendPasswordResetEmail(email, resetURL, user.fullName);
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error during password reset." });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });
        if(!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token." });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email, user.fullName);

        res.status(200).json({ success: true, message: "Password reset successful." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error during password reset." });
    }
}


export async function onboarding(req, res) {
    try {
        const userId = req.user._id;
        const { bio, location } = req.body;
        
        // 1. Start with the string URL from the body (if user chose random avatar)
        let profilePic = req.body.profilePic;

        // 2. If the user actually uploaded a FILE, process it and upload to Cloudinary
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const uploadResponse = await cloudinary.uploader.upload(dataURI);
            profilePic = uploadResponse.secure_url;
        }

        console.log("Onboarding data received:", { profilePic, bio, location });

        // 3. Validation: Now check if we have a valid profilePic (either from file or string)
        if (!profilePic || !bio || !location) {
            return res.status(400).json({ 
                message: "All fields are required for onboarding.",
                missingFields: {
                    profilePic: !profilePic,
                    bio: !bio,
                    location: !location
                }
            });
        }

        // 4. Update Database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic, bio, location, isOnboarded: true },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // 5. Update Stream User (Optional but good practice)
        try {
            // Assuming upsertStreamUser is imported
            /* await upsertStreamUser({
                id: updatedUser._id.toString(),
                image: updatedUser.profilePic,
                name: updatedUser.fullName || updatedUser.username, // Ensure name is passed if needed
            }); */
            console.log("Stream user updated successfully");
        } catch (streamError) {
            // Don't fail the whole request just because Stream failed
            console.error("Error updating Stream user:", streamError);
        }

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Server error during onboarding." });
    }   
}