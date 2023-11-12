import { useState, useEffect } from "react";
import { fetchTasks } from "@/services/task-service";
import TaskList from "@/app/task/task-list";
import TaskForm from "@/app/task/task-form";
import { TaskType } from "@/services/task-service";
import TaskModal from "@/app/task/task-modal";
import Button from "@mui/material/Button";
import Loading from "@/app/nav/loading";
import PrivateRoute from "@/services/private-route";

const HomePage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
    <PrivateRoute>
      <h1>Tasks</h1>
      <Button variant="outlined" onClick={handleOpen}>
        Create a New Task
      </Button>
      <TaskModal open={modalOpen} handleClose={handleClose}>
        <TaskForm setTasks={setTasks} />
      </TaskModal>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </PrivateRoute>
  );
};

export default HomePage;
