
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
  const { data } = await client.patch<Complaint>(`/complaints/${id}/status`, body);
  return data;
}


export async function getFeed(
  sort: "newest" | "popular" | "nearby" = "newest"
): Promise<Complaint[]> {
  const { data } = await client.get<Complaint[]>("/complaints/feed", {
    params: { sort },
  });
  return data;
}


export async function toggleSupport(complaintId: number): Promise<{
  status: "added" | "removed";
  support_count: number;
}> {
  const { data } = await client.post<{
    status: "added" | "removed";
    support_count: number;
  }>(`/complaints/${complaintId}/support`);

  return data;
}
