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
import DOMPurify from "isomorphic-dompurify";
import Error from "@/app/nav/error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { resetErrorAction } from "@/redux/slices/auth.slice";
import Head from "next/head";

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
  const [smallScreen, setSmallScreen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { UserObjectId, user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const safeUsername = DOMPurify.sanitize(user?.username as string);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(resetErrorAction());
  }, [dispatch]);

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

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 576);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading && loadingTasks) {
    return <Loading loading={loading || loadingTasks} />;
  }

  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.holi.website" />
      </Head>
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
          <UserDelete />
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
            {error && <Error errorMessage={error} />}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!smallScreen ? (
                <>
                  <h1 style={{ fontSize: "23px", marginBottom: "1rem" }}>
                    Hey {safeUsername}!{" "}
                    {tasks.length > 0
                      ? "Your tasks are here:"
                      : "Any task for today?"}
                  </h1>
                  <Button
                    variant="outlined"
                    onClick={handleOpen}
                    disabled={loading}
                  >
                    Create a New Task
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="mb-"
                    variant="outlined"
                    onClick={handleOpen}
                    disabled={loading}
                  >
                    Create a New Task
                  </Button>
                  <h1 style={{ fontSize: "17px" }} className="mt-4">
                    Hey {safeUsername}!{" "}
                    {tasks.length > 0
                      ? "Your tasks are here:"
                      : "Any task for today?"}
                  </h1>
                </>
              )}
            </div>
            <TaskModal open={modalOpen} handleClose={handleClose}>
              <TaskForm setTasks={setTasks} onClose={handleClose} />
            </TaskModal>
            <TaskList tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
      </PrivateRoute>
    </>
  );
};

export default HomePage;
