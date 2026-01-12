import {streamChat} from "stream-chat";
import dotenv from "dotenv";

dotenv.config();


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("Stream API key and secret must be set in environment variables.");
}

const streamClient = streamChat(apiKey, apiSecret);

export const createStreamUser = async (userData) => {
    try{
        const { id, fullName, profilePic } = userData;