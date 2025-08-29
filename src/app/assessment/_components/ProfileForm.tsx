// src/app/assessment/_components/ProfileForm.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '~/lib/store';
import { profileSchema, type ProfileFormData } from './ProfileForm.schema';
import React from 'react';

// A helper component to generate the score dropdowns to keep our code clean
const ScoreSelect = ({ name, register, range }: { name: keyof ProfileFormData, register: any, range: '1-5' | '1-3' }) => {
  const options = range === '1-5'
    ? Array.from({ length: 41 }, (_, i) => (1 + i * 0.1).toFixed(1)) // 1.0 to 5.0
    : Array.from({ length: 21 }, (_, i) => (1 + i * 0.1).toFixed(1)); // 1.0 to 3.0

  return (
    <select {...register(name)} className="w-full rounded border p-2">
      <option value="">-</option>
      {options.map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  );
};

export default function ProfileForm() {
  const { setProfileData } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      assessmentDate: new Date().toISOString().slice(0, 10),
      names: '',
      departments: '',
      purpose: '',
      scope: '',
      assessmentType: '',
      assessmentStyle: '',
      businessFTE: '',
      sector: '',
      socYears: '',
      socFTE: '',
      socModel: '',
      socRegion: '',
      geoOps: '',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log('Profile form submitted successfully:', data);
    setProfileData(data);
  };

  const orgFields = [
    { name: 'businessFTE', label: 'Business size (FTE)' },
    { name: 'sector', label: 'Sector' },
    { name: 'socYears', label: 'Number of years of SOC operations' },
    { name: 'socFTE', label: 'SOC size (FTEs)' },
    { name: 'socModel', label: 'SOC organisational model' },
    { name: 'socRegion', label: 'SOC region' },
  ] as const;

  const maturityFields = [
    { name: 'tgtMaturityBusiness', label: 'Target maturity level business domain' },
    { name: 'tgtMaturityPeople', label: 'Target maturity level people domain' },
    { name: 'tgtMaturityProcess', label: 'Target maturity level process domain' },
    { name: 'tgtMaturityTech', label: 'Target maturity level technology domain' },
    { name: 'tgtMaturityServices', label: 'Target maturity level services domain' },
    { name: 'tgtMaturityOverall', label: 'Target overall maturity level' },
  ] as const;

  const capabilityFields = [
    { name: 'tgtCapTech', label: 'Target capability level technology domain' },
    { name: 'tgtCapServices', label: 'Target capability level services domain' },
    { name: 'tgtCapOverall', label: 'Target overall capability level' },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-6 border-b pb-4 text-3xl font-bold">
        Assessment Profile
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* --- Section 1: Assessment Details --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Assessment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assessmentDate" className="mb-1 block font-medium">Date of assessment</label>
              <input id="assessmentDate" type="date" {...register('assessmentDate')} className="w-full rounded border p-2"/>
            </div>
            <div>
              <label htmlFor="names" className="mb-1 block font-medium">Name(s)</label>
              <input id="names" {...register('names')} className="w-full rounded border p-2"/>
              {errors.names && <p className="mt-1 text-sm text-red-600">{errors.names.message}</p>}
            </div>
            <div>
              <label htmlFor="departments" className="mb-1 block font-medium">Department(s)</label>
              <input id="departments" {...register('departments')} className="w-full rounded border p-2"/>
              {errors.departments && <p className="mt-1 text-sm text-red-600">{errors.departments.message}</p>}
            </div>
            <div>
              <label htmlFor="assessmentType" className="mb-1 block font-medium">Assessment type</label>
              <input id="assessmentType" {...register('assessmentType')} className="w-full rounded border p-2"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="purpose" className="mb-1 block font-medium">Intended purpose of the assessment</label>
              <textarea id="purpose" {...register('purpose')} rows={3} className="w-full rounded border p-2"/>
            </div>
             <div className="md:col-span-2">
              <label htmlFor="scope" className="mb-1 block font-medium">Scope</label>
              <textarea id="scope" {...register('scope')} rows={2} className="w-full rounded border p-2"/>
            </div>
             <div>
              <label htmlFor="assessmentStyle" className="mb-1 block font-medium">Assessment style</label>
              <input id="assessmentStyle" {...register('assessmentStyle')} className="w-full rounded border p-2"/>
            </div>
          </div>
        </section>

        {/* --- Section 2: Organisation & SOC Profile --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Organisation & SOC Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orgFields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block font-medium">{field.label}</label>
                <input id={field.name} {...register(field.name)} className="w-full rounded border p-2"/>
              </div>
            ))}
            <div className="md:col-span-2">
              <label htmlFor="geoOps" className="mb-1 block font-medium">Geographic operation</label>
              <textarea id="geoOps" {...register('geoOps')} rows={2} className="w-full rounded border p-2"/>
            </div>
          </div>
        </section>

        {/* --- Section 3: Target Maturity (optional) --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Target Maturity (optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maturityFields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block font-medium">{field.label}</label>
                <ScoreSelect name={field.name} register={register} range="1-5" />
              </div>
            ))}
          </div>
        </section>

        {/* --- Section 4: Target Capability (optional) --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Target Capability (optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilityFields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block font-medium">{field.label}</label>
                <ScoreSelect name={field.name} register={register} range="1-3" />
              </div>
            ))}
          </div>
        </section>

        {/* --- Section 5: Notes or comments --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Notes or comments</h2>
           <textarea id="notes" {...register('notes')} rows={4} className="w-full rounded border p-2"/>
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">
            Next: Start Assessment
          </button>
        </div>
      </form>
    </div>
  );
}