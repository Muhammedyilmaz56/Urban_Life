import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

/**
 * Centralized HTTP client for API communications.
 * Automatically attaches authorization token from AsyncStorage.
 */
const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - could clear token and redirect to login
    if (error.response?.status === 401) {
      // AsyncStorage.removeItem("token");
      // Optionally trigger logout/redirect
    }
    return Promise.reject(error);
  }
);

// Export as both default and named export for compatibility
export { client as http };
export default client;
