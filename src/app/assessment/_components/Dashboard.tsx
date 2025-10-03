// src/app/assessment/_components/Dashboard.tsx
'use client';

import { useAppStore } from '~/lib/store';
import { assessmentModel } from '~/lib/socmm-schema';

export const Dashboard = () => {
  // We now get actions from a nested object
  const { actions } = useAppStore();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold">Assessment Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Select a domain to begin or continue your assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentModel.map(domain => (
          <button
            key={domain.id}
            onClick={() => actions.startDomain(domain.id)}
            className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="text-2xl font-bold text-gray-800">{domain.name}</h2>
            <p className="mt-2 text-sm text-gray-500">Click to assess this domain.</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => actions.goToStep('results')}
          className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          View Final Results
        </button>
      </div>
    </div>
  );
};