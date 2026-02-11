import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 z-40 h-screen 
w-full md:w-5/12 lg:w-1/2 
bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-right-label"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h5
            id="drawer-right-label"
            className="flex items-center text-base font-semibold text-black"
          >
            {title}
          </h5>

          {/* Close Button  */}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
          >
            <LuX className="text-lg cursor-pointer" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-64px)] text-sm">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;