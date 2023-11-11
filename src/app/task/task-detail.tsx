import React from 'react';

const TaskDetail = ({ task }: { task: any }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
};

export default TaskDetail;
