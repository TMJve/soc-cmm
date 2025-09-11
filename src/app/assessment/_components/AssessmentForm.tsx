// src/app/assessment/_components/AssessmentForm.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { assessmentModel } from '~/lib/socmm-schema';
import { useAppStore, type AssessmentAnswers } from '~/lib/store';
import { DomainRenderer } from './DomainRenderer';
import { InfoBox } from './InfoBox'; // 1. Import the new InfoBox component

export function AssessmentForm() {
  const methods = useForm();
  const { setAnswers } = useAppStore(); 

  const onSubmit = (data: AssessmentAnswers) => {
    console.log('Final Assessment Data:', data);
    setAnswers(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        
        {/* 2. Add the InfoBox component right at the top of the form */}
        <InfoBox />

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