import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { register } from "@/services/auth.service";
import ErrorComponent from "../nav/error";

type FormData = {
  username: string;
  password: string;
  email: string;
};

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });
  const [statusCode, setStatusCode] = useState<number>(0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(registerData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response?.status) {
        setStatusCode(error.response?.status);
      }
    }
  };

  if (statusCode) return <ErrorComponent statusCode={statusCode} />;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={registerData.username}
        onChange={handleChange}
        placeholder="Username"
        name="username"
        required
      />
      <input
        type="email"
        value={registerData.email}
        onChange={handleChange}
        placeholder="Email"
        name="email"
        required
      />
      <input
        type="password"
        value={registerData.password}
        onChange={handleChange}
        placeholder="Password"
        name="password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
