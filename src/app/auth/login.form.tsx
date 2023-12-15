import React, { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/services/auth.service";
import ErrorComponent from "@/app/nav/error";
import axios from "axios";

type FormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const [loginData, setLoginData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [statusCode, setStatusCode] = useState<number>(0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
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
        value={loginData.username}
        onChange={handleChange}
        placeholder="Username"
        name="username"
        required
      />
      <input
        type="password"
        value={loginData.password}
        onChange={handleChange}
        placeholder="Password"
        name="password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
