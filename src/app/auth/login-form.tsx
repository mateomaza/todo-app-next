import React, { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/services/auth-service";
import ErrorComponent from "@/app/nav/error";
import axios from "axios";

type FormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const [loginData, setLoginData] = useState<FormData>({
    username: "jkj",
    password: "",
  });
  const [statusCode, setStatusCode] = useState<number>(0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value); // Add this to check if the event is firing correctly
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
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
        onChange={(e) => {
          console.log('Username field:', e.target.value);
          setLoginData({ ...loginData, username: e.target.value });
        }}
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
