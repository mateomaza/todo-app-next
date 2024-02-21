import React, { useState } from "react";
import { TaskType } from "@/services/task.service";
import TaskDetail from "./task.detail";
import TaskModal from "./task.modal";

const TaskList = ({ tasks, setTasks }: { tasks: TaskType[], setTasks: (tasks: TaskType[]) => void; }) => {
  return (
    <div>
      {tasks.map((task: TaskType) => (
        <TaskDetail key={task.id} task={task} setTasks={setTasks} />
      ))}
    </div>
  );
};

export default TaskList;
