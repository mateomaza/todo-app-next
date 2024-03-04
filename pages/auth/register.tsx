import Link from "next/link";
import RegisterForm from "@/app/auth/register.form";

export default function Register() {
  return (
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
  );
}
