import React, { useState } from "react";
import DeleteButton from "@/app/nav/delete.button";
import { TaskType, deleteTask, fetchTasks } from "@/services/task.service";
import axios from "axios";
import Error from "@/app/nav/error";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface TaskDeleteProps {
  TaskObjectId: string | undefined;
  setTasks: (tasks: TaskType[]) => void;
}

const TaskDelete: React.FC<TaskDeleteProps> = ({ TaskObjectId, setTasks }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { UserObjectId } = useSelector((state: RootState) => state.auth);

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

  const handleTaskDeletion = async () => {
    setErrorMessage("");
    try {
      await deleteTask(TaskObjectId);
      await refreshTasks();
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "An error occurred during task deletion.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <DeleteButton
      onDelete={handleTaskDeletion}
      title="Confirm Task Deletion"
      description="Are you sure you want to delete this task?"
      taskDelete={true}
    />
  );
};

export default TaskDelete;
