import Link from "next/link";
import LoginForm from "@/app/auth/login.form";
import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { UserSession } from "types/auth.types";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Haven&apos;t got an account?{" "}
        <Link href="/auth/register">Click here to register</Link>
      </p>
    </div>
  );
}
