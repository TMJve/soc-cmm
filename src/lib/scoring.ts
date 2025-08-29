// src/lib/scoring.ts

function getValueFromPath(obj: Record<string, any>, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

import { assessmentModel, QuestionType } from './socmm-schema';
import { type Domain, type Subdomain } from './socmm-schema';

type AssessmentAnswers = Record<string, any>;

/**
 * Calculates the maturity score for a single subdomain using normalization.
 */
function calculateSubdomainScore(subdomain: Subdomain, answers: AssessmentAnswers): number {
  const scorableQuestions = subdomain.questions.filter(
    (q) => q.type === QuestionType.SELECT
  );

  if (scorableQuestions.length === 0) {
    return 0;
  }

  const minPossibleScore = scorableQuestions.length * 1;
  const maxPossibleScore = scorableQuestions.length * 5;

  let actualScore = 0;
  scorableQuestions.forEach((question) => {
    const answerValue = getValueFromPath(answers, question.id);
    
    // THE FIX IS HERE: We add a check to ensure the value is a string before parsing it.
    if (typeof answerValue === 'string') {
      const parsedValue = parseInt(answerValue, 10);
      if (!isNaN(parsedValue)) { // Ensure it's a valid number
        actualScore += parsedValue;
      }
    }
  });

  if (actualScore === 0) {
    return 0;
  }

  const normalizedScore = (actualScore - minPossibleScore) / (maxPossibleScore - minPossibleScore);
  let finalScore = 5 * normalizedScore;
  finalScore = Math.max(0, finalScore);

  return parseFloat(finalScore.toFixed(2));
}

/**
 * Calculates the overall maturity score for a whole domain.
 */
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

/**
 * The main orchestrator function we'll call from our UI.
 */
export function calculateAllScores(answers: AssessmentAnswers) {
  const results: Record<string, any> = {};
  assessmentModel.forEach((domain) => {
    const domainScore = calculateDomainScore(domain, answers);
    results[domain.id] = {
      name: domain.name,
      score: domainScore,
      subdomains: {},
    };
    domain.subdomains.forEach((subdomain) => {
      const subdomainScore = calculateSubdomainScore(subdomain, answers);
      results[domain.id].subdomains[subdomain.id] = {
        name: subdomain.name,
        score: subdomainScore,
      };
    });
  });
  return results;
}