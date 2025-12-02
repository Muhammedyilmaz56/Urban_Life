import client from "./client";
import { Complaint, CreateComplaintDto, UpdateStatusDto } from "../types";

export async function createComplaint(body: CreateComplaintDto): Promise<Complaint> {
  const { data } = await client.post<Complaint>("/complaints/", body);
  return data;
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const { data } = await client.get<Complaint[]>("/complaints/my");
  return data;
}

export async function changeComplaintStatus(id: number, body: UpdateStatusDto): Promise<Complaint> {
  const { data } = await client.patch<{ complaint: Complaint }>(`/complaints/${id}/status`, body);
  return data.complaint;
}
