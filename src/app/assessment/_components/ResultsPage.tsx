// src/app/assessment/_components/ResultsPage.tsx
'use client';

import React, { useState } from 'react';
import { useAppStore } from '~/lib/store';
import { calculateAllScores } from '~/lib/scoring';
import { Scorecard } from './Scorecard';
import { AssessmentPDF } from './AssessmentPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function ResultsPage() {
  // THE FIX (Part 1): Get the 'actions' object from the store
  const { answers, profileData, actions } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const results = calculateAllScores(answers);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    console.log('Generating PDF...');

    const blob = await pdf(
      <AssessmentPDF results={results} profileData={profileData} />
    ).toBlob();

    const fileName = `SOC-Assessment-Results-${profileData?.names?.replace(/ /g, '_') ?? 'Report'}.pdf`;
    saveAs(blob, fileName);

    console.log('PDF generated and saved.');
    setIsGenerating(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold">Assessment Results</h1>
        <p className="mt-2 text-lg text-gray-600">
          For: <strong>{profileData?.names ?? 'N/A'}</strong> on <strong>{profileData?.assessmentDate ?? 'N/A'}</strong>
        </p>
      </div>

      <div>
        {Object.entries(results).map(([domainId, domainResults]) => (
          <Scorecard 
            key={domainId} 
            domainName={domainResults.name} 
            domainResults={domainResults} 
          />
        ))}
      </div>
      
      <div className="flex justify-end gap-4">
        <button
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="rounded-lg bg-gray-700 px-8 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Export to PDF'}
        </button>
        <button
          // THE FIX (Part 2): Call the function through the 'actions' object
          onClick={actions.reset}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}