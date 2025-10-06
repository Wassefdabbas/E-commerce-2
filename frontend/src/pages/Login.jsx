// src/pages/Login.jsx

import React, { useState, useContext } from "react"; // 1. Import useContext
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 2. Import hooks for navigation
import { toast } from "react-toastify"; // and notifications
import ShopContext from "../context/ShopContext"; // and your context

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  // 3. Add state to hold the data from the input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 4. Get login function from context and initialize navigate
  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  // 5. This function updates the state as the user types
  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === "Sign Up") {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all fields.");
        return;
      }
      login({ name: formData.name, email: formData.email });
      navigate("/");
    } else {
      // Login state
      if (!formData.email || !formData.password) {
        toast.error("Please enter email and password.");
        return;
      }
      login({ email: formData.email });
      navigate("/");
    }
  };

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
          value={formData.name} // Added value
          onChange={onChangeHandler} // Added onChange
          type="text"
          className="w-full py-3 px-3 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      {/* Email */}
      <input
        name="email" // Added name
        value={formData.email} // Added value
        onChange={onChangeHandler} // Added onChange
        type="email"
        className="w-full py-3 px-3 border border-gray-800"
        placeholder="Email"
        required
      />

      {/* Password with show/hide toggle */}
      <div className="relative w-full">
        <input
          name="password" // Added name
          value={formData.password} // Added value
          onChange={onChangeHandler} // Added onChange
          type={showPassword ? "text" : "password"}
          className="w-full py-3 px-3 border border-gray-800 pr-10"
          placeholder="Password"
          required
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
      <button className="bg-black text-white font-normal px-8 py-2 mt-4 cursor-pointer">
        {currState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
