'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FireMap } from '@/components/map/fire-map';
import { FireForm } from '@/components/fires/fire-form';
import { apiClient } from '@/lib/api';
import type { Fire } from '@/lib/types';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [fires, setFires] = useState<Fire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchFires();
  }, []);

  const fetchFires = async () => {
    try {
      const { fires } = await apiClient.getFires();
      setFires(fires);
    } catch (error) {
      console.error('Failed to fetch fires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (user) {
      setSelectedLocation({ lat, lng });
      setShowForm(true);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedLocation(null);
    fetchFires();
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
    <div className="h-[calc(100vh-64px)] flex">
      <div className="flex-1 relative">
        <FireMap
          fires={fires}
          onMapClick={handleMapClick}
          selectedLocation={selectedLocation}
        />
      </div>
      {showForm && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-xl">🔥</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Report Fire</h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedLocation(null);
                }}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-6">
            <FireForm
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
      {!showForm && user && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute bottom-8 right-8 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl font-semibold text-lg transform hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="text-2xl">🔥</span>
          Report Fire
        </button>
      )}
    </div>
  );
}
