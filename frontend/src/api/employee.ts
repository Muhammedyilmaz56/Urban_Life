
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import client from "./client";
export type AssignedComplaint = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  address?: string | null;
  support_count?: number | null;
  category?: { id: number; name: string } | null;
  latitude?: number | null;
  longitude?: number | null;
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchAssignedComplaints = async (): Promise<AssignedComplaint[]> => {
  const headers = await getAuthHeaders();
  const res = await client.get(`${BASE_URL}/employee/complaints/assigned`, { headers });
  return res.data;
};
