// src/app/assessment/_components/ResultsPage.tsx
'use client';

import { useAppStore } from '~/lib/store';
import { calculateAllScores } from '~/lib/scoring';
import { Scorecard } from './Scorecard';

export default function ResultsPage() {
  const { answers, profileData, reset } = useAppStore();

  const results = calculateAllScores(answers);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold">Assessment Results</h1>
        {/* FIX: Use nullish coalescing operator (??) for safer defaults */}
        <p className="mt-2 text-lg text-gray-600">
          For: <strong>{profileData?.names ?? 'N/A'}</strong> on <strong>{profileData?.assessmentDate ?? 'N/A'}</strong>
        </p>
      </div>

      <div>
        {/* This is now type-safe, no 'any' needed */}
        {Object.entries(results).map(([domainId, domainResults]) => (
          <Scorecard 
            key={domainId} 
            domainName={domainResults.name} 
            domainResults={domainResults} 
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}