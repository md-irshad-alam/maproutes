import axios from "axios";

const apiclient = axios.create({
  baseURL: "https://kizenprojects.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
apiclient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiclient;
