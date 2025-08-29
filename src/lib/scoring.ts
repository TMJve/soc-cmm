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
 * This version is designed to pass strict TypeScript ESLint rules.
 * @param obj The object to search within.
 * @param path The dot-notation path to the property.
 * @returns The value if found, otherwise undefined.
 */
function getValueFromPath(obj: AssessmentAnswers, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    // Type guard to ensure we can index the current value
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined; // Path does not exist
    }
  }
  return current;
}


function calculateSubdomainScore(subdomain: Subdomain, answers: AssessmentAnswers): number {
  const scorableQuestions = subdomain.questions.filter((q) => q.type === QuestionType.SELECT);
  if (scorableQuestions.length === 0) return 0;

  const minPossibleScore = scorableQuestions.length * 1;
  const maxPossibleScore = scorableQuestions.length * 5;

  let actualScore = 0;
  scorableQuestions.forEach((question) => {
    const answerValue = getValueFromPath(answers, question.id);
    
    // This check handles the 'unknown' return type from our safe helper function
    if (typeof answerValue === 'string') {
      const parsedValue = parseInt(answerValue, 10);
      if (!isNaN(parsedValue)) {
        actualScore += parsedValue;
      }
    }
  });

  if (actualScore === 0) return 0;

  const normalizedScore = (actualScore - minPossibleScore) / (maxPossibleScore - minPossibleScore);
  let finalScore = 5 * normalizedScore;
  finalScore = Math.max(0, finalScore);

  return parseFloat(finalScore.toFixed(2));
}

function calculateDomainScore(domain: Domain, answers: AssessmentAnswers): number {
  const subdomainScores = domain.subdomains
    .map((subdomain) => calculateSubdomainScore(subdomain, answers))
    .filter((score) => score >= 0);

  if (subdomainScores.length === 0) return 0;

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