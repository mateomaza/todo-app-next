import Link from "next/link";
import { RegisterForm } from "@/app/auth/register-form";

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
      <p>
        Already got an account?{" "}
        <Link href="/login">
          <a>Click here to login</a>
        </Link>
      </p>
    </div>
  );
}
