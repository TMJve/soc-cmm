// src/app/assessment/_components/QuestionRenderer.tsx
'use client';

import { useFormContext, type UseFormRegister } from 'react-hook-form';
import { type Question, QuestionType, IMPORTANCE_LEVELS } from '~/lib/socmm-schema';

// Helper for the Importance dropdown. It now uses a specific type for the register prop.
const ImportanceSelect = ({ fieldName, register }: { fieldName: string, register: UseFormRegister<Record<string, unknown>> }) => {
  return (
    <div className="flex items-center gap-2">
      <select {...register(fieldName)} className="border rounded p-2 text-sm">
        {IMPORTANCE_LEVELS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div title="This sets the weight of the question in the final score calculation." className="cursor-help">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export const QuestionRenderer = ({ question }: { question: Question }) => {
  // Use 'unknown' which is the type-safe alternative to 'any'
  const { register, watch, formState: { errors } } = useFormContext<Record<string, unknown>>();

  const watchedValue = watch(question.id);

  const renderQuestion = () => {
    switch (question.type) {
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
        return <p>Unsupported question type: {question.type}</p>;
    }
  };
  
  const showEvidence = question.evidence && (
    Array.isArray(question.evidence.triggerValue)
      ? question.evidence.triggerValue.includes(watchedValue as string) // We can safely cast here
      : typeof watchedValue === 'string' && watchedValue === question.evidence.triggerValue
  );

  const evidenceError = errors[`${question.id}_evidence`];

  return (
    <div className="py-4">
      <label className="block font-medium mb-2">{question.label}</label>
      
      <div className="flex items-center gap-4">
        <div className="flex-grow">{renderQuestion()}</div>
        {question.hasImportance && (
          <div className="flex-shrink-0">
            <ImportanceSelect fieldName={`${question.id}_importance`} register={register} />
          </div>
        )}
      </div>

      {showEvidence && (
        <div className="mt-4 pl-4 border-l-2 border-blue-500">
          <label className="block font-medium mb-2 text-sm text-gray-700">
            {question.evidence!.label}
          </label>
          <input
            type="text"
            className="w-full rounded border p-2 text-sm"
            placeholder="e.g., //sharepoint/docs/soc-drivers.docx"
            {...register(`${question.id}_evidence`, { required: 'This field is required.' })}
          />
          {evidenceError && typeof evidenceError.message === 'string' && (
            <p className="mt-1 text-sm text-red-600">
                {evidenceError.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};