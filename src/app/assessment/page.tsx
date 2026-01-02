// src/app/assessment/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import supabase from '~/lib/supabase';
import { useAppStore } from '~/lib/store';
import { type ProfileFormData } from './_components/ProfileForm.schema';

import ProfileForm from './_components/ProfileForm';
import { AssessmentForm } from './_components/AssessmentForm';
import ResultsPage from './_components/ResultsPage';
import { Dashboard } from './_components/Dashboard';

// Define explicit interface
interface DbAssessment {
  id: string;
  profile_data: ProfileFormData | null;
  answers: Record<string, unknown> | null;
}

// 1. We move the logic into a non-exported component called "AssessmentContent"
function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get('id');

  const { step, initializeAssessment } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      if (!assessmentId) {
        router.push('/homebase');
        return;
      }

      // No destructuring (Linter safe)
      const response = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (response.error || !response.data) {
        console.error("Error loading assessment:", response.error);
        router.push('/homebase'); 
        return;
      }

      // Explicit cast (Linter safe)
      const assessment = response.data as unknown as DbAssessment;

      initializeAssessment({
        id: assessment.id,
        // Nullish coalescing (Linter safe)
        profileData: assessment.profile_data ?? {} as ProfileFormData,
        answers: assessment.answers ?? {},
        step: Object.keys(assessment.profile_data ?? {}).length === 0 ? 'profile' : 'dashboard'
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

// 2. We export a wrapper that uses Suspense
export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}