// src/app/assessment/_components/QuestionRenderer.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { type Question, QuestionType, IMPORTANCE_LEVELS } from '~/lib/socmm-schema';
// REMOVED: No more 'calculateCompleteness' import

// A small helper component for the Importance dropdown
const ImportanceSelect = ({ fieldName }: { fieldName: string }) => {
  const { register } = useFormContext();
  return (
    <select {...register(fieldName)} className="border rounded p-2 text-sm">
      {IMPORTANCE_LEVELS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

// REMOVED: The entire 'CompletenessDisplay' component is gone.

export const QuestionRenderer = ({ question }: { question: Question }) => {
  const { register } = useFormContext();

  const renderQuestion = () => {
    switch (question.type) {
      // REMOVED: The 'COMPLETENESS_INDICATOR' case is gone.
      case QuestionType.SELECT:
        return (
          <select {...register(question.id)} className="w-full border rounded p-2">
            <option value="">Select answer</option>
            {question.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case QuestionType.CHECKBOX_GROUP:
        return (
          <div className="grid grid-cols-2 gap-4">
            {question.options?.map((opt) => (
              <div key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.id}.${opt.value}`}
                  {...register(`${question.id}.${opt.value}`)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor={`${question.id}.${opt.value}`}>{opt.label}</label>
              </div>
            ))}
          </div>
        );
      case QuestionType.NUMBER:
        return (
          <input
            type="number"
            defaultValue={0}
            {...register(question.id, { valueAsNumber: true })}
            className="w-full border rounded p-2"
          />
        );
      case QuestionType.TEXT:
        return (
          <input
            type="text"
            {...register(question.id)}
            className="w-full border rounded p-2"
          />
        );
      default:
        // This case should now never be reached if your schema is correct
        return <p>Unsupported question type: {question.type}</p>;
    }
  };
  
  // REMOVED: The special 'if' block for the indicator is gone.

  return (
    <div className="py-4">
      <label className="block font-medium mb-2">{question.label}</label>
      <div className="flex items-center gap-4">
        <div className="flex-grow">{renderQuestion()}</div>
        {question.hasImportance && (
          <div className="flex-shrink-0">
            <ImportanceSelect fieldName={`${question.id}_importance`} />
          </div>
        )}
      </div>
    </div>
  );
};