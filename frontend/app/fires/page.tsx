'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api';
import type { Fire } from '@/lib/types';
import Link from 'next/link';

export default function FiresPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [fires, setFires] = useState<Fire[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchFires();
  }, [filter]);

  const fetchFires = async () => {
    try {
      const { fires } = await apiClient.getFires(filter || undefined);
      setFires(fires);
    } catch (error) {
      console.error('Failed to fetch fires:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-medium">Loading fires...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fire Reports</h1>
              <p className="text-sm text-gray-600 mt-0.5">Monitor all fire incidents across Cyprus</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === ''
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1">📋</span> All
            </button>
            <button
              onClick={() => setFilter('reported')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'reported'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1">🚨</span> Reported
            </button>
            <button
              onClick={() => setFilter('seen')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'seen'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1">👁️</span> Seen
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'closed'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1">✅</span> Closed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fires.map((fire) => (
            <Link
              key={fire.id}
              href={`/fires/${fire.id}`}
              className="group block bg-white shadow-card rounded-2xl p-6 hover:shadow-card-hover transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-md ${
                    fire.status === 'reported'
                      ? 'bg-gradient-to-br from-red-500 to-red-600'
                      : fire.status === 'seen'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                      : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    🔥
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      Fire #{fire.id}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(fire.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    fire.status === 'reported'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : fire.status === 'seen'
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {fire.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                {fire.description}
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">👤</span>
                  <span className="font-medium">{fire.reporter?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">📍</span>
                  <span className="font-mono">{fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">🕐</span>
                  <span>{new Date(fire.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-red-600 font-medium group-hover:text-red-700">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {fires.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl opacity-50">🔍</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">No fire reports found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
