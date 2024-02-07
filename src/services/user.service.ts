
import { axiosInstance } from "./axios.instance";

export const deleteUser = async (id: string | undefined) => {
    return axiosInstance.delete(`users/${id}/delete`);
  };