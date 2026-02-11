import React, { useEffect, useState } from 'react';
import { LuPlus, LuFolderX } from "react-icons/lu";
import { CARD_BG } from "../utils/data";
import DashboardLayout from '../Components/DashboardLayout';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import SummaryCard from '../Components/SummaryCard';
import moment from "moment";
import Modal from '../Components/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../Components/DeleteAlertContent';
import { Loader } from "lucide-react";


const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);

      setSessions(response.data);

      // console.log("SESSIONS RESPONSE:", response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      setDeleteLoading(true);

      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully!");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      fetchAllSessions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while deleting session",
      );
    } finally {
      setDeleteLoading(false);
    }
  };


  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div
        className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
 pt-4 pb-4"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
            {sessions?.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("DD MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-10 shadow-sm max-w-md w-full">
              <div className="flex flex-col items-center mb-4">
                <LuFolderX className="text-orange-400 text-4xl mb-3" />

                <h2 className="text-xl font-semibold text-gray-800">
                  No Sessions Yet
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                You haven't created any interview sessions yet. Start preparing
                by creating your first one.
              </p>

              <button
                onClick={() => setOpenCreateModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 
                hover:shadow-xl hover:scale-[1.02] 
                active:scale-95 cursor-pointer"
              >
                <LuPlus className="w-4 h-4" />
                <span>Create Your First Session</span>
              </button>
            </div>
          </div>
        )}

        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[90vw] md:w-[400px]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert?.data)}
            loading={deleteLoading}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Dashboard