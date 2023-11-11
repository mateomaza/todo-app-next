import { useState, useEffect } from "react";
import { fetchTasks } from "@/services/task-service";
import TaskList from "@/app/task/task-list";
import TaskForm from "@/app/task/task-form";
import { TaskType } from "@/services/task-service";
import Loading from "@/app/nav/loading";
import PrivateRoute from "@/services/private-route";

const HomePage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response);
    };
    getTasks();
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <PrivateRoute>
      <h1>Tasks</h1>
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} />
    </PrivateRoute>
  );
};

export default HomePage;
