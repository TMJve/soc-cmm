// src/lib/scoring.ts

import { assessmentModel, QuestionType, type Domain, type Subdomain } from './socmm-schema';

// This is the shape of the user's answers, which can be deeply nested.
type AssessmentAnswers = Record<string, unknown>;

// The precise shapes for our results data
export type SubdomainResult = { name: string; score: number; };
export type DomainResult = { name: string; score: number; subdomains: Record<string, SubdomainResult>; };
export type Results = Record<string, DomainResult>;

/**
 * A completely type-safe helper function to get a nested property from an object.
 */
function getValueFromPath(obj: AssessmentAnswers, path: string): unknown {
  let current: any = obj;
  for (const key of path.split('.')) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

// NEW: These are the correct weights from your spreadsheet.
const IMPORTANCE_WEIGHTS = {
  critical: 4.0,   // Score quadrupled
  high: 2.0,     // Score doubled
  normal: 1.0,     // Score not affected
  low: 0.5,      // Score divided by 2
  none: 0,       // Not included in scoring
};

// NEW: A helper to safely get the weight for a given importance value
function getWeight(answers: AssessmentAnswers, questionId: string): number {
  const importanceKey = `${questionId}_importance`;
  const importanceValue = getValueFromPath(answers, importanceKey) as keyof typeof IMPORTANCE_WEIGHTS;
  // Default to 'normal' weight (1.0) if no importance is selected
  return IMPORTANCE_WEIGHTS[importanceValue] ?? 1.0;
}

/**
 * UPDATED: This function now calculates a weighted average score.
 */
function calculateSubdomainScore(subdomain: Subdomain, answers: AssessmentAnswers): number {
  const scorableQuestions = subdomain.questions.filter(
    (q) => q.type === QuestionType.SELECT && q.hasImportance
  );

  // Fallback for subdomains that might not use the importance system
  if (scorableQuestions.length === 0) {
    const simpleScorable = subdomain.questions.filter((q) => q.type === QuestionType.SELECT);
    if (simpleScorable.length === 0) return 0;
    
    let totalScore = 0;
    let answeredQuestions = 0;
    simpleScorable.forEach(question => {
        const answerValue = getValueFromPath(answers, question.id);
        if (answerValue && typeof answerValue === 'string') {
            const score = parseInt(answerValue, 10);
            if (!isNaN(score)) {
                totalScore += score;
                answeredQuestions++;
            }
        }
    });
    return answeredQuestions > 0 ? parseFloat((totalScore / answeredQuestions).toFixed(2)) : 0;
  }

  let totalWeightedScore = 0;
  let totalMaximumWeightedScore = 0;

  scorableQuestions.forEach((question) => {
    const answerValue = getValueFromPath(answers, question.id);
    const score = (answerValue && typeof answerValue === 'string' && !isNaN(parseInt(answerValue))) ? parseInt(answerValue, 10) : 0;
    
    const weight = getWeight(answers, question.id);

    // Only include answered questions in the calculation if their weight is not 0
    if (score > 0 && weight > 0) {
      totalWeightedScore += score * weight;
      totalMaximumWeightedScore += 5 * weight; // Max possible score for a question is 5
    }
  });

  if (totalMaximumWeightedScore === 0) {
    return 0; // Avoid division by zero
  }

  // Scale the weighted average to a 0-5 score
  const finalScore = 5 * (totalWeightedScore / totalMaximumWeightedScore);

  return parseFloat(finalScore.toFixed(2));
}

function calculateDomainScore(domain: Domain, answers: AssessmentAnswers): number {
  const subdomainScores = domain.subdomains
    .map((subdomain) => calculateSubdomainScore(subdomain, answers))
    .filter((score) => score >= 0);

  if (subdomainScores.length === 0) {
    return 0;
  }

  const totalScore = subdomainScores.reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / subdomainScores.length;

  return parseFloat(averageScore.toFixed(2));
}

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