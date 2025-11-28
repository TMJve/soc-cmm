// src/app/homebase/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '~/lib/supabase';

type Assessment = {
  id: string;
  name: string;
  created_at: string;
  status: string;
};

export default function Homebase() {
  const router = useRouter();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssessmentName, setNewAssessmentName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      // FIX: No destructuring. Get full response object.
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      
      if (!user) {
        router.push('/login');
        return;
      }

      // FIX: No destructuring.
      const dbResponse = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbResponse.error) {
        console.error('Error fetching:', dbResponse.error);
      } else {
        // Safe cast
        setAssessments((dbResponse.data as unknown as Assessment[]) || []);
      }
      
      setLoading(false);
    };

    void checkUserAndFetch();
  }, [router]);

  const openCreateModal = () => {
    setNewAssessmentName('');
    setIsModalOpen(true);
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessmentName.trim()) return;

    setCreating(true);
    
    // FIX: No destructuring. This was likely line 69 causing the error.
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    
    if (!user) return;

    // FIX: No destructuring.
    const insertResponse = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        name: newAssessmentName,
        profile_data: {},
        answers: {}
      })
      .select()
      .single();

    if (insertResponse.error) {
      alert('Error creating assessment');
      console.error(insertResponse.error);
      setCreating(false);
    } else if (insertResponse.data) {
      const newAssessment = insertResponse.data as unknown as Assessment;
      router.push(`/assessment?id=${newAssessment.id}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Homebase...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Assessments</h1>
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + Start New Assessment
          </button>
        </div>

        <div className="grid gap-4">
          {assessments.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-dashed">
              No assessments found. Start your first one!
            </div>
          ) : (
            assessments.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => router.push(`/assessment?id=${assessment.id}`)}
                className="cursor-pointer rounded-lg border bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-md group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {assessment.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(assessment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    assessment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assessment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Name Your Assessment</h2>
            <form onSubmit={handleConfirmCreate}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assessment Name (e.g. Client Name - Q3)
              </label>
              <input
                autoFocus
                type="text"
                value={newAssessmentName}
                onChange={(e) => setNewAssessmentName(e.target.value)}
                placeholder="Enter a name..."
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {creating ? 'Creating...' : 'Create & Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}