import React, { useState } from "react";
import { TaskType } from "@/services/task.service";
import TaskForm from "./task.form";
import TaskModal from "./task.modal";
import Button from "@mui/material/Button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

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

  const [deleteModal, setDeleteModal] = useState(false);

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  return (
    <div>
      <div className="mt-10 bg-white shadow-md px-10 py-6 rounded-[8px] border border-[#eee]">
        <div className="flex flex-row flex-wrap justify-between">
          <div className="flex flex-col w-[12rem] 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Title</p>
            <h3 className="font-semibold text-[14px] text-gray-800">
              {task.title}
            </h3>
          </div>
          <div className="flex flex-col w-[13rem] 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Description</p>
            <p className="font-normal text-[13px] ">{task.description}</p>
          </div>
          <div className="flex flex-col smd:my-3 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Status</p>
            <p
              className={
                task.status == "Completed"
                  ? "text-green-500 font-semibold"
                  : "text-gray-500 font-semibold"
              }
            >
              {task.completed}
            </p>
          </div>
          <div className="flex flex-col 2md:mx-8">
            <p className="font-bold text-[16px] my-3 mr-10">Time</p>
            <h3 className="">{task.time}</h3>
          </div>
          <div className="flex flex-col justify-start my-3 2md:mx-8">
            <i
              className="fa-solid fa-trash-can text-gray-500 cursor-pointer"
              onClick={openDeleteModal}
            ></i>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start my-3 ">
      <Button variant="outlined" onClick={handleOpen} disabled={loading}>
        Update Task
      </Button>
      </div>
      <TaskModal open={deleteModal} handleClose={closeDeleteModal}>
        <div className="flex flex-col">
          <p>Are you sure want to delete this task?</p>
          <div className="flex flex-row items-center justify-end">
            <p
              className="mr-4 text-[14px] font-semibold text-gray-500 cursor-pointer"
              onClick={closeDeleteModal}
            >
              Cancel
            </p>
            <p className=" text-[14px] font-semibold text-blue-600 cursor-pointer">
              Delete
            </p>
          </div>
        </div>
      </TaskModal>
    </div>
  );
};

export default TaskDetail;
