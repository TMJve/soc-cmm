// src/app/assessment/_components/InfoBox.tsx
'use client';

import { useState } from 'react';

export const InfoBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-lg font-bold text-blue-800 focus:outline-none"
      >
        <span>Assessment Information & Scoring</span> {/* Updated Title */}
        <svg
          className={`h-6 w-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
          isOpen ? 'h-auto' : 'h-0'
        }`}
        style={{ maxHeight: isOpen ? '1000px' : '0px' }} // Increased max height
      >
        <div className="px-6 pb-6 space-y-6"> {/* Added space-y */}
          
          {/* Section 1: Weighted Scoring (Existing) */}
          <div>
            <h3 className="mb-2 text-md font-bold text-blue-800">
              How Weighted Scoring Works
            </h3>
            <p className="text-sm text-blue-700">
              The scoring mechanism in this tool works by applying a factor to your answer based on the &quot;Importance&quot; you select for each question.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
              <li><b>Importance &apos;None&apos;:</b> factor = 0 (question is not included in scoring)</li>
              <li><b>Importance &apos;Low&apos;:</b> factor = 0.5 (score is divided by 2)</li>
              <li><b>Importance &apos;Normal&apos;:</b> factor = 1 (score is not affected)</li>
              <li><b>Importance &apos;High&apos;:</b> factor = 2 (score is doubled)</li>
              <li><b>Importance &apos;Critical&apos;:</b> factor = 4 (score is quadrupled)</li>
            </ul>
          </div>

          {/* NEW Section 2: Maturity Levels */}
          <div>
            <h3 className="mb-2 text-md font-bold text-blue-800">
              About SOC-CMM Maturity Levels
            </h3>
            <p className="text-sm text-blue-700">
              CMMI defines maturity as a means for an organization &quot;to characterize its performance&quot; for a specific entity (here: the SOC). The SOC-CMM calculates a maturity score using 6 continuous maturity levels, measured across 5 domains.
            </p>
            
            {/* REMOVED THE IMG TAG TO FIX BUILD WARNING */}
            
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
              <li><b>Level 0:</b> Non-existent</li>
              <li><b>Level 1:</b> Initial</li>
              <li><b>Level 2:</b> Managed</li>
              <li><b>Level 3:</b> Defined</li>
              <li><b>Level 4:</b> Quantitatively Managed</li>
              <li><b>Level 5:</b> Optimizing</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};