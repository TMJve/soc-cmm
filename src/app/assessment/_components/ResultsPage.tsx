// src/app/assessment/_components/ResultsPage.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAppStore } from '~/lib/store';
import { calculateAllScores } from '~/lib/scoring';
import { Scorecard } from './Scorecard';
import { AssessmentPDF } from './AssessmentPDF';
import MaturityRadar from '../_components/MaturityRadar';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Heroicon for the back arrow (optional but looks nice)
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function ResultsPage() {
  const router = useRouter(); // Initialize router
  const { answers, profileData, reset } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const results = calculateAllScores(answers);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    const blob = await pdf(
      <AssessmentPDF results={results} profileData={profileData} />
    ).toBlob();
    const fileName = `SOC-Assessment-Results-${profileData?.names?.replace(/ /g, '_') ?? 'Report'}.pdf`;
    saveAs(blob, fileName);
    setIsGenerating(false);
  };

  const overallScore = (
    (results.business?.score || 0) + 
    (results.people?.score || 0) + 
    (results.process?.score || 0) + 
    (results.technology?.score || 0)
  ) / 4;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        
        {/* Left Side: Title & Back Button */}
        <div className="flex items-start gap-4">
          <button 
            onClick={() => router.push('/homebase')} // Navigates to your main dashboard
            className="mt-1 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title="Back to Homebase"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Assessment Results</h1>
            <p className="mt-1 text-sm text-gray-500">
              <strong>{profileData?.names ?? 'Organization'}</strong> • {profileData?.assessmentDate ?? new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Download Report'}
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* --- TOP ROW: VISUALIZATION --- */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-8">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Maturity Profile</h3>
          <div className="h-[500px] w-full">
            <MaturityRadar results={results} />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm xl:col-span-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Overall Maturity</h3>
          <div className="my-10">
            <span className="text-8xl font-black text-blue-600">{overallScore.toFixed(2)}</span>
            <span className="block text-2xl font-medium text-gray-400 mt-2">/ 5.0</span>
          </div>
          <div className="w-full px-4">
            <div className="mb-2 flex justify-between text-xs font-medium text-gray-400">
              <span>Initial</span>
              <span>Optimized</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${(overallScore / 5) * 100}%` }}
              />
            </div>
            <p className="mt-6 text-sm text-gray-500">
              {overallScore < 2 ? "Focus on establishing foundational processes." : 
               overallScore < 4 ? "Focus on metrics and optimization." : 
               "Continuous improvement phase."}
            </p>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: DOMAIN BREAKDOWN --- */}
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Domain Breakdown</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Object.entries(results).map(([domainId, domainResults]) => (
          <div key={domainId} className="flex h-full flex-col">
            <Scorecard
              domainName={domainResults.name}
              domainResults={domainResults}
            />
          </div>
        ))}
      </div>
    </div>
  );
}