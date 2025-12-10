
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export interface OfficialComplaint {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  address?: string;
  support_count?: number;
  category?: {
    id: number;
    name: string;
  };
}

export const fetchOfficialComplaints = async (): Promise<OfficialComplaint[]> => {
  const token = await AsyncStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/official/complaints`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
