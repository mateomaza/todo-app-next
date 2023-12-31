import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store'; 
import { login } from '@/redux/thunks/auth.thunks';
import { RootState } from '@/redux/store';
import Error from "@/app/nav/error";

type FormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const [loginData, setLoginData] = useState<FormData>({
    username: "",
    password: "",
  });
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated && !error) {
      router.push("/");
    }
  }, [isAuthenticated, error, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(loginData));
  };

  if (error) {
    return <Error errorMessage={error} />;
  }

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
      <button type="submit" disabled={loading}>Login</button>
    </form>
  );
};

export default LoginForm;
