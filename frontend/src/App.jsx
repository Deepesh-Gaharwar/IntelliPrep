import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";
import InterviewPrep from "./Pages/InterviewPrep";
import UserProvider from "./Context/UserContext";
import NotFound from './Components/NotFound';

const App = () => {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/*  ToastContainer  */}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </UserProvider>
    </>
  );
}

export default App