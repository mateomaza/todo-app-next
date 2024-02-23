import { AxiosResponse } from "axios";
import { axiosInstance } from "./axios.instance";

export interface TaskType {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  time: string;
  createdAt: Date;
}

export const fetchTasks = async (userId?: string) => {
  try {
    const url = userId ? `tasks?userId=${userId}` : "tasks";
    const response: AxiosResponse<TaskType[]> = await axiosInstance.get(url);
    return response.data || [];
  } catch (err) {
    return [];
  }
};

export const fetchTaskById = async (id: string) => {
  return axiosInstance.get(`tasks/${id}`);
};

export const fetchUncompletedTasks = async () => {
  return axiosInstance.get("tasks/find/uncompleted");
};

export const createTask = async (taskData: any) => {
  return axiosInstance.post("tasks/create", taskData);
};

export const updateTask = async (id: string, taskData: any) => {
  return axiosInstance.patch(`tasks/${id}/update`, taskData);
};

export const deleteTask = async (TaskObjectId: string | undefined) => {
  return axiosInstance.delete(`tasks/${TaskObjectId}/delete`);
};
