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
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fire Reports</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('reported')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'reported'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Reported
          </button>
          <button
            onClick={() => setFilter('seen')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'seen'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Seen
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'closed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fires.map((fire) => (
          <Link
            key={fire.id}
            href={`/fires/${fire.id}`}
            className="block bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Fire Report #{fire.id}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  fire.status === 'reported'
                    ? 'bg-red-100 text-red-800'
                    : fire.status === 'seen'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {fire.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{fire.description}</p>
            <div className="text-xs text-gray-500">
              <p>Reported by: {fire.reporter?.name}</p>
              <p>
                Location: {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}
              </p>
              <p>{new Date(fire.created_at).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      {fires.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fire reports found.</p>
        </div>
      )}
    </div>
  );
}
