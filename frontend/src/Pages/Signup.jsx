import React, {useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import Input from "../Components/Input";
import ProfilePhotoSelector from '../Components/ProfilePhotoSelector';
import { validateEmail } from '../utils/helper';
import { UserContext } from '../Context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const Signup = ({setCurrentPage}) => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!fullName) {
      setError("Please enter Full Name");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if(!password) {
      setError("Please enter the Password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }


    setError("");
    setLoading(true);

    // Sign Up API call
    try {
      // upload image if present
      const formData = new FormData();

      formData.append("name", fullName);
      formData.append("emailId", email);
      formData.append("password", password);

      if (profilePic) {
        formData.append("profileImage", profilePic); // must match with multer
      }

      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { token } = res.data;

      if (token) {
        localStorage.setItem("token", token);

        updateUser(res.data);

        toast.success("Account created successfully!");

        navigate("/dashboard");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error?.response && error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black ">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="password"
            placeholder="Min 8 Characters"
            type="Password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary cursor-pointer flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup