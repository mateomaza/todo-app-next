import { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { fetchTasks } from "@/services/task.service";
import TaskList from "@/app/task/task.list";
import TaskForm from "@/app/task/task.form";
import { TaskType } from "@/services/task.service";
import TaskModal from "@/app/task/task.modal";
import Button from "@mui/material/Button";
import Loading from "@/app/nav/loading";
import PrivateRoute from "@/services/private.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import nookies from "nookies";
import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { UserSession } from "types/session.types";
import UserDelete from "@/app/auth/user/user.delete";
import Header from "@/app/nav/header";
import DOMPurify from 'isomorphic-dompurify';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = nookies.get(context);
  const auth_cookie = cookies["authenticated"];
  if (auth_cookie) {
    const session = await getIronSession<UserSession>(
      context.req,
      context.res,
      sessionOptions
    );
    if (session.user) {
      return {
        props: { auth_cookie: auth_cookie },
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
  auth_cookie: string;
};

const HomePage: React.FC<HomePageProps> = ({ auth_cookie }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { UserObjectId, user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const safeUsername = DOMPurify.sanitize(user?.username as string);

  useEffect(() => {
    const getTasks = async () => {
      if (auth_cookie && user && !loading && !error) {
        const response = await fetchTasks(UserObjectId);
        setTasks(response);
        setLoadingTasks(false);
      } else {
        setLoadingTasks(false);
      }
    };
    getTasks();
  }, [auth_cookie, user, UserObjectId, loading, error]);

  useEffect(() => {
    const getTasks = async () => {
      if (auth_cookie && user && !loading && !error) {
        const response = await fetchTasks(UserObjectId);
        setTasks(response);
        setLoadingTasks(false);
      } else {
        setLoadingTasks(false);
      }
    };
    getTasks();
  }, [auth_cookie, user, UserObjectId, loading, error]);

  if (loading && loadingTasks) {
    return <Loading loading={loading || loadingTasks} />;
  }

  return (
    <PrivateRoute>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "-10px",
          padding: "0px",
          height: "100vh",
        }}
      >
        <Header />
        <div className="sidebar flex flex-col justify-end mr-5 py-4 px-9 bg-slate-300 border-r-2 border-gray-500 fixed min-h-screen ">
          <UserDelete UserObjectId={UserObjectId} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "7rem",
            width: "100%",
            padding: "0 2rem",
          }}
          className="ml-[16rem] smd:ml-0"
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "23px" }}>Hey {safeUsername}! Your tasks are here:</h1>
            <Button variant="outlined" onClick={handleOpen} disabled={loading}>
              Create a New Task
            </Button>
          </div>
          <TaskModal open={modalOpen} handleClose={handleClose}>
            <TaskForm setTasks={setTasks} />
          </TaskModal>
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </PrivateRoute>
  );
};

export default HomePage;
