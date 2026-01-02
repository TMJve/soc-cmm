// // src/app/assessment/_components/AssessmentForm.tsx
// 'use client';

// import { FormProvider, useForm } from 'react-hook-form';
// import { assessmentModel } from '~/lib/socmm-schema';
// import { useAppStore, type AssessmentAnswers } from '~/lib/store';
// import { DomainRenderer } from './DomainRenderer';
// import { InfoBox } from './InfoBox';

// export function AssessmentForm() {
//   const { activeDomainId, answers, actions } = useAppStore();
  
//   const methods = useForm({
//     defaultValues: answers,
//   });

//   // FIX: Ensure the 'data' type matches what the store expects
//   const onSubmit = (data: AssessmentAnswers) => {
//     actions.setAnswers(data);
//     actions.returnToDashboard();
//   };
  
//   const activeDomain = assessmentModel.find(d => d.id === activeDomainId);

//   if (!activeDomain) {
//     return (
//       <div className="text-center">
//         <p>Error: No active domain selected.</p>
//         <button onClick={actions.returnToDashboard} className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white">
//           Return to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)}>
//         <InfoBox />
        
//         <DomainRenderer domain={activeDomain} />
        
//         <div className="mt-12 flex justify-between">
//           <button
//             type="button"
//             onClick={actions.returnToDashboard}
//             className="rounded-lg bg-gray-500 px-8 py-3 font-semibold text-white hover:bg-gray-600"
//           >
//             Back to Dashboard
//           </button>
//           <button
//             type="submit"
//             className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
//           >
//             Save & Return to Dashboard
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   );
// }
// src/app/assessment/_components/AssessmentForm.tsx
// src/app/assessment/_components/AssessmentForm.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { assessmentModel } from '~/lib/socmm-schema';
import { useAppStore } from '~/lib/store';
import { DomainRenderer } from './DomainRenderer';
import { InfoBox } from './InfoBox';
import supabase from '~/lib/supabase'; // Import Supabase

export function AssessmentForm() {
  const { activeDomainId, answers, assessmentId, setAnswers, returnToDashboard } = useAppStore();
  
  const activeDomain = assessmentModel.find(d => d.id === activeDomainId);
  const methods = useForm({ defaultValues: answers });

  const onSubmit = async (data: Record<string, unknown>) => {
    // 1. Update Local State
    setAnswers(data);
    
    // 2. Save to Database immediately
    if (assessmentId) {
      const { error } = await supabase
        .from('assessments')
        .update({ answers: { ...answers, ...data } }) // Merge new answers with old
        .eq('id', assessmentId);
      
      if (error) console.error("Failed to save progress:", error);
    }

    // 3. Navigate
    returnToDashboard();
  };
  
  if (!activeDomain) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <InfoBox />
        <DomainRenderer domain={activeDomain} />
        <div className="mt-12 flex justify-between">
          <button
            type="button"
            onClick={returnToDashboard}
            className="rounded-lg bg-gray-500 px-8 py-3 font-semibold text-white hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
          >
            Save & Return
          </button>
        </div>
      </form>
    </FormProvider>
  );
}