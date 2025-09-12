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
        <span>How Weighted Scoring Works</span>
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
        style={{ maxHeight: isOpen ? '500px' : '0px' }}
      >
        <div className="px-6 pb-6">
          <p className="text-blue-700">
            The scoring mechanism in this tool works by applying a factor to your answer based on the &quot;Importance&quot; you select for each question.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-1 text-blue-700">
            <li><b>Importance &apos;None&apos;:</b> factor = 0 (question is not included in scoring)</li>
            <li><b>Importance &apos;Low&apos;:</b> factor = 0.5 (score is divided by 2)</li>
            <li><b>Importance &apos;Normal&apos;:</b> factor = 1 (score is not affected)</li>
            <li><b>Importance &apos;High&apos;:</b> factor = 2 (score is doubled)</li>
            <li><b>Importance &apos;Critical&apos;:</b> factor = 4 (score is quadrupled)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};