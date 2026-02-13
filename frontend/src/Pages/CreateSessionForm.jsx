import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../Components/Input';
import { Loader } from "lucide-react";
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { toast } from "react-toastify";


const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        const {role, experience, topicsToFocus } = formData;

        if (!role.trim() || topicsToFocus.trim() === "") {
          setError("Please fill all the required fields!");
          return;
        }

        if (experience === "" || experience < 0) {
          setError("Please enter valid years of experience!");
          return;
        }

        setError("");

        setIsLoading(true);

        try {
         // const loadingToast = toast.loading("Generating your session...");

          // Call AI API to generate questions
          const aiResponse = await axiosInstance.post(
            API_PATHS.AI.GENERATE_QUESTIONS,
            {
              role,
              experience,
              topicsToFocus,
              numberOfQuestions: 10,
            },
          );

          // Should be array like [{question, answer}, ...]
          const generatedQuestions = aiResponse.data;

          const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
            ...formData,
            questions: generatedQuestions,
          });

          // toast.dismiss(loadingToast);

          if (response?.data?.session?._id) {
            toast.success("Your session is successfully created!");

            navigate(`/interview-prep/${response.data?.session?._id}`);
          }
        } catch (error) {

            if (error?.response && error?.response?.data?.message) {
              setError(error?.response?.data?.message);

            } else {
              setError("Something went wrong. Please try again later!");
            }

        } finally{
            setIsLoading(false);
        }
        
    } 



  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black ">
        Start a New Interview Journey
      </h3>

      <p className="text-xs text-slate-700 mt-[5px] mb-3 ">
        Fill out a few quick details and unlock your personalised set of
        interview questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) =>
            handleChange("experience", Math.max(0, Number(target.value)))
          }
          label="Years of Experience"
          placeholder="(e.g., 1 Year, 3 years, 5+ years)"
          type="number"
          min={0}
        />

        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to Focus"
          placeholder="(Comma-seperated, e.g., React, Node.js, MongoDB)"
          type="text"
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="(Any specific goals or notes for this session)"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5"> {error} </p>}

        <button
          type="submit"
          className="btn-primary w-full mt-2 flex items-center justify-center gap-2 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Session"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateSessionForm