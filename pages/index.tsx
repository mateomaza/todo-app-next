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
import UserDelete from "@/app/auth/user/user.delete";
import Header from "@/app/nav/header";

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
        props: { session: session },
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
};

const HomePage: React.FC<HomePageProps> = ({ session }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { UserObjectId, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const getTasks = async (UserObjectId: string) => {
      try {
        const response = await fetchTasks(UserObjectId);
        setTasks(response);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    if (session && UserObjectId && !loading && !error) {
      getTasks(UserObjectId);
    }
  }, [session, UserObjectId, loading, error]);

  if (loading) {
    return <Loading loading={loading} />;
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
          <h1 style={{ fontSize: "26px" }}>Tasks</h1>
          <Button variant="outlined" onClick={handleOpen}>
            Create a New Task
          </Button>
        </div>
        <TaskModal open={isModalOpen} handleClose={handleClose}>
          <TaskForm setTasks={setTasks} />
        </TaskModal>
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
    </PrivateRoute>
  );
};

export default HomePage;
