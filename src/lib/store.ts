// src/lib/store.ts
import { create } from 'zustand';
import { type ProfileFormData } from '~/app/assessment/_components/ProfileForm.schema';

// ============================================================================
// 1. DEFINE THE TYPES - This is the "shape" of our data
// ============================================================================

/**
 * A flexible type to hold all the answers from the assessment.
 * The key is the question's unique ID (e.g., 'business.drivers.identified'),
 * and the value is the score or text the user entered.
 */
type AssessmentAnswers = Record<string, number | string | boolean | string[]>;

/**
 * This is the master type for our entire store. It defines:
 * - `state`: The data our store holds (step, profileData, answers).
 * - `actions`: The functions that can change the state.
 */
type AppState = {
  // --- STATE ---
  step: 'profile' | 'assessment' | 'results';
  profileData: ProfileFormData | null;
  answers: AssessmentAnswers;

  // --- ACTIONS ---
  setProfileData: (data: ProfileFormData) => void;
  setAnswers: (data: AssessmentAnswers) => void; // ADDED
  goToStep: (step: AppState['step']) => void;
  reset: () => void;
};

// ============================================================================
// 2. CREATE THE STORE - The actual implementation
// ============================================================================

const initialState = {
  step: 'profile' as const,
  profileData: null,
  answers: {},
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  /**
   * Updates the profile data and automatically moves the user to the next step.
   */
  setProfileData: (data) => set({ profileData: data, step: 'assessment' }),
  
  /**
   * Updates the answers and automatically moves the user to the results page.
   */
  setAnswers: (data) => set({ answers: data, step: 'results' }),

  /**
   * A general function to manually change the step, useful for navigation.
   */
  goToStep: (step) => set({ step }),

  /**
   * Resets the entire store back to its initial state.
   */
  reset: () => set(initialState),
}));