import axios from "axios";
import { toast } from "react-toastify";

export const authFetch = axios.create({ baseURL: "/api" });

authFetch.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    config.headers["Authorization"] = `Bearer ${user.token}`;
  }
  return config;
});

authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 403) {
      toast.error(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);
