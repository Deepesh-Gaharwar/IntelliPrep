import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Input from "../Components/Input"
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../Context/UserContext';
import {toast} from "react-toastify";
import { Loader2 } from "lucide-react";

const Login = ({setCurrentPage}) => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);


    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    // handle Login Form Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(emailId)) {
            setError("Please enter a valid emailId address.");
            return;
        }

        if(!password) {
            setError("Please enter the Password");
            return;
        }

        setError("");
         setLoading(true);

        // Login API call
        try {
          const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            emailId,
            password,
          });

          const { token } = response.data;

          if (!token) {
            setError("Invalid login response. Please try again.");
            return;
          }

          localStorage.setItem("token", token);
          updateUser(response.data); // update the user context

          toast.success("Logged In successfully...");
          navigate("/dashboard");
        } catch (error) {
          if (error.response && error.response.data.message) {
            setError(error.response.data.message);

            toast.error(error.response.data.message);
          } else {
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");
          }
        } finally {
          setLoading(false);
        }
    };


  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black ">Welcome Back</h3>

      <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={emailId}
          onChange={({ target }) => setEmailId(target.value)}
          label="EmailId Address"
          placeholder="john@gmail.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="password"
          placeholder="Min 8 Characters"
          type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary cursor-pointer flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3 ">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login