import axios from "axios";
import https from "https";

// const axiosInstance = axios.create({
//   baseURL: "https://getpass.duckdns.org/",
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false,
//   }),
// } as any);

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add an interceptor to handle multipart/form-data requests
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers = config.headers || {};
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export default axiosInstance;
