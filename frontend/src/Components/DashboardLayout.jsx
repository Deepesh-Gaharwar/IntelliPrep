import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../Context/UserContext';
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
    const { user } = useContext(UserContext);

   // console.log("USER FROM CONTEXT:", user);

  return (
    <div>
        <Navbar />

        {user && <div> {children} </div>}

    </div>
  )
}

export default DashboardLayout