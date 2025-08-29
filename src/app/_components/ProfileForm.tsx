'use client';

import React, { useState } from 'react';

/* ---------- Types ---------- */
export type ProfileData = {
  assessmentDate: string;
  names: string;
  departments: string;
  purpose: string;
  scope: string;
  assessmentType: string;
  assessmentStyle: string;

  businessFTE: string;
  sector: string;
  socYears: string;
  socFTE: string;
  socModel: string;
  socRegion: string;
  geoOps: string;

  tgtMaturityBusiness: string;
  tgtMaturityPeople: string;
  tgtMaturityProcess: string;
  tgtMaturityTech: string;
  tgtMaturityServices: string;

  tgtCapTech: string;
  tgtCapServices: string;
  tgtCapOverall: string;

  notes: string;
};

type Props = {
  onNext: (data: ProfileData) => void;
};

/* ---------- Helper ---------- */
const scoreSelect = (
  name: keyof ProfileData,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full border rounded p-2"
  >
    <option value="">–</option>
    {Array.from({ length: 41 }).map((_, i) => {
      const v = (1 + i * 0.1).toFixed(1); // 1.0 → 5.0
      return (
        <option key={v} value={v}>
          {v}
        </option>
      );
    })}
  </select>
);

/* ---------- Component ---------- */
export default function ProfileForm({ onNext }: Props) {
  const [data, setData] = useState<ProfileData>({
    assessmentDate: new Date().toISOString().substring(0, 10),
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
    tgtMaturityBusiness: '',
    tgtMaturityPeople: '',
    tgtMaturityProcess: '',
    tgtMaturityTech: '',
    tgtMaturityServices: '',
    tgtCapTech: '',
    tgtCapServices: '',
    tgtCapOverall: '',
    notes: '',
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 py-10 max-w-4xl mx-auto">
      {/* Section 1 – Assessment details */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Assessment Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date of assessment</label>
            <input
              type="date"
              name="assessmentDate"
              value={data.assessmentDate}
              onChange={onChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Name(s)</label>
            <input
              name="names"
              value={data.names}
              onChange={onChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Department(s)</label>
            <input
              name="departments"
              value={data.departments}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Assessment type</label>
            <input
              name="assessmentType"
              value={data.assessmentType}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Intended purpose of the assessment</label>
            <textarea
              name="purpose"
              value={data.purpose}
              onChange={onChange}
              rows={3}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Scope</label>
            <textarea
              name="scope"
              value={data.scope}
              onChange={onChange}
              rows={2}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Assessment style</label>
            <input
              name="assessmentStyle"
              value={data.assessmentStyle}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </section>

      {/* Section 2 – Org & SOC profile */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Organization &amp; SOC Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Business size (FTE)', name: 'businessFTE' },
            { label: 'Sector', name: 'sector' },
            { label: 'Number of years of SOC operations', name: 'socYears' },
            { label: 'SOC size (FTEs)', name: 'socFTE' },
            { label: 'SOC org model', name: 'socModel' },
            { label: 'SOC region', name: 'socRegion' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                name={name}
                value={data[name as keyof ProfileData]}
                onChange={onChange}
                className="w-full border rounded p-2"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Geographic operations</label>
            <textarea
              name="geoOps"
              value={data.geoOps}
              onChange={onChange}
              rows={2}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </section>

      {/* Section 3 – Target maturity */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Target Maturity (optional)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Business domain', name: 'tgtMaturityBusiness' },
            { label: 'People domain', name: 'tgtMaturityPeople' },
            { label: 'Process domain', name: 'tgtMaturityProcess' },
            { label: 'Technology domain', name: 'tgtMaturityTech' },
            { label: 'Services domain', name: 'tgtMaturityServices' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              {scoreSelect(name as keyof ProfileData, data[name as keyof ProfileData], onChange)}
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 – Target capability */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Target Capability (optional)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Technology domain', name: 'tgtCapTech' },
            { label: 'Services domain', name: 'tgtCapServices' },
            { label: 'Overall capability', name: 'tgtCapOverall' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              {scoreSelect(name as keyof ProfileData, data[name as keyof ProfileData], onChange)}
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Notes / Comments</h2>
        <textarea
          name="notes"
          value={data.notes}
          onChange={onChange}
          rows={4}
          className="w-full border rounded p-2"
        />
      </section>

      {/* Action button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Next: Start Assessment
        </button>
      </div>
    </form>
  );
}
