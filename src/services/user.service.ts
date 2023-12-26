
import { axiosInstance } from "./axios.instance";

export const deleteUser = async (id: string) => {
    return axiosInstance.delete(`users/${id}/delete`);
  };