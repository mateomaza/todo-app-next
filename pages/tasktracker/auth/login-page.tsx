import Link from "next/link";
import { LoginForm } from "@/app/auth/login-form";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Haven&apos;t got an account?{" "}
        <Link href="/register">
          <a>Click here to register</a>
        </Link>
      </p>
    </div>
  );
}
