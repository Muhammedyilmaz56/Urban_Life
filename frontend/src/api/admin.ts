import { http } from "./http";



export type AdminStatsOverview = {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
};
export type AdminCategory = {
  id: number;
  name: string;
  created_at?: string | null;
};
export type AdminStatsDetail = {
  total_users: number;
  users_by_role: Record<string, number>;
  total_complaints: number;
  complaints_by_status: Record<string, number>;
  complaints_last_7_days: number;
};



export const adminApi = {
  
  statsOverview: async (): Promise<AdminStatsOverview> => {
    const res = await http.get("/admin/stats/overview");
    return res.data;
  },

  statsDetail: async (): Promise<AdminStatsDetail> => {
    const res = await http.get("/admin/stats");
    return res.data;
  },

  listOfficials: async (params?: { q?: string; is_active?: boolean }) => {
    const res = await http.get("/admin/officials", { params });
    return res.data;
  },

  createOfficial: async (payload: {
    full_name: string;
    email: string;
    password: string;
    phone_number?: string | null;
  }) => {
    const res = await http.post("/admin/officials", payload);
    return res.data;
  },

  getOfficial: async (officialId: number) => {
    const res = await http.get(`/admin/officials/${officialId}`);
    return res.data;
  },

  updateOfficial: async (
    officialId: number,
    payload: { full_name?: string; phone_number?: string; is_active?: boolean }
  ) => {
    const res = await http.put(`/admin/officials/${officialId}`, payload);
    return res.data;
  },

  listUsers: async (params?: { q?: string; role?: string; is_active?: boolean }) => {
    const res = await http.get("/admin/users", { params });
    return res.data;
  },

  audit: async (limit: number = 100) => {
    const res = await http.get("/admin/audit", { params: { limit } });
    return res.data;
  },
  
  listCategories: async (): Promise<AdminCategory[]> => {
    const res = await http.get("/admin/categories");
    return res.data;
  },

  createCategory: async (payload: { name: string }): Promise<AdminCategory> => {
    const res = await http.post("/admin/categories", payload);
    return res.data;
  },

  updateCategory: async (categoryId: number, payload: { name: string }): Promise<AdminCategory> => {
    const res = await http.put(`/admin/categories/${categoryId}`, payload);
    return res.data;
  },

  deleteCategory: async (categoryId: number): Promise<{ ok: boolean }> => {
    const res = await http.delete(`/admin/categories/${categoryId}`);
    return res.data;
  },
};
