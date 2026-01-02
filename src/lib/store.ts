// src/lib/store.ts
import { create } from 'zustand';
import { type ProfileFormData } from '~/app/assessment/_components/ProfileForm.schema';

export type AssessmentAnswers = Record<string, unknown>;

type State = {
  // We track the specific ID we are working on
  assessmentId: string | null; 
  step: 'profile' | 'dashboard' | 'assessment' | 'results';
  activeDomainId: string | null;
  profileData: ProfileFormData | null;
  answers: AssessmentAnswers;
};

type Actions = {
  setAssessmentId: (id: string) => void;
  setProfileData: (data: ProfileFormData) => void;
  startDomain: (domainId: string) => void;
  returnToDashboard: () => void;
  setAnswers: (data: Partial<AssessmentAnswers>) => void;
  goToStep: (step: State['step']) => void;
  reset: () => void;
  // New action to load everything at once from DB
  initializeAssessment: (data: { 
    id: string; 
    profileData: ProfileFormData; 
    answers: AssessmentAnswers; 
    step?: State['step'];
  }) => void;
};

const initialState: State = {
  assessmentId: null,
  step: 'dashboard', // Default to dashboard if loading an existing assessment
  profileData: null,
  answers: {},
  activeDomainId: null,
};

export const useAppStore = create<State & Actions>((set) => ({
  ...initialState,

  setAssessmentId: (id) => set({ assessmentId: id }),
  setProfileData: (data) => set({ profileData: data }),
  startDomain: (domainId) => set({ activeDomainId: domainId, step: 'assessment' }),
  returnToDashboard: () => set({ activeDomainId: null, step: 'dashboard' }),
  setAnswers: (data) => set((state) => ({ answers: { ...state.answers, ...data } })),
  goToStep: (step) => set({ step }),
  reset: () => set(initialState),

  // This is the key to fixing the bug. We forcefully overwrite the state with DB data.
  initializeAssessment: ({ id, profileData, answers, step }) => set({
    assessmentId: id,
    profileData,
    answers: answers || {},
    step: step || 'dashboard',
    activeDomainId: null
  }),
}));