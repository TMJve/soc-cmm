// src/app/assessment/_components/QuestionRenderer.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { type Question, QuestionType, IMPORTANCE_LEVELS } from '~/lib/socmm-schema';

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

export const QuestionRenderer = ({ question }: { question: Question }) => {
  // UPDATED: We now need watch and errors from the form context
  const { register, watch, formState: { errors } } = useFormContext();

  // Watch the value of the current question's dropdown in real-time
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
  
  // ADDED: A helper to determine if the evidence field should be shown
  const showEvidence = question.evidence && (
    Array.isArray(question.evidence.triggerValue)
      ? question.evidence.triggerValue.includes(watchedValue)
      : watchedValue === question.evidence.triggerValue
  );

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

      {/* ADDED: The conditional evidence field */}
      {showEvidence && (
        <div className="mt-4 pl-4 border-l-2 border-blue-500">
          <label className="block font-medium mb-2 text-sm text-gray-700">
            {question.evidence!.label}
          </label>
          <input
            type="text"
            className="w-full rounded border p-2 text-sm"
            placeholder="e.g., //sharepoint/docs/soc-drivers.docx"
            // We create a unique name for this evidence field and make it required
            {...register(`${question.id}_evidence`, { required: 'This field is required.' })}
          />
          {errors[`${question.id}_evidence`] && (
            <p className="mt-1 text-sm text-red-600">{(errors[`${question.id}_evidence`] as any).message}</p>
          )}
        </div>
      )}
    </div>
  );
};