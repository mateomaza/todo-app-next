import { useState, useEffect } from "react";
import { fetchTasks } from "@/services/task.service";
import TaskList from "@/app/task/task.list";
import TaskForm from "@/app/task/task.form";
import { TaskType } from "@/services/task.service";
import TaskModal from "@/app/task/task.modal";
import Button from "@mui/material/Button";
import Loading from "@/app/nav/loading";
import LogoutButton from "@/app/auth/logout.button";
import PrivateRoute from "@/services/private.route";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const HomePage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response);
    };
    if (token && isAuthenticated) {
      getTasks();
    }
  }, [token, isAuthenticated]);

  return (
    <PrivateRoute>
      <LogoutButton />
      <h1>Tasks</h1>
      <Button variant="outlined" onClick={handleOpen}>
        Create a New Task
      </Button>
      <TaskModal open={isModalOpen} handleClose={handleClose}>
        <TaskForm setTasks={setTasks} />
      </TaskModal>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </PrivateRoute>
  );
};

export default HomePage;
