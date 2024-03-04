import Link from "next/link";
import LoginForm from "@/app/auth/login.form";

export default function Login() {
  return (
    <div className="flex flex-row items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-slate-900 text-white px-8 py-6 rounded-[10px]">
        <h1 className="text-center font-bold text-[20px] mb-4">Login</h1>
        <LoginForm />
        <p className="py-1">
          Haven&apos;t got an account?{" "}
          <Link href="/auth/register" className="underline text-blue-500 ml-2">
            Click here to register.
          </Link>
        </p>
      </div>
    </div>
  );
}
