// src/app/assessment/page.tsx
'use client';

import { useAppStore } from '~/lib/store';
import ProfileForm from './_components/ProfileForm'; // We will build this in the next step
import { AssessmentForm } from './_components/AssessmentForm'; // We are about to revamp this
import ResultsPage from './_components/ResultsPage'; // We will build this later

export default function AssessmentPage() {
  const step = useAppStore((state) => state.step);

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      {/* This component now acts as a controller, showing the correct
          view based on the 'step' in our global store. */}
      {step === 'profile' && <ProfileForm />}
      {step === 'assessment' && <AssessmentForm />}
      {step === 'results' && <ResultsPage />}
    </div>
  );
}