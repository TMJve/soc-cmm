// src/lib/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type ProfileFormData } from '~/app/assessment/_components/ProfileForm.schema';

// FIX: Change 'any' to 'unknown' for full type safety
export type AssessmentAnswers = Record<string, unknown>;

type State = {
  step: 'profile' | 'dashboard' | 'assessment' | 'results';
  activeDomainId: string | null;
  profileData: ProfileFormData | null;
  answers: AssessmentAnswers;
};

type Actions = {
  setProfileData: (data: ProfileFormData) => void;
  startDomain: (domainId: string) => void;
  returnToDashboard: () => void;
  setAnswers: (data: Partial<AssessmentAnswers>) => void;
  goToStep: (step: State['step']) => void;
  reset: () => void;
};

const initialState: State = {
  step: 'profile',
  profileData: null,
  answers: {},
  activeDomainId: null,
};

export const useAppStore = create(
  persist<State & { actions: Actions }>(
    (set) => ({
      ...initialState,
      actions: {
        setProfileData: (data) => set({ profileData: data, step: 'dashboard' }),
        startDomain: (domainId) => set({ activeDomainId: domainId, step: 'assessment' }),
        returnToDashboard: () => set({ activeDomainId: null, step: 'dashboard' }),
        setAnswers: (data) => set((state) => ({ answers: { ...state.answers, ...data } })),
        goToStep: (step) => set({ step }),
        reset: () => set(initialState),
      }
    }),
    {
      name: 'soc-cmm-assessment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);