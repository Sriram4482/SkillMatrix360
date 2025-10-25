import axios from "axios";

const api = axios.create({
  baseURL: "https://skillmatrix360-backend.onrender.com/api",
});

export default api;