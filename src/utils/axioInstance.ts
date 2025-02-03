import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://34.35.37.25:8000/",
  timeout: 10000,
});

export default axiosInstance;
