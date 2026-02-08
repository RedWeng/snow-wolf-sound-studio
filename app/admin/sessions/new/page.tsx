/**
 * Admin New Session Page
 * 
 * Create a new session
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionForm } from '@/components/admin/SessionForm';
import type { Session } from '@/lib/types/database';

export default function NewSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<Session>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '新增課程失敗');
      }

      await response.json();
      
      // Success - redirect to sessions list
      router.push('/admin/sessions');
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err instanceof Error ? err.message : '新增課程時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/sessions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">新增課程</h1>
              <p className="text-gray-600 mt-1">建立新的活動課程</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <SessionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </main>
    </div>
  );
}
