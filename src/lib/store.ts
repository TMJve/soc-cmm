// src/lib/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type ProfileFormData } from '~/app/assessment/_components/ProfileForm.schema';

export type AssessmentAnswers = Record<string, unknown>;

// The full state now includes the actions directly at the top level
type AppState = {
  step: 'profile' | 'dashboard' | 'assessment' | 'results';
  activeDomainId: string | null;
  profileData: ProfileFormData | null;
  answers: AssessmentAnswers;

  // Actions are now top-level properties
  setProfileData: (data: ProfileFormData) => void;
  startDomain: (domainId: string) => void;
  returnToDashboard: () => void;
  setAnswers: (data: Partial<AssessmentAnswers>) => void;
  goToStep: (step: AppState['step']) => void;
  reset: () => void;
};

// The initial state for just the data part
const initialState = {
  step: 'profile' as const,
  profileData: null,
  answers: {},
  activeDomainId: null,
};

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      ...initialState,
      // Functions are now defined at the top level, not inside an 'actions' object
      setProfileData: (data) => set({ profileData: data, step: 'dashboard' }),
      startDomain: (domainId) => set({ activeDomainId: domainId, step: 'assessment' }),
      returnToDashboard: () => set({ activeDomainId: null, step: 'dashboard' }),
      setAnswers: (data) => set((state) => ({ answers: { ...state.answers, ...data } })),
      goToStep: (step) => set({ step }),
      reset: () => set(initialState),
    }),
    {
      name: 'soc-cmm-assessment-storage',
      storage: createJSONStorage(() => localStorage),
      // NO partialize function. The middleware will automatically ignore the functions when saving.
    }
  )
);