import React from 'react';
import TaskForm from '@/app/task/task-form';
import { TaskType } from '@/services/task-service';
import { useRouter } from 'next/router';

const CreateTaskPage = () => {
  const router = useRouter();
  const setTasks = (tasks: TaskType[]) => {
    router.push('/');
  };

  return (
    <div>
      <h1>Create New Task</h1>
      <TaskForm setTasks={setTasks} />
    </div>
  );
};

export default CreateTaskPage;
