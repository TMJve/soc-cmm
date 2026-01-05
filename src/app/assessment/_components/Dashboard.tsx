// // src/app/assessment/_components/Dashboard.tsx
// 'use client';

// import { useAppStore } from '~/lib/store';
// import { assessmentModel } from '~/lib/socmm-schema';

// export const Dashboard = () => {
//   // We now get actions from a nested object
//   const { actions } = useAppStore();

//   return (
//     <div className="mx-auto max-w-4xl space-y-8">
//       <div className="rounded-lg bg-white p-8 text-center shadow-lg">
//         <h1 className="text-4xl font-extrabold">Assessment Dashboard</h1>
//         <p className="mt-2 text-lg text-gray-600">Select a domain to begin or continue your assessment.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {assessmentModel.map(domain => (
//           <button
//             key={domain.id}
//             onClick={() => actions.startDomain(domain.id)}
//             className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <h2 className="text-2xl font-bold text-gray-800">{domain.name}</h2>
//             <p className="mt-2 text-sm text-gray-500">Click to assess this domain.</p>
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={() => actions.goToStep('results')}
//           className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
//         >
//           View Final Results
//         </button>
//       </div>
//     </div>
//   );
// };


// src/app/assessment/_components/Dashboard.tsx
// 'use client';

// import { useAppStore } from '~/lib/store';
// import { assessmentModel } from '~/lib/socmm-schema';
// import { calculateDomainProgress } from '~/lib/scoring';

// export const Dashboard = () => {
//   // FIX: Get functions directly from the store
//   const { startDomain, goToStep, answers } = useAppStore();

//   return (
//     <div className="mx-auto max-w-4xl space-y-8">
//       <div className="rounded-lg bg-white p-8 text-center shadow-lg">
//         <h1 className="text-4xl font-extrabold">Assessment Dashboard</h1>
//         <p className="mt-2 text-lg text-gray-600">Select a domain to begin or continue your assessment.</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {assessmentModel.map(domain => {
//           const progress = calculateDomainProgress(domain, answers);
//           return (
//             <button
//               key={domain.id}
//               // FIX: Call the function directly
//               onClick={() => startDomain(domain.id)}
//               className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-800">{domain.name}</h2>
//                 <span className="text-sm font-semibold text-gray-600">{progress}%</span>
//               </div>
//               <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full" 
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//       <div className="flex justify-end">
//         <button
//           // FIX: Call the function directly
//           onClick={() => goToStep('results')}
//           className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
//         >
//           View Final Results
//         </button>
//       </div>
//     </div>
//   );
// };

// src/app/assessment/_components/Dashboard.tsx
// src/app/assessment/_components/Dashboard.tsx
'use client';

import { useRouter } from 'next/navigation'; // Import Router
import { useAppStore } from '~/lib/store';
import { assessmentModel } from '~/lib/socmm-schema';
import { calculateDomainProgress } from '~/lib/scoring';

export const Dashboard = () => {
  const router = useRouter(); // Initialize Router
  const { startDomain, goToStep, answers, profileData } = useAppStore();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      
      {/* --- NEW: BACK BUTTON --- */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/homebase')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Homebase
        </button>
      </div>

      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold">Assessment Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Select a domain to begin or continue your assessment.</p>
      </div>

      {profileData && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="border-b pb-3 text-xl font-bold text-gray-800">Assessment Details</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold">Assessor(s):</p>
              <p>{profileData.names || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Department(s):</p>
              <p>{profileData.departments || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{profileData.assessmentDate || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Purpose:</p>
              <p>{profileData.purpose || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentModel.map(domain => {
          const progress = calculateDomainProgress(domain, answers);
          
          return (
            <button
              key={domain.id}
              onClick={() => startDomain(domain.id)}
              className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{domain.name}</h2>
                <span className="text-sm font-semibold text-gray-600">{progress}%</span>
              </div>
              
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => goToStep('results')}
          className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          View Final Results
        </button>
      </div>
    </div>
  );
};