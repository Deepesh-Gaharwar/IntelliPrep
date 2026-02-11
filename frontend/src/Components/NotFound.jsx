import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import { UserContext } from "../Context/UserContext";
import ProfileInfoCard from "../Components/ProfileInfoCard";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFCEF] relative">
      {/* Ambient blur */}
      <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

      <div
        className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
 px-6 md:px-10 lg:px-16 pt-10 relative z-10"
      >
        {/* Header (same as landing) */}
        <header className="flex justify-between items-center mb-20">
          <div
            className="text-2xl text-black font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            IntelliPrep
          </div>

          {user && <ProfileInfoCard />}
        </header>

        {/* 404 Content */}
        <div className="flex flex-col items-center text-center mt-20">
          {/* Badge */}
          <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full mb-4">
            <LuSparkles /> AI Powered
          </div>

          {/* Heading */}
          <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
            404 —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 font-semibold">
              Page Not Found
            </span>
          </h1>

          {/* Description */}
          <p className="text-[17px] text-gray-900 max-w-xl mb-8">
            Looks like this page went off to prepare for an interview and never
            came back. Let’s get you back to something useful.
          </p>

          {/* CTA */}
          <button
            onClick={handleClick}
            className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-500 hover:border-yellow-300 transition-colors cursor-pointer"
          >
            {user ? "Go to Dashboard" : "Back to Home"}
          </button>
        </div>
      </div>

      {/* Footer (same tone as landing) */}
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 absolute bottom-0 w-full">
        Made with ❤️... By Deepesh
      </div>
    </div>
  );
};

export default NotFound;