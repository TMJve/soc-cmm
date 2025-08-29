// src/app/assessment/_components/AssessmentForm.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { assessmentModel } from '~/lib/socmm-schema';
// import { api } from '~/trpc/react';
import { useAppStore, type AssessmentAnswers } from '~/lib/store'; // Import the type here
import { DomainRenderer } from './DomainRenderer';

export function AssessmentForm() {
  const methods = useForm();
  const { setAnswers } = useAppStore(); 
  // const submitMutation = api.assessment.submitAnswers.useMutation();

  // Use the specific 'AssessmentAnswers' type for the data
  const onSubmit = (data: AssessmentAnswers) => {
    console.log('Final Assessment Data:', data);
    setAnswers(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          {assessmentModel.map((domain) => (
            <DomainRenderer key={domain.id} domain={domain} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
          >
            Submit & View Results
          </button>
        </div>
      </form>
    </FormProvider>
  );
}