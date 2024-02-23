
import { axiosInstance } from "./axios.instance";

export const deleteUser = async (UserObjectId: string | undefined) => {
    return axiosInstance.delete(`users/${UserObjectId}/delete`);
  };