import { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { axiosInstance } from "@/services/axios.instance";
import { fetchTasks } from "@/services/task.service";
import TaskList from "@/app/task/task.list";
import TaskForm from "@/app/task/task.form";
import { TaskType } from "@/services/task.service";
import TaskModal from "@/app/task/task.modal";
import Button from "@mui/material/Button";
import Loading from "@/app/nav/loading";
import LogoutButton from "@/app/auth/logout.button";
import PrivateRoute from "@/services/private.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { UserSession } from "types/auth.types";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getIronSession<UserSession>(
    context.req,
    context.res,
    sessionOptions
  );
  if (session.user) {
    return {
      props: { session: session },
    };
  } else {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

type HomePageProps = {
  session: UserSession;
};

const HomePage: React.FC<HomePageProps> = ({ session }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const state = useSelector((state) => state);
  console.log(state);

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response);
    };
    if (session && !loading && !error) {
      getTasks();
    }
  }, [session, loading, error]);

  return (
    <PrivateRoute>
      <LogoutButton />
      <h1>Tasks</h1>
      <Button variant="outlined" onClick={handleOpen}>
        Create a New Task
      </Button>
      <TaskModal open={isModalOpen} handleClose={handleClose}>
        <TaskForm setTasks={setTasks} />
      </TaskModal>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </PrivateRoute>
  );
};

export default HomePage;
