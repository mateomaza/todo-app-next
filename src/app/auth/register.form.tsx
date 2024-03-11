import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { register } from "@/redux/thunks/auth.thunks";
import { RootState } from "@/redux/store";
import Error from "@/app/nav/error";
import Cookies from 'js-cookie';

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
  const [validationError, setValidationError] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const auth_cookie = Cookies.get('authenticated');

  useEffect(() => {
    if (auth_cookie && !loading && !error) {
      router.push("/");
    }
  }, [auth_cookie, loading, error, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const modifiedRegisterData = {
      ...registerData,
      username: registerData.username.toLowerCase(),
    };
    const response = await fetch("/api/register-validation", {
      method: "POST",
      body: JSON.stringify(modifiedRegisterData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(register(modifiedRegisterData));
    } else {
      const data = await response.json();
      setValidationError(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <p className="text-[16px] font-semibold">Username</p>
      <input
        type="text"
        value={registerData.username}
        onChange={handleChange}
        placeholder="Username"
        name="username"
        className="my-2 py-2 px-3 rounded-[5px] text-black"
        required
        autoComplete="username"
      />
      <p className="text-[16px] font-semibold">Email</p>
      <input
        type="email"
        value={registerData.email}
        onChange={handleChange}
        placeholder="Email"
        name="email"
        className="my-2 py-2 px-3 rounded-[5px] text-black"
        required
        autoComplete="email"
      />
      <p className="text-[16px] font-semibold">Password</p>
      <input
        type="password"
        value={registerData.password}
        onChange={handleChange}
        placeholder="Password"
        name="password"
        className="my-2 py-2 px-3 rounded-[5px] text-black"
        required
      />
      <div className="my-5">
        <ul>
          <li>
          ▫️ Username must be 3-20 characters long and can only include
            alphanumeric characters.
          </li>
          <li>▫️ Password must be at least 12 characters long.</li>
          <li>▫️ Password must include both alphabetic and numeric characters.</li>
          <li>▫️ Password cannot contain your username.</li>
        </ul>
      </div>
      {error || validationError && (
          <div className="my-3">
            <Error errorMessage={error || validationError} />
          </div>
        )}
      <button
        type="submit"
        disabled={loading}
        className="bg-lime-500 hover:bg-lime-600 text-[18px] font-bold py-2 my-3 rounded-[4px]"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
