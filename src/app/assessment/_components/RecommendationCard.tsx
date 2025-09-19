// src/app/assessment/_components/RecommendationCard.tsx
'use client';

import { api } from '~/trpc/react';
import { type SubdomainResult } from '~/lib/scoring'; // Import the SubdomainResult type

export const RecommendationCard = ({ 
  domainName, 
  score,
  subdomains, // 1. Accept the subdomains as a prop
}: { 
  domainName: string; 
  score: number;
  subdomains: Record<string, SubdomainResult>; // Use the specific type
}) => {
  const getRecommendationsMutation = api.assessment.getRecommendations.useMutation();

  const handleGetRecommendations = () => {
    // 2. Pass the subdomains in the mutation call
    getRecommendationsMutation.mutate({ domainName, score, subdomains });
  };

  return (
    <div className="mt-4 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
      {getRecommendationsMutation.isIdle && (
        <div className="text-center">
          <button 
            onClick={handleGetRecommendations}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get AI Recommendations
          </button>
        </div>
      )}

      {getRecommendationsMutation.isPending && (
        <p className="text-center text-gray-600 animate-pulse">🧠 Thinking...</p>
      )}

      {getRecommendationsMutation.isError && (
        <p className="text-center text-red-600">Error: {getRecommendationsMutation.error.message}</p>
      )}
      
      {getRecommendationsMutation.isSuccess && (
        <div>
          <h4 className="font-bold text-gray-800">AI Recommendations:</h4>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {getRecommendationsMutation.data}
          </p>
        </div>
      )}
    </div>
  );
};