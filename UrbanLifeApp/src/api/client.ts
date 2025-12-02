import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Token interceptor
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token"); // ← DÜZELTİLDİ

  if (token) {
    if (!config.headers) config.headers = {};

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
