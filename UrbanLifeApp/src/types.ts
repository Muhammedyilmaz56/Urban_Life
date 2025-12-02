export type Complaint = {
    id: number;
    user_id: number;
    description: string;
    category_id?: number | null;
    status: "pending" | "in_progress" | "resolved";
    priority: "low" | "medium" | "high";
    latitude?: number | null;
    longitude?: number | null;
    photo_url?: string | null;
    created_at: string;
    updated_at: string;
  };

  export type CreateComplaintDto = {
    description: string;
    latitude?: number;
    longitude?: number;
    photo_url?: string;
  };

  export type UpdateStatusDto = {
    status: "pending" | "in_progress" | "resolved";
  };
