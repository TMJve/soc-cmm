// src/app/homebase/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '~/lib/supabase';

// Define the interface for the database row
interface Assessment {
  id: string;
  name: string;
  created_at: string;
  status: string;
}

export default function Homebase() {
  const router = useRouter();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssessmentName, setNewAssessmentName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch logic
  const fetchAssessments = async () => {
    // 1. Check User
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    
    if (!user) {
      router.push('/login');
      return;
    }

    // 2. Fetch Data
    const dbResponse = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbResponse.error) {
      console.error('Error fetching:', dbResponse.error);
    } else {
      setAssessments((dbResponse.data as unknown as Assessment[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchAssessments();
  }, [router]);

  // --- NEW: LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // --- NEW: DELETE FUNCTION ---
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    const { error } = await supabase.from('assessments').delete().eq('id', id);

    if (error) {
      alert("Failed to delete");
    } else {
      setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessmentName.trim()) return;

    setCreating(true);
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    
    if (!user) return;

    const result = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        name: newAssessmentName,
        profile_data: {},
        answers: {}
      })
      .select()
      .single();

    if (result.data) {
      const newAssessment = result.data as unknown as Assessment;
      router.push(`/assessment?id=${newAssessment.id}`);
    } else {
      setCreating(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Homebase...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assessments</h1>
            {/* LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
            >
              Log Out
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
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
                className="cursor-pointer rounded-lg border bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-md relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                      {assessment.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {assessment.status}
                    </span>
                    {/* DELETE ICON BUTTON */}
                    <button
                      onClick={(e) => handleDelete(assessment.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 z-10"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
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
              <input
                autoFocus
                value={newAssessmentName}
                onChange={(e) => setNewAssessmentName(e.target.value)}
                placeholder="Enter name..."
                className="w-full rounded-md border border-gray-300 p-2 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" disabled={creating} className="bg-blue-600 px-4 py-2 text-white rounded-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}