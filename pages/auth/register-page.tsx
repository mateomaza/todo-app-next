import Link from "next/link";
import RegisterForm from "@/app/auth/register.form";

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
      <p>
        Already got an account?{" "}
        <Link href="/auth/login-page">Click here to login</Link>
      </p>
    </div>
  );
}
