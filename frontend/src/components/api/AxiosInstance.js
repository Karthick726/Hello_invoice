import axios from "axios";
const AxiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://hello-invoice-backend.vercel.app",
  withCredentials: true,
  timeout: 900000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
