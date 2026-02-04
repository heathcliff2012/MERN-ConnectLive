import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  withCredentials: true,
},
console.log(`Axios instance created with baseURL: ${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`));