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

export const fetchTasks = async () => {
  try {
    const response: AxiosResponse<TaskType[]> = await axiosInstance.get(
      "tasks"
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
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

export const deleteTask = async (id: string) => {
  return axiosInstance.delete(`tasks/${id}/delete`);
};
