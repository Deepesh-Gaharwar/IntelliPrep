import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <div className="bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="min-h-[200px] flex flex-col justify-center relative z-10 py-10">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium">{role}</h2>

                  <p className="text-sm text-gray-700 mt-1 max-w-2xl">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="text-[11px] font-semibold text-white bg-black px-4 py-1.5 rounded-full">
              Experience:{" "}
              {experience
                ? `${experience} ${Number(experience) === 1 ? "Year" : "Years"}`
                : "-"}
            </div>

            <div className="text-[11px] font-semibold text-white bg-black px-4 py-1.5 rounded-full">
              {questions} Q&A
            </div>

            <div className="text-[11px] font-semibold text-white bg-black px-4 py-1.5 rounded-full">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-20 top-10 w-32 h-32 bg-lime-400 blur-[100px] animate-blob1" />
          <div className="absolute right-40 top-20 w-32 h-32 bg-teal-400 blur-[100px] animate-blob2" />
          <div className="absolute right-10 bottom-10 w-32 h-32 bg-cyan-400 blur-[80px] animate-blob3" />
          <div className="absolute right-60 bottom-0 w-32 h-32 bg-fuchsia-400 blur-[80px] animate-blob1" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;