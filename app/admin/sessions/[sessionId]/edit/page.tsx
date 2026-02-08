/**
 * Admin Session Edit Page
 * 
 * Edit session details including title, date, time, capacity, price
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SessionForm } from '@/components/admin/SessionForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Session } from '@/lib/types/database';

export default function EditSessionPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('無法載入課程資料');
      }

      const data = await response.json();
      setSession(data.session);
    } catch (err) {
      console.error('Error loading session:', err);
      setError(err instanceof Error ? err.message : '載入課程時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Session>) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '更新課程失敗');
      }

      // Success - redirect to sessions list
      router.push('/admin/sessions');
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err instanceof Error ? err.message : '更新課程時發生錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/sessions');
  };

  if (isChecking || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">找不到課程</h2>
            <button
              onClick={() => router.push('/admin/sessions')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              返回課程列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin/sessions"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← 返回課程列表
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">編輯課程</h1>
          <p className="text-gray-600 mt-1">{session.title_zh}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <SessionForm
          initialData={session}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </main>
    </div>
  );
}
