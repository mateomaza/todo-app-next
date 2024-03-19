import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/thunks/auth.thunks";
import { RootState } from "@/redux/store";
import Error from "@/app/nav/error";
import Cookies from 'js-cookie';

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
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const auth_cookie = Cookies.get('authenticated');

  useEffect(() => {
    if (auth_cookie && !loading) {
      router.push("/");
    }
  }, [auth_cookie, loading, router]);

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
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <p className="text-[16px] font-semibold">Username</p>
        <input
          type="text"
          value={loginData.username}
          onChange={handleChange}
          placeholder="Username"
          name="username"
          className="my-2 py-2 px-3 rounded-[5px] text-black"
          required
          autoComplete="username"
        />
        <p className="text-[16px] font-semibold">Password</p>
        <input
          type="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Password"
          name="password"
          className="my-2 py-2 px-3 rounded-[5px] text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-lime-500 hover:bg-lime-600 text-[18px] font-bold py-2 my-3 rounded-[4px]"
        >
          Login
        </button>
        {error || validationError && (
          <div className="my-3">
            <Error errorMessage={error || validationError} />
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
