import { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
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
import nookies from "nookies";
import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { UserSession } from "types/auth.types";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = nookies.get(context);
  const refresh_token = cookies["refresh_token"];
  if (refresh_token) {
    const session = await getIronSession<UserSession>(
      context.req,
      context.res,
      sessionOptions
    );
    if (session.user) {
      return {
        props: { session: session, refresh_token: refresh_token },
      };
    }
  }
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
};

type HomePageProps = {
  session: UserSession;
  refresh_token: string;
};

const HomePage: React.FC<HomePageProps> = ({ session, refresh_token }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(token)

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response);
    };
    if (session && token && !loading && !error) {
      getTasks();
    }
  }, [session, token, loading, error]);

  if (loading) {
    return <Loading loading={loading} />;
  }

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
