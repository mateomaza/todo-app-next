import React, { useState } from 'react';
import axios from 'axios';
import { createTask, updateTask } from '@/services/task-service';
import { TaskType } from '@/services/task-service';
import { fetchTasks } from '@/services/task-service';
import ErrorComponent from '../nav/error';

const TaskForm = ({ task = null, setTasks }: { task?: any; setTasks: (tasks: TaskType[]) => void }) => {
  const [title, setTitle] = useState<string>(task?.title || '');
  const [description, setDescription] = useState<string>(task?.description || '');
  const [completed, setCompleted] = useState<boolean>(task?.completed || false);
  const [time, setTime] = useState<string>(task?.time || '');
  const [statusCode, setStatusCode] = useState<number>(0);

  const refreshTasks = async () => {
    try {
      const response = await fetchTasks(); 
      setTasks(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status) {
        setStatusCode( error.response?.status);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = { title, description, completed, time };
    if (task) {
      await updateTask(task.id, taskData);
    } else {
      await createTask(taskData);
    }
    refreshTasks();
  };

  if (statusCode) return <ErrorComponent statusCode={statusCode} />;

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <label>
        Completed:
        <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
      </label>
      <button type="submit">{task ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;