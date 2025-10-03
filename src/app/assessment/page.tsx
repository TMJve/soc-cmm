// src/app/assessment/page.tsx
'use client';

import { useAppStore } from '~/lib/store';
import ProfileForm from './_components/ProfileForm';
import { AssessmentForm } from './_components/AssessmentForm';
import ResultsPage from './_components/ResultsPage';
import { Dashboard } from './_components/Dashboard'; // Import Dashboard

export default function AssessmentPage() {
  const step = useAppStore((state) => state.step);
  const actions = useAppStore((state) => state.actions);

  // This re-wires the actions on initial load after rehydration from localStorage
  if (typeof window !== 'undefined' && !useAppStore.getState().actions) {
    useAppStore.setState({ actions: {
        setProfileData: (data) => useAppStore.getState().actions.setProfileData(data),
        startDomain: (domainId) => useAppStore.getState().actions.startDomain(domainId),
        returnToDashboard: () => useAppStore.getState().actions.returnToDashboard(),
        setAnswers: (data) => useAppStore.getState().actions.setAnswers(data),
        goToStep: (step) => useAppStore.getState().actions.goToStep(step),
        reset: () => useAppStore.getState().actions.reset(),
    }});
  }


  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      {step === 'profile' && <ProfileForm />}
      {step === 'dashboard' && <Dashboard />}
      {step === 'assessment' && <AssessmentForm />}
      {step === 'results' && <ResultsPage />}
    </div>
  );
}