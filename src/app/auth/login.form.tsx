import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/thunks/auth.thunks";
import { RootState } from "@/redux/store";
import Error from "@/app/nav/error";
import { parseCookies } from "nookies";

type FormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const [loginData, setLoginData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [validationError, setValidationError] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && !loading && !error) {
      router.push("/");
    }
  }, [isAuthenticated, loading, error, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const modifiedLoginData = {
      ...loginData,
      username: loginData.username.toLowerCase(),
    };
    const response = await fetch("/api/login-validation", {
      method: "POST",
      body: JSON.stringify(modifiedLoginData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(login(modifiedLoginData));
    } else {
      const data = await response.json();
      setValidationError(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {(error || validationError) && (
        <Error errorMessage={error || validationError} />
      )}
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
      <button type="submit" disabled={loading} data-testid="login-button">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
