export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskProps {
  task: Task;
}

export default function TaskComponent({ task }: TaskProps) {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.completed ? "Completed" : "Incomplete"}</p>
    </div>
  );
}
