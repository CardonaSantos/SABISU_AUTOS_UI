import axios from "axios";
import type { UserProfile, UsersProfile } from "./interfacesProfile";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export const getUserProfile = async (id: number): Promise<UserProfile> => {
  const res = await axios.get(
    `${VITE_CRM_API_URL}/user/user-profile-info/${id}`
  );
  return res.data;
};

export const updateUserProfile = async (
  id: number,
  userData: Partial<UserProfile>
): Promise<UserProfile> => {
  const res = await axios.put(
    `${VITE_CRM_API_URL}/user/user-profile/${id}`,
    userData
  );
  return res.data;
};

export const getProfiles = async (): Promise<UsersProfile[]> => {
  const response = await axios.get(
    `${VITE_CRM_API_URL}/user/get-user-profile-config`
  );
  return response.data;
};

export const deleteUserProfile = async (id: number): Promise<void> => {
  await axios.delete(`${VITE_CRM_API_URL}/user/user-profile/${id}`);
};

export const updateOneUserProfile = async (
  id: number,
  userData: Partial<UserProfile>
): Promise<UserProfile> => {
  const res = await axios.put(
    `${VITE_CRM_API_URL}/user/update-user-profile/${id}`,
    userData
  );
  return res.data;
};
