import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.code; // Read the custom code

    // 1. SAFETY CHECK: Ignore Login/Register routes completely
    // We never want to auto-refresh when the user is TRYING to log in.
    if (originalRequest.url.includes("/login") || originalRequest.url.includes("/register")) {
        return Promise.reject(error);
    }

    // 2. TOKEN CHECK: Only refresh if it is actually EXPIRED
    if (error.response?.status === 401 && errorCode === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Token expired, attempting silent refresh...");
        
        await axios.post("http://localhost:8000/api/v1/users/refresh-token", {}, { withCredentials: true });
        
        console.log("Refresh success, retrying original request...");
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error("Refresh failed. Session ended.");
        if(window.location.pathname !== "/login"){
          window.location.href = "/login"; 
        }
        return Promise.reject(refreshError);
      }
    }

    // If it's a 401 but NOT expired (e.g. INVALID_TOKEN or NO_TOKEN), 
    // it usually means they were never logged in or something is wrong.
    if (error.response?.status === 401 && errorCode !== "TOKEN_EXPIRED") {
        // Optional: Redirect to login if they aren't even allowed to be here
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }

    return Promise.reject(error);
  }
);


export {api}