import React, { useState } from "react";
import axios from "axios";
import { createTask, updateTask } from "@/services/task.service";
import { TaskType } from "@/services/task.service";
import { fetchTasks } from "@/services/task.service";
import ErrorComponent from "../nav/error";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "@mui/material/Switch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { verifyToken } from "@/redux/thunks/auth.thunks";
import { VerifyResponse } from "@/redux/types/auth.types";
import { useRouter } from "next/router";

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
  const getInitialDate = () => {
    if (task && task.time) {
      return new Date(task.time);
    } else {
      const newDate = new Date();
      newDate.setHours(newDate.getHours() + 1);
      return newDate;
    }
  };
  const initialDate = getInitialDate();

  const [taskData, setTaskData] = useState<FormData>({
    title: task?.title || "",
    description: task?.description || "",
    completed: task?.completed || false,
    time: initialDate,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const newValue =
      target.name === "completed" ? target.checked : target.value;

    setTaskData((prevState) => ({
      ...prevState,
      [target.name]: newValue,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setTaskData((prevState) => ({
        ...prevState,
        time: date,
      }));
    }
  };

  const refreshTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response?.status
          ? `Error: ${error.message} (with status: ${error.response.status})`
          : `Error: ${error.message}`;
        setErrorMessage(message);
      } else {
        setErrorMessage("An unkown error occurred");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const actionResult = await dispatch(verifyToken());
      const verificationResult = actionResult.payload as VerifyResponse;

      if (verificationResult && verificationResult.verified) {
        if (task) {
          await updateTask(task.id, {
            ...taskData,
            time: taskData.time.toISOString(),
          });
        } else {
          await createTask({ ...taskData, time: taskData.time.toISOString() });
        }
        refreshTasks();
      } else {
        setErrorMessage("Session verification failed. Please log in again.");
        router.push('/auth/login-page');
      }
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "An error occurred during verification.");
      router.push('/auth/login-page');
    }
  };

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Title"
        name="title"
        required
      />
      <textarea
        value={taskData.description}
        onChange={handleChange}
        placeholder="Description"
        name="description"
      />
      <label>
        Completed:
        <Switch
          checked={taskData.completed}
          onChange={handleChange}
          name="completed"
          color="primary"
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
