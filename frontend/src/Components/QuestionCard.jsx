import React, { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from 'react-icons/lu';
import AIResponsePreview from './AIResponsePreview';

const QuestionCard = ({
    question,
    answer,
    openLearnMoreDrawer,
    isPinned,
    onTogglePin,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [height, setHeight] = useState(0);

    const contentRef = useRef(null);

    useEffect(() => {
        if(isExpanded) {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(contentHeight + 10);

        } else{
            setHeight(0);
        }
    }, [isExpanded]);


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

  return (
    <>
      <div
        className="bg-white rounded-xl mb-4 px-6 py-5
                 border border-gray-200/70
                 hover:shadow-md transition-all duration-200 group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          {/* Left Section */}
          <div
            className="flex items-start gap-3 flex-1 cursor-pointer"
            onClick={toggleExpand}
          >
            <span className="text-sm font-semibold text-gray-400 mt-[2px]">
              Q
            </span>

            <h3 className="text-sm md:text-base font-medium text-gray-800 leading-relaxed">
              {question}
            </h3>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            <div
              className={`hidden md:flex items-center gap-2 transition-all duration-200 ${
                isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={onTogglePin}
                className="flex items-center gap-1.5
                         text-xs font-medium
                         text-indigo-700
                         bg-indigo-50
                         px-3 py-1.5
                         rounded-md
                         hover:bg-indigo-100
                         transition cursor-pointer"
              >
                {isPinned ? <LuPinOff size={14} /> : <LuPin size={14} />}
              </button>

              <button
                onClick={() => {
                  setIsExpanded(true);
                  openLearnMoreDrawer();
                }}
                className="flex items-center gap-1.5
                         text-xs font-medium
                         text-cyan-700
                         bg-cyan-50
                         px-3 py-1.5
                         rounded-md
                         hover:bg-cyan-100
                         transition"
              >
                <LuSparkles size={14} className='cursor-pointer' />
                <span className="hidden md:block cursor-pointer">Learn More</span>
              </button>
            </div>

            {/* Chevron */}
            <button
              className="text-gray-400 hover:text-gray-600 transition"
              onClick={toggleExpand}
            >
              <LuChevronDown
                size={18}
                className={`transition-transform duration-300 cursor-pointer ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="mt-4 text-sm text-gray-700
                     bg-gray-50
                     px-5 py-4
                     rounded-lg"
          >
            <AIResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionCard