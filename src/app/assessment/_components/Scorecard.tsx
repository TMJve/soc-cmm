// src/app/assessment/_components/Scorecard.tsx
'use client';

import { type DomainResult } from '~/lib/scoring';

// A helper to determine the bar color based on the score
const getBarColor = (score: number) => {
  if (score < 2) return 'bg-red-500';
  if (score < 3.5) return 'bg-yellow-500';
  return 'bg-green-500';
};

// UPDATE: Props are now strongly typed with DomainResult
export const Scorecard = ({ domainName, domainResults }: { domainName: string; domainResults: DomainResult }) => {
  return (
    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3 mb-3">
        <h2 className="text-2xl font-bold">{domainName}</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall Score</p>
          <p className="text-2xl font-bold">{domainResults.score.toFixed(2)}</p>
        </div>
      </div>
      <div className="space-y-4">
        {/* TypeScript now knows what 'subdomain' is, so all access is safe */}
        {Object.values(domainResults.subdomains).map((subdomain) => (
          <div key={subdomain.name} className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium col-span-1">{subdomain.name}</span>
            <div className="col-span-2 flex items-center gap-4">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full text-white text-xs flex items-center justify-center ${getBarColor(subdomain.score)}`}
                  style={{ width: `${(subdomain.score / 5) * 100}%` }}
                >
                  {subdomain.score.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};