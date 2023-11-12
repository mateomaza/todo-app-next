import React, {useState} from "react";
import { TaskType } from "@/services/task-service";
import TaskForm from "./task-form";
import TaskModal from "./task-modal";
import Button from "@mui/material/Button";

const TaskDetail = ({ task, setTasks }: { task: any, setTasks: (tasks: TaskType[]) => void; }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.completed ? "Completed" : "Pending"}</p>
      <Button variant="outlined" onClick={handleOpen}>
        Update Task
      </Button>
      <TaskModal open={modalOpen} handleClose={handleClose}>
        <TaskForm task={task} setTasks={setTasks} />
      </TaskModal>
    </div>
  );
};

export default TaskDetail;
