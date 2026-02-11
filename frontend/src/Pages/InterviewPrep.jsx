import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import moment from "moment";
import {AnimatePresence, motion } from 'framer-motion';
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { Loader } from 'lucide-react';
import { toast } from "react-toastify";
import DashboardLayout from '../Components/DashboardLayout';
import RoleInfoHeader from '../Components/RoleInfoHeader';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import QuestionCard from '../Components/QuestionCard';
import AIResponsePreview from '../Components/AIResponsePreview';
import Drawer from '../Components/Drawer';
import SkeletonLoader from '../Components/SkeletonLoader';


const InterviewPrep = () => {
  const {sessionId} = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explaination, setExplaination] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // fetch session data by session Id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));

      if(response?.data && response?.data?.session) {
        setSessionData(response?.data?.session);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };


  // Generate Concept explaination
  const generateConceptExplaination = async (question) => {
    try {
      setErrorMsg("");
      setExplaination(null);

      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if(response?.data) {
        setExplaination(response?.data);
      }
    } catch (error) {
      setExplaination(null);
      setErrorMsg("Failed to generate explaination, Try again later!");
      toast.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };



  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));

      if(response?.data && response?.data?.question) {
        // render toast
        fetchSessionDetailsById();
      }

    } catch (error) {
      toast.error("Error: ", error);
    }
  };


  // Add more questions to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      // call AI API to generate more questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.experience,
          numberOfQuestions: 10,
        }
      );

      // should be array like [{questions, answer}, ...]
      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if(response?.data) {
        toast.success("Added More Q&A!!!");

        fetchSessionDetailsById();
      }
    } catch (error) {
      
      if(error?.response && error?.response?.data?.message) {
        setErrorMsg("Error: ", error.message);
      } else {
        setErrorMsg("Something went wrong! Please try again later!");
      }
    } finally{
      setIsUpdateLoader(false);
    }
  };


  useEffect(() => {
    if(sessionId) {
      fetchSessionDetailsById();
    }

    return () => {}
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div
        className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
 pt-4 pb-4 px-4 md:px-0"
      >
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-6 mt-6 mb-10 transition-all duration-500 ease-in-out">
          <div
            className={`col-span-12 transition-all duration-500 ${
              openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-12"
            }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout // this is the key prop that animates position changes
                    layoutId={`question-${data?._id || index}`} // helps framer  tracks specific items
                  >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        openLearnMoreDrawer={() =>
                          generateConceptExplaination(data?.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                      {!isLoading &&
                        sessionData?.questions?.length == index + 1 && (
                          <div className="flex items-center justify-center mt-5">
                            <button
                              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer "
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdateLoader ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}{" "}
                              Load More
                            </button>
                          </div>
                        )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLearnMoreDrawer}
            onClose={() => setOpenLearnMoreDrawer(false)}
            title={!isLoading && explaination?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium ">
                <LuCircleAlert className="mt-1" />
                {errorMsg}
              </p>
            )}

            {isLoading && <SkeletonLoader />}

            {!isLoading && explaination && (
              <AIResponsePreview content={explaination?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InterviewPrep