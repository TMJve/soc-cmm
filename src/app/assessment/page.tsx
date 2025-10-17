// src/app/assessment/page.tsx
'use client';

import { useAppStore } from '~/lib/store';
import ProfileForm from './_components/ProfileForm';
import { AssessmentForm } from './_components/AssessmentForm';
import ResultsPage from './_components/ResultsPage';
import { Dashboard } from './_components/Dashboard';

export default function AssessmentPage() {
  const step = useAppStore((state) => state.step);

  // The problematic 'actions' variable and the complex 'if' block have been removed.

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      {step === 'profile' && <ProfileForm />}
      {step === 'dashboard' && <Dashboard />}
      {step === 'assessment' && <AssessmentForm />}
      {step === 'results' && <ResultsPage />}
    </div>
  );
}