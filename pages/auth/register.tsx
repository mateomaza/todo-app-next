import { useEffect } from "react";
import Link from "next/link";
import RegisterForm from "@/app/auth/register.form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { resetErrorAction } from "@/redux/slices/auth.slice";
import Loading from "@/app/nav/loading";
import Head from "next/head";

export default function Register() {
  const { loading } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(resetErrorAction());
  }, [dispatch]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.holi.website/auth/register" />
      </Head>
      <div className="flex flex-row items-center justify-center h-[100vh]">
        <div className="flex flex-col bg-slate-900 text-white px-8 py-6 rounded-[10px]">
          <h1 className="text-center font-bold text-[20px] mb-4">Register</h1>
          <RegisterForm />
          <p className="py-4 text-center">
            Already got an account?{" "}
            <Link href="/auth/login" className="underline text-blue-500 ml-2">
              Click here to login.
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
