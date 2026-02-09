import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // clear the local storage
    clearUser(); // clear user stored in user context
    navigate("/");
  };

  if (!user) return null;

  const hasProfileImage =
    typeof user.profileImageUrl === "string" &&
    user.profileImageUrl.trim() !== "";

  return (
    <div className="flex items-center">
      {hasProfileImage ? (
        <img
          src={user.profileImageUrl}
          alt="User"
          className="w-11 h-11 rounded-full mr-3 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "";
          }}
        />
      ) : (
        <FaUserCircle className="w-11 h-11 text-gray-400 mr-3" />
      )}

      <div>
        <div className="text-[15px] text-black font-bold leading-3 ">
          {user.name || ""}
        </div>

        <button
          className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline "
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
