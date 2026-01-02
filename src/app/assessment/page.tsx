// src/app/assessment/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import supabase from '~/lib/supabase';
import { useAppStore } from '~/lib/store';
import { type ProfileFormData } from './_components/ProfileForm.schema';

import ProfileForm from './_components/ProfileForm';
import { AssessmentForm } from './_components/AssessmentForm';
import ResultsPage from './_components/ResultsPage';
import { Dashboard } from './_components/Dashboard';

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get('id');

  const { step, initializeAssessment } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      if (!assessmentId) {
        // If no ID provided, go back to homebase
        router.push('/homebase');
        return;
      }

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error || !data) {
        console.error("Error loading assessment:", error);
        router.push('/homebase'); // Security: if not found/owned, kick out
        return;
      }

      // BUG FIX: Forcefully initialize the store with THIS assessment's data
      // This wipes out any "ghost data" from previous sessions
      initializeAssessment({
        id: data.id,
        profileData: data.profile_data as ProfileFormData,
        answers: data.answers as Record<string, unknown>,
        // If profile is empty, force them to profile step. Otherwise dashboard.
        step: Object.keys(data.profile_data || {}).length === 0 ? 'profile' : 'dashboard'
      });
      
      setLoading(false);
    };

    void loadSession();
  }, [assessmentId, router, initializeAssessment]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading assessment data...</div>;
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