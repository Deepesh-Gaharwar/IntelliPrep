import React from 'react';
import ProfileInfoCard from "../Components/ProfileInfoCard";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
      <div
        className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
 flex items-center justify-between gap-5"
      >
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-medium text-black leading-5">
            IntelliPrep
          </h2>
        </Link>

        <ProfileInfoCard />
      </div>
    </div>
  );
}

export default Navbar