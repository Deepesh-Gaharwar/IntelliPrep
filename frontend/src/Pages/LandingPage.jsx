import React, { useContext, useState } from "react";
import Modal from "../Components/Modal";
import Login from "./Login";

import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Signup from "./Signup";
import HEROIMG from "../assets/HERO.png";
import { UserContext } from "../Context/UserContext";
import ProfileInfoCard from "../Components/ProfileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleClick = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="relative w-full bg-[#FFFCEF] overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-amber-200/30 blur-[100px] top-0 left-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-10 md:pt-14 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div className="text-2xl text-black font-bold">IntelliPrep</div>

            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-20">
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <div className="flex items-center justify-left mb-2">
                <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full hover:bg-black hover:text-white">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interview with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery - your ultimate interview toolkit is
                here.
              </p>

              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-500 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleClick}
              >
                Get Started
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="w-full min-h-full relative z-10">
        <section className="flex justify-center py-16">
          <img
            src={HEROIMG}
            alt="Hero Image"
            className="w-full max-w-5xl rounded-2xl shadow-xl"
          />
        </section>

        <section className="py-20 bg-[#FFFCEF]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
            <section className="mt-5">
              <h2 className="text-2xl font-medium text-center mb-12">
                Features That Make You Shine
              </h2>

              <div className="flex flex-col items-center gap-8">
                {/* First 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Remaining 2 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFFE8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <footer className="text-sm bg-gray-50 text-center py-6 mt-10">
          Made with ❤️... By Deepesh
        </footer>
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}

          {currentPage === "signup" && (
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;