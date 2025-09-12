// src/lib/scoring.ts

import { assessmentModel, QuestionType, type Domain, type Subdomain } from './socmm-schema';

type AssessmentAnswers = Record<string, unknown>;

// The precise shapes for our results data
export type SubdomainResult = { name: string; score: number; };
export type DomainResult = { name: string; score: number; subdomains: Record<string, SubdomainResult>; };
export type Results = Record<string, DomainResult>;

/**
 * A final, foolproof, and 100% type-safe helper function.
 * This version uses explicit type guards to satisfy the strict linter.
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


// These are the correct weights from your spreadsheet.
const IMPORTANCE_WEIGHTS = {
  critical: 4.0,
  high: 2.0,
  normal: 1.0,
  low: 0.5,
  none: 0,
};

// A helper to safely get the weight for a given importance value
function getWeight(answers: AssessmentAnswers, questionId: string): number {
  const importanceKey = `${questionId}_importance`;
  const importanceValue = getValueFromPath(answers, importanceKey) as keyof typeof IMPORTANCE_WEIGHTS;
  return IMPORTANCE_WEIGHTS[importanceValue] ?? 1.0;
}

function calculateSubdomainScore(subdomain: Subdomain, answers: AssessmentAnswers): number {
  const scorableQuestions = subdomain.questions.filter(
    (q) => q.type === QuestionType.SELECT && q.hasImportance
  );

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

    if (score > 0 && weight > 0) {
      totalWeightedScore += score * weight;
      totalMaximumWeightedScore += 5 * weight;
    }
  });

  if (totalMaximumWeightedScore === 0) {
    return 0;
  }

  const finalScore = 5 * (totalWeightedScore / totalMaximumWeightedScore);

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