import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // ✅ THIS LINE IS CRITICAL
});

export default API;