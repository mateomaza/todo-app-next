import React, { useState, useEffect } from 'react';
import TaskForm from '@/app/task/task-form'; // Update the import path as needed
import { TaskType, fetchTaskById } from '@/services/task-service';
import { useRouter } from 'next/router';
import Loading from '@/app/nav/loading';

const UpdateTaskPage = () => {
  const [task, setTask] = useState<TaskType | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchTaskData = async () => {
        try {
          const fetchedTask = await fetchTaskById(id as string);
          setTask(fetchedTask);
        } catch (error) {
          console.error('Failed to fetch task:', error);
        }
      };
      fetchTaskData();
    }
  }, [id]);

  const setTasks = (tasks: TaskType[]) => {
    router.push('/');
  };

  if (!task) return <Loading/>

  return (
    <div>
      <h1>Update Task</h1>
      <TaskForm task={task} setTasks={setTasks} />
    </div>
  );
};

export default UpdateTaskPage;