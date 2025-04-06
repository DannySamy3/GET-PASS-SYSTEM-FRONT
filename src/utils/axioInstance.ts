import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://getpass.duckdns.org/",
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/",
//   timeout: 10000,
//   // headers: {
//   //   "Content-Type": "multipart/form-data", // Ensure correct content type
//   // },
// });
// Add an interceptor to handle multipart/form-data requests
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers = config.headers || {};
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export default axiosInstance;
