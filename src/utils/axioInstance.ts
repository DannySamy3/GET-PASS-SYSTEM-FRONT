import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://getpass.duckdns.org/",
//   timeout: 10000,
//   // headers: {
//   //   "Content-Type": "multipart/form-data", // Ensure correct content type
//   // },
// });

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
  // headers: {
  //   "Content-Type": "multipart/form-data", // Ensure correct content type
  // },
});

export default axiosInstance;
