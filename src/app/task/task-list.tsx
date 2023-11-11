import React, { useState, useEffect } from "react";
import { TaskType } from "@/services/task-service";
import TaskDetail from "./task-detail";

const TaskList = ({ tasks }: { tasks: TaskType[] }) => {
  return (
    <div>
      {tasks.map((task: any) => (
        <TaskDetail key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
