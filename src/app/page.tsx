// src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to the SOC-CMM Tool</h1>
      <p className="text-gray-600 max-w-md mb-6">
        The SOC-CMM model is a capability maturity model that can be used to perform a self-assessment of your Security Operations Center (SOC). The model is based on review conducted on literature regarding SOC setup and existing SOC models as well as literature on specific elements within a SOC. The literature analysis was then validated by questioning several Security Operations Centers in different sectors and on different maturity levels to determine which elements were actually in place. The output from the survey, combined with the initial analysis is the basis for this self-assessment.
      </p>
      <button
        // FIX: Change route from '/assessment' to '/homebase'
        // This triggers the Auth check in Homebase, which will redirect to /login if needed.
        onClick={() => router.push('/homebase')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Start Assessment
      </button>
    </main>
  );
}