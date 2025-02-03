import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://getpass.duckdns.org/",
  timeout: 10000,
});

export default axiosInstance;
