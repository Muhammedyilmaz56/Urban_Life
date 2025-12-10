import client from "./client";
import { Complaint, CreateComplaintDto, UpdateStatusDto } from "../types";
import { Asset } from "react-native-image-picker";


export const createComplaint = async (payload: CreateComplaintDto) => {
  const res = await client.post("/complaints", payload);
  return res.data;
};


export const uploadComplaintPhotos = async (
  complaintId: number,
  images: Asset[]
) => {
  const formData = new FormData();

  images.forEach((img, index) => {
    if (!img.uri) return;

    formData.append("files", {
      
      uri: img.uri,
      name: img.fileName || `image_${index}.jpg`,
      type: img.type || "image/jpeg",
    } as any);
  });

  const res = await client.post(
    `/complaints/${complaintId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export async function getMyComplaints(): Promise<Complaint[]> {
  const { data } = await client.get<Complaint[]>("/complaints/my");
  return data;
}

export async function changeComplaintStatus(
  id: number,
  body: UpdateStatusDto
): Promise<Complaint> {
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

export async function toggleSupport(
  complaintId: number
): Promise<{
  status: "added" | "removed";
  support_count: number;
}> {
  const { data } = await client.post<{
    status: "added" | "removed";
    support_count: number;
  }>(`/complaints/${complaintId}/support`);

  return data;
}
export async function deleteComplaint(id: number): Promise<void> {
  await client.delete(`/complaints/${id}`);
}

export async function deleteComplaintPhoto(photoId: number): Promise<void> {
  await client.delete(`/complaints/photos/${photoId}`);
}
