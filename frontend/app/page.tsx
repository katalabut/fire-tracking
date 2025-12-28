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
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
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
        <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Report Fire</h2>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedLocation(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <FireForm
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}
      {!showForm && user && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 font-medium"
        >
          + Report Fire
        </button>
      )}
    </div>
  );
}
