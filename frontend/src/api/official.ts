
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import client from "./client";
export interface OfficialComplaint {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  address?: string;
  support_count?: number;
  reject_reason?: string;
  category?: {
    id: number;
    name: string;
  };
  photos?: { id: number; url: string }[];
  resolution_photos?: { id: number; url: string }[];
  latitude?: number;
  longitude?: number;
}

export interface Worker {
  id: number;
  user_id: number;
  full_name: string;
  is_active: boolean;
  category_id: number;
}

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchOfficialComplaints = async (): Promise<OfficialComplaint[]> => {
  const headers = await getAuthHeaders();
  const res = await client.get(`${BASE_URL}/official/complaints`, { headers });
  return res.data;
};

export const fetchOfficialComplaintDetail = async (
  id: number
): Promise<OfficialComplaint> => {
  const headers = await getAuthHeaders();
  const res = await client.get(`${BASE_URL}/official/complaints/${id}`, {
    headers,
  });
  return res.data;
};

export const rejectComplaint = async (id: number, reason: string) => {
  const headers = await getAuthHeaders();
  const res = await client.post(
    `${BASE_URL}/official/complaints/${id}/reject`,
    null,
    {
      params: { reason },
      headers,
    }
  );
  return res.data;
};

export const fetchWorkers = async (): Promise<Worker[]> => {
  const headers = await getAuthHeaders();
  const res = await client.get(`${BASE_URL}/workers`, { headers });
  return res.data;
};

export const assignComplaintToEmployee = async (
  complaintId: number,
  employeeId: number
) => {
  const headers = await getAuthHeaders();
  const res = await client.post(
    `${BASE_URL}/official/complaints/${complaintId}/assign`,
    null,
    {
      params: { employee_id: employeeId },
      headers,
    }
  );
  return res.data;
};
