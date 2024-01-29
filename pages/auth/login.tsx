import Link from "next/link";
import LoginForm from "@/app/auth/login.form";
import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { UserSession } from "types/auth.types";

export default function Login() {
  const handleLogout = () => {
    fetch('/api/logout-session', { method: 'POST' });
  };
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Haven&apos;t got an account?{" "}
        <button onClick={handleLogout}></button>
        <Link href="/auth/register">Click here to register</Link>
      </p>
    </div>
  );
}
