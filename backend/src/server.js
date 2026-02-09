import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js';
import postRoutes from './routes/post.route.js';
import { connectDB } from './lib/db.js';

import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    "http://localhost:5173",           // Keep this for local dev
    "http://13.201.87.111:5173"        // <--- ADD THIS (Your AWS Frontend)
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/posts',postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDB();
});