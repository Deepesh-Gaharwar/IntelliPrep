import React from 'react'

const DeleteAlertContent = ({content, onDelete}) => {

  return (
    <div className="p-5">
      <p className="text-[14px]">{content} </p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="
                    inline-flex items-center justify-center
                    bg-gradient-to-r from-[#FF9324] to-[#e99a4b]
                    text-white text-sm font-semibold
                    px-4 py-2
                    rounded-xl
                    transition-all duration-200
                    hover:opacity-90 hover:shadow-md
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-orange-400
                    cursor-pointer"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteAlertContent;