import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store'; 
import { register } from '@/redux/thunks/auth.thunks';
import { RootState } from '@/redux/store';
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register(registerData));
  };

  if (!loading && !error) {
    router.push("/");
  }

  if (error) {
    return <ErrorComponent errorMessage={error} />;
  }

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
