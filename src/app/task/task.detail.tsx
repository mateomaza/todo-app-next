import React, { useState } from "react";
import { TaskType } from "@/services/task.service";
import TaskForm from "./task.form";
import TaskModal from "./task.modal";
import Button from "@mui/material/Button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import TaskDelete from "./task.delete";
import DOMPurify from "isomorphic-dompurify";
import MomentTZ from "moment-timezone";

const TaskDetail = ({
  task,
  setTasks,
}: {
  task: any;
  setTasks: (tasks: TaskType[]) => void;
}) => {
  const { loading } = useSelector((state: RootState) => state.auth);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const safeTitle = DOMPurify.sanitize(task.title);
  const safeDescription = DOMPurify.sanitize(task.description);
  const safeTime = MomentTZ(task.time).format("MM/DD [at] h:mm A");

  return (
    <div>
      <div className="mt-8 bg-white shadow-md px-10 py-6 rounded-[8px] border border-[#eee]">
        <div className="flex flex-row flex-wrap justify-between">
          <div className="flex flex-col w-[12rem] 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Title</p>
            <h3
              className="font-semibold text-[14px] text-gray-800"
              dangerouslySetInnerHTML={{ __html: safeTitle }}
            ></h3>
          </div>
          <div className="flex flex-col w-[13rem] 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Description</p>
            <p
              className="font-normal text-[13px] "
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            ></p>
          </div>
          <div className="flex flex-col smd:my-3 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Status</p>
            <p
              className={
                task.completed === true
                  ? "text-green-500 font-semibold"
                  : "text-gray-500 font-semibold"
              }
            >
              {task.completed ? "Completed" : "Incomplete"}
            </p>
          </div>
          <div className="flex flex-col 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Time</p>
            <h3 className="">{safeTime}</h3>
          </div>
          <div className="flex flex-col justify-start my-3 2md:mx-8">
            <TaskDelete TaskObjectId={task._id} setTasks={setTasks} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start my-3 ">
        <div className="w-[8rem] font-medium px-3 py-2 rounded-[4px] text-center">
          <Button variant="outlined" onClick={handleOpen} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            Update Task
          </Button>
        </div>
      </div>
      <TaskModal open={modalOpen} handleClose={handleClose}>
        <TaskForm task={task} setTasks={setTasks} />
      </TaskModal>
    </div>
  );
};

export default TaskDetail;
