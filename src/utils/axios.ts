import axios from "axios";
const axiosInstance = axios.create({
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "cache-control": "no-cache",
    cache: "no-cache"
  }
});

export default axiosInstance;
