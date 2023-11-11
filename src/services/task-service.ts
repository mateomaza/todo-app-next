import axios, {AxiosResponse} from "axios";

const API_URL = "http://localhost:3001/api/tasks";

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
      const response: AxiosResponse<TaskType[]> = await axios.get(`${API_URL}`);
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []
    }
  };

export const fetchTaskById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

export const fetchUncompletedTasks = async () => {
  return axios.get(`${API_URL}/find/uncompleted`);
};

export const createTask = async (taskData: any) => {
  return axios.post(`${API_URL}/create`, taskData);
};

export const updateTask = async (id: string, taskData: any) => {
  return axios.patch(`${API_URL}/${id}/update`, taskData);
};

export const deleteTask = async (id: string) => {
  return axios.delete(`${API_URL}/${id}/delete`);
};
