import React from "react";
import { TaskType } from "@/services/task.service";
import TaskDetail from "./task.detail";

const TaskList = ({ tasks, setTasks }: { tasks: TaskType[], setTasks: (tasks: TaskType[]) => void; }) => {
  return (
    <div>
      {tasks.map((task: any) => (
        <TaskDetail key={task.id} task={task} setTasks={setTasks}/>
      ))}
    </div>
  );
};

export default TaskList;
