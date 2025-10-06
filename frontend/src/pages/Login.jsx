// src/pages/Login.jsx

import React, { useState, useContext, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShopContext from "../context/ShopContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      if (currState === "Login") {
        const response = await axios.post(
          `${backendUrl}/api/auth/userlogin`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in Successfully");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } else {
        const response = await axios.post(
          `${backendUrl}/api/auth/register`,
          {
            name,
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registered Successfully");
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      // YOUR ORIGINAL STYLING - UNCHANGED
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      {/* Title */}
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Name Input */}
      {currState === "Sign Up" && (
        <input
          name="name" // Added name
          value={name} // Added value
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="w-full py-3 px-3 border border-gray-800"
          placeholder="Name"
          required
          autoComplete="off"
        />
      )}

      {/* Email */}
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="w-full py-3 px-3 border border-gray-800"
        placeholder="Email"
        required
        autoComplete="off"
      />

      {/* Password with show/hide toggle */}
      <div className="relative w-full">
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          className="w-full py-3 px-3 border border-gray-800 pr-10"
          placeholder="Password"
          required
          autoComplete="off"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {/* YOUR EYE ICON LOGIC - IT WAS ALREADY PERFECT */}
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      {/* Links */}
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currState === "Login" ? (
          <p className="cursor-pointer" onClick={() => setCurrState("Sign Up")}>
            Create Account
          </p>
        ) : (
          <p className="cursor-pointer" onClick={() => setCurrState("Login")}>
            Login Here
          </p>
        )}
      </div>

      {/* Submit button */}

      <div className="flex justify-center mt-4">
        <button
          className="w-50 max-w-sm py-2 px-4 text-white bg-black hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-500 relative cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : currState === "Login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </form>
  );
};

export default Login;
