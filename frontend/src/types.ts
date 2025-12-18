
export type ComplaintPhoto = {
  id: number;
  photo_url: string;
  created_at: string;
};

export type Complaint = {
  id: number;
  user_id: number;
  title: string | null;       
  description: string;
  category_id?: number | null;
  status: "pending" | "in_progress" | "resolved"| "assigned"|"rejected";
  priority: "low" | "medium" | "high";
  latitude?: number | null;
  longitude?: number | null;

  
  photo_url?: string | null;

  is_anonymous: boolean;
  support_count: number;

  created_at: string;
  updated_at: string;

  photos?: ComplaintPhoto[];   
};

export interface CreateComplaintDto {
  title: string;
  description: string;
  category_id: number;
  latitude: number;
  longitude: number;
  is_anonymous: boolean;
}

export type UpdateStatusDto = {
  status: "pending" | "in_progress" | "resolved";
};
