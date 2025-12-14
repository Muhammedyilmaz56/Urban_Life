import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export type Category = { id: number; name: string };

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchCategories = async (): Promise<Category[]> => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/categories`, { headers });
  return res.data;
};
