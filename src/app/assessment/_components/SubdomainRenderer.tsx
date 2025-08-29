// src/app/assessment/_components/SubdomainRenderer.tsx
'use client';

import { type Subdomain } from '~/lib/socmm-schema';
import { QuestionRenderer } from './QuestionRenderer';

export const SubdomainRenderer = ({ subdomain }: { subdomain: Subdomain }) => {

  return (
    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">{subdomain.name}</h2>
      
      <div className="divide-y">
        {subdomain.questions.map((question) => (
          <QuestionRenderer key={question.id} question={question} />
        ))}
      </div>
    </section>
  );
};