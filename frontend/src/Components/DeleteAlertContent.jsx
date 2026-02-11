import React from 'react';
import { Loader2 } from "lucide-react";

const DeleteAlertContent = ({ content, onDelete, loading }) => {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="
            inline-flex items-center justify-center gap-2
            bg-gradient-to-r from-red-500 to-red-600
            text-white text-sm font-semibold
            px-5 py-2 cursor-pointer
            rounded-xl
            transition-all duration-200
            hover:shadow-lg hover:scale-[1.02]
            active:scale-95
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;