import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://13.201.87.111:5001/api",
  withCredentials: true,
},
console.log(`Axios instance created with baseURL: ${import.meta.env.VITE_API_BASE_URL || "http://13.201.87.111:5001/api"}`));