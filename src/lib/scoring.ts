// src/lib/scoring.ts

import { assessmentModel, QuestionType, type Domain, type Subdomain } from './socmm-schema';

type AssessmentAnswers = Record<string, unknown>;

// The precise shapes for our results data
export type SubdomainResult = { name: string; score: number; };
export type DomainResult = { name: string; score: number; subdomains: Record<string, SubdomainResult>; };
export type Results = Record<string, DomainResult>;

/**
 * Helper to safely get nested values (e.g. "business.drivers.identified")
 */
function getValueFromPath(obj: AssessmentAnswers, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

// ----------------------------------------------------------------------------
// 1. SCORING CONSTANTS
// ----------------------------------------------------------------------------

const IMPORTANCE_WEIGHTS = {
  critical: 4.0,
  high: 2.0,
  normal: 1.0,
  low: 0.5,
  none: 0,
};

// Map the "1-5" string values to the specific SOC-CMM percentages
function getDecimalScore(value: string): number {
  switch (value) {
    case '1': return 0.0;  // No / Never
    case '2': return 0.25; // Partially / Sometimes
    case '3': return 0.50; // Averagely
    case '4': return 0.75; // Mostly (Crucial fix: Excel uses 0.75, not 0.8)
    case '5': return 1.0;  // Fully / Always
    default: return 0;
  }
}

// ----------------------------------------------------------------------------
// 2. CALCULATION LOGIC
// ----------------------------------------------------------------------------

function getWeight(answers: AssessmentAnswers, questionId: string): number {
  // Try to find the importance key. 
  // If your form nests it (e.g. business.drivers.identified_importance), this path works.
  const importanceKey = `${questionId}_importance`;
  const importanceValue = getValueFromPath(answers, importanceKey) as keyof typeof IMPORTANCE_WEIGHTS;
  
  // Default to 'normal' (1.0) if not found
  return IMPORTANCE_WEIGHTS[importanceValue] ?? 1.0;
}

function calculateSubdomainScore(subdomain: Subdomain, answers: AssessmentAnswers): number {
  // Filter for questions that affect the score
  const scorableQuestions = subdomain.questions.filter(
    (q) => q.type === QuestionType.SELECT && q.hasImportance
  );

  // If no questions have importance (fallback logic for simple sections)
  if (scorableQuestions.length === 0) {
    return 0; // Or implement simple average if needed, but for SOC-CMM usually 0 is safe default
  }

  let totalWeightedScore = 0;
  let totalMaxPotentialScore = 0;

  scorableQuestions.forEach((question) => {
    // 1. Get User Answer
    const answerValue = getValueFromPath(answers, question.id);
    
    // 2. Get Importance Weight (0, 0.5, 1, 2, 4)
    const weight = getWeight(answers, question.id);

    // If weight is 0 (None), we skip it entirely (it doesn't affect the denominator)
    if (weight === 0) return;

    // 3. Convert Answer to Decimal (0.0 - 1.0)
    if (answerValue && typeof answerValue === 'string') {
      const decimalScore = getDecimalScore(answerValue);
      
      // Earned points = Decimal * Weight
      totalWeightedScore += (decimalScore * weight);
    }

    // 4. Add to Denominator (Max points possible for this question)
    // Max decimal is 1.0, so we just add the Weight
    totalMaxPotentialScore += (1.0 * weight);
  });

  // Prevent division by zero
  if (totalMaxPotentialScore === 0) {
    return 0;
  }

  // 5. Final Calculation
  // (Earned / Max) gives us a 0.0 - 1.0 percentage.
  // Multiply by 5 to map it to the 0-5 Maturity Scale.
  const finalMaturityScore = 5 * (totalWeightedScore / totalMaxPotentialScore);

  return parseFloat(finalMaturityScore.toFixed(2));
}

function calculateDomainScore(domain: Domain, answers: AssessmentAnswers): number {
  // A domain score is the average of its subdomain scores
  const subdomainScores = domain.subdomains
    .map((subdomain) => calculateSubdomainScore(subdomain, answers));

  if (subdomainScores.length === 0) return 0;

  const totalScore = subdomainScores.reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / subdomainScores.length;

  return parseFloat(averageScore.toFixed(2));
}

// ----------------------------------------------------------------------------
// 3. EXPORTS
// ----------------------------------------------------------------------------

export function calculateAllScores(answers: AssessmentAnswers): Results {
  const results: Results = {};
  
  assessmentModel.forEach((domain) => {
    const domainResult: DomainResult = {
      name: domain.name,
      score: calculateDomainScore(domain, answers),
      subdomains: {},
    };
    
    domain.subdomains.forEach((subdomain) => {
      domainResult.subdomains[subdomain.id] = {
        name: subdomain.name,
        score: calculateSubdomainScore(subdomain, answers),
      };
    });
    
    results[domain.id] = domainResult;
  });
  
  return results;
}

export function calculateDomainProgress(domain: Domain, answers: AssessmentAnswers): number {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  domain.subdomains.forEach((subdomain) => {
    subdomain.questions.forEach((question) => {
      // Only count questions that require input
      if (question.type === QuestionType.SELECT || question.type === QuestionType.TEXT || question.type === QuestionType.NUMBER) {
        totalQuestions++;
        const answer = getValueFromPath(answers, question.id);
        
        // Consider "0" string as an answer, but empty string/null/undefined as unanswered
        if (answer !== undefined && answer !== null && answer !== '') {
          answeredQuestions++;
        }
      }
    });
  });

  if (totalQuestions === 0) return 0;

  const progress = (answeredQuestions / totalQuestions) * 100;
  return Math.round(progress);
}