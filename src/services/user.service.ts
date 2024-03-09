import { axiosInstance } from "./axios.instance";

export const deleteUser = async (UserObjectId: string | undefined) => {
  return axiosInstance.delete(`auth/users/${UserObjectId}/delete`);
};
