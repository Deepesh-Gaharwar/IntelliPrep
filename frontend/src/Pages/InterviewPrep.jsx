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

  const [pageLoading, setPageLoading] = useState(true);


  // fetch session data by session Id
  const fetchSessionDetailsById = async () => {
    try {
      setPageLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId),
      );

      if (response?.data && response?.data?.session) {
        setSessionData(response?.data?.session);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch session");
    } finally {
      setPageLoading(false);
    }
  };


  // Generate Concept explaination
  const generateConceptExplaination = async (question) => {
    try {
      setErrorMsg("");
      setExplaination(null);

      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        },
      );

      if (response?.data) {
        setExplaination(response?.data);
      }
    } catch (error) {
      setExplaination(null);
      const message =
        error?.response?.data?.message ||
        "Failed to generate explanation. Try again later.";

      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };



  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));

      if(response?.data && response?.data?.question) {
        toast.success("Updated successfully");
        fetchSessionDetailsById();
      }

    } catch (error) {
      toast.error("Error while Pin Question");
    }
  };


  // Add more questions to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      // call AI API to generate more questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.experience,
          numberOfQuestions: 10,
        },
      );

      // should be array like [{questions, answer}, ...]
      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        },
      );

      if (response?.data) {
        toast.success("Added 10 More Q&A!!!");

        fetchSessionDetailsById();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong! Please try again later!";

      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsUpdateLoader(false);
    }
  };


  useEffect(() => {
    if(sessionId) {
      fetchSessionDetailsById();
    }

    return () => {}
  }, []);


 if (pageLoading) {
   return (
     <DashboardLayout>
       <div className="flex justify-center items-center h-[60vh]">
         <Loader className="w-8 h-8 animate-spin text-black" />
       </div>
     </DashboardLayout>
   );
 }
 

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
                              className="flex items-center gap-3 text-sm text-white font-medium 
                            bg-black px-6 py-2.5    rounded-full 
                              hover:scale-105 hover:shadow-lg 
                              transition-all duration-300 text-nowrap cursor-pointer "
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdateLoader ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}
                              {isUpdateLoader ? "Generating..." : "Load More"}
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