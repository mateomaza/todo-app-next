import { useState, useEffect } from "react";
import { fetchTasks } from "@/services/task.service";
import TaskList from "@/app/task/task.list";
import TaskForm from "@/app/task/task.form";
import { TaskType } from "@/services/task.service";
import TaskModal from "@/app/task/task.modal";
import Button from "@mui/material/Button";
import Loading from "@/app/nav/loading";
import LogoutButton from "@/app/auth/logout.button";

const HomePage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response);
    };
    getTasks();
    setLoading(false);
  }, []);

  return (
    <>
      <LogoutButton />
      <h1>Tasks</h1>
      <Button variant="outlined" onClick={handleOpen}>
        Create a New Task
      </Button>
      <TaskModal open={isModalOpen} handleClose={handleClose}>
        <TaskForm setTasks={setTasks} />
      </TaskModal>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </>
  );
};

export default HomePage;
