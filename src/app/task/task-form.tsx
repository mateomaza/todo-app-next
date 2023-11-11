import React, { useState } from "react";
import axios from "axios";
import { createTask, updateTask } from "@/services/task-service";
import { TaskType } from "@/services/task-service";
import { fetchTasks } from "@/services/task-service";
import ErrorComponent from "../nav/error";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormData = {
  title: string;
  description: string;
  completed: boolean;
  time: Date;
};

const TaskForm = ({
  task = null,
  setTasks,
}: {
  task?: any;
  setTasks: (tasks: TaskType[]) => void;
}) => {
  const initialDate = task && task.time ? task.time : new Date();
  const [taskData, setTaskData] = useState<FormData>({
    title: task?.title || "",
    description: task?.description || "",
    completed: task?.completed || false,
    time: initialDate,
  });
  const [statusCode, setStatusCode] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setTaskData({
        ...taskData,
        time: date,
      });
    }
  };

  const refreshTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status) {
        setStatusCode(error.response?.status);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      await updateTask(task.id, {
        ...taskData,
        time: taskData.time.toISOString(),
      });
    } else {
      await createTask({ ...taskData, time: taskData.time.toISOString() });
    }
    refreshTasks();
  };

  if (statusCode) return <ErrorComponent statusCode={statusCode} />;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        value={taskData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <label>
        Completed:
        <input
          type="checkbox"
          checked={taskData.completed}
          onChange={handleChange}
        />
      </label>
      <DatePicker
        selected={taskData.time}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
      />
      <button type="submit">{task ? "Update Task" : "Create Task"}</button>
    </form>
  );
};

export default TaskForm;
