import api from "./client";
import axios from "axios";
import client from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
const getToken = async () => {
  const t = await AsyncStorage.getItem("accessToken");
  return t;
};
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
  phone_number?: string;
  tc_kimlik_no?: string;
  birth_date?: string;
  is_name_public?: boolean;
}) => {
  const res = await api.put("/users/profile", data);
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
export const requestEmailChange = async (new_email: string) => {
  const token = await getToken();
  const res = await client.post(
    `${BASE_URL}/users/me/email-change/request`,
    { new_email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const confirmEmailChange = async (code: string) => {
  const token = await getToken();
  const res = await client.post(
    `${BASE_URL}/users/me/email-change/confirm`,
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};