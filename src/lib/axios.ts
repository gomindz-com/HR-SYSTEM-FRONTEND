import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

// Add request interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Authentication error detected, clearing token");

      // Clear the invalid token
      localStorage.removeItem("jwt_token");

      // Clear auth user from store
      // We'll need to import the store here or handle this differently
      // For now, we'll dispatch a custom event that the app can listen to
      window.dispatchEvent(
        new CustomEvent("auth-error", {
          detail: { message: "Session expired. Please log in again." },
        })
      );
    }
    return Promise.reject(error);
  }
);
