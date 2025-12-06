import api from "./client";

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  const res = await api.post("/auth/change-password", data);
  return res.data;
};

export const updateProfile = async (data: {
  full_name?: string;
  phone?: string;
}) => {
  const res = await api.put("/users/me", data);
  return res.data;
};
export const uploadAvatar = async (fileUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);
  
    const res = await api.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };
