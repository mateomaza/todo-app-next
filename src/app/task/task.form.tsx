import React, { useState } from "react";
import axios from "axios";
import { createTask, updateTask } from "@/services/task.service";
import { TaskType } from "@/services/task.service";
import { fetchTasks } from "@/services/task.service";
import Error from "@/app/nav/error";
import Switch from "@mui/material/Switch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/thunks/auth.thunks";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MyDatePicker } from "../custom/date.picker";

type FormData = {
  title: string;
  description: string;
  completed: boolean;
  time: Date;
};

const TaskForm = ({
  task = null,
  setTasks,
  onClose,
}: {
  task?: any;
  setTasks: (tasks: TaskType[]) => void;
  onClose?: () => void;
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { UserObjectId, loading } = useSelector(
    (state: RootState) => state.auth
  );

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
      const response = await fetchTasks(UserObjectId);
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
      if (UserObjectId) {
        const taskPayload = {
          ...taskData,
          time: taskData.time.toISOString(),
          userId: UserObjectId,
        };
        if (task) {
          await updateTask(task.id, taskPayload);
        } else {
          await createTask(taskPayload);
          onClose?.();
        }
        refreshTasks();
      }
    } catch (error) {
      const err = error as { message?: string };
      await dispatch(logout());
        fetch("/api/logout-session", { method: "POST" })
          .then(() => {
            router.push("/auth/login");
          })
          .catch((error) => {
            console.error(error);
          });
      setErrorMessage(err.message || "An error occurred during verification.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <p className="text-[16px] font-semibold py-3">Task Title:</p>
      <input
        type="text"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Title"
        name="title"
        className="bg-white border border-[#aba9a9] mb-3 py-1 px-3 rounded-[3px] text-black text-[14px] shadow-inner"
        required
      />
      <p className="text-[16px] font-semibold py-3">Task Description:</p>
      <textarea
        value={taskData.description}
        onChange={handleChange}
        placeholder="Description"
        className="bg-white border border-[#aba9a9] mb-3 py-1 px-3 rounded-[3px] text-black text-[14px] shadow-inner"
        name="description"
      />
      <label className="text-[16px] font-semibold py-3">
        Completed:
        <Switch
          checked={taskData.completed}
          onChange={handleChange}
          name="completed"
          color="primary"
        />
      </label>
      <div className="flex flex-row items-center">
        <p className="text-[16px] font-semibold py-3 mr-3">
          When are you doing this task?
        </p>
        <MyDatePicker selected={taskData.time} onChange={handleDateChange} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white font-bold text-[18px] py-2 px-5 rounded-[8px] mt-3 hover:bg-blue-800"
      >
        {task ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
