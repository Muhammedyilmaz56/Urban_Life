
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

export interface EmployeeUser {
  id: number;
  name: string;
  email: string;
}

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchOfficialComplaints = async (): Promise<OfficialComplaint[]> => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/official/complaints`, { headers });
  return res.data;
};

export const fetchOfficialComplaintDetail = async (
  id: number
): Promise<OfficialComplaint> => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/official/complaints/${id}`, {
    headers,
  });
  return res.data;
};

export const rejectComplaint = async (id: number, reason: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(
    `${BASE_URL}/official/complaints/${id}/reject`,
    null,
    {
      params: { reason },
      headers,
    }
  );
  return res.data;
};


export const fetchEmployees = async (): Promise<EmployeeUser[]> => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/official/employees`, { headers });
  return res.data;
};

export const assignComplaintToEmployee = async (
  complaintId: number,
  employeeId: number
) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(
    `${BASE_URL}/official/complaints/${complaintId}/assign`,
    null,
    {
      params: { employee_id: employeeId },
      headers,
    }
  );
  return res.data;
};
