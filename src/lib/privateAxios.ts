import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with default configuration
const privateAxios: AxiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token
privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;

    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token might be expired or invalid
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_token");
            // Optionally redirect to login page
            window.location.href = "/admin/login";
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access denied:", data?.error || "Forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found:", data?.error || "Not found");
          break;
        case 500:
          // Server error
          console.error(
            "Server error:",
            data?.error || "Internal server error",
          );
          break;
        default:
          console.error("API Error:", data?.error || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    } else {
      // Other error
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Helper functions for common HTTP methods
export const api = {
  // GET request
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.get<T>(url, config);
  },

  // POST request
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.post<T>(url, data, config);
  },

  // PUT request
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.delete<T>(url, config);
  },
};

// Export the configured axios instance
export default privateAxios;

// Export types for better TypeScript support
export type { AxiosRequestConfig, AxiosResponse } from "axios";
