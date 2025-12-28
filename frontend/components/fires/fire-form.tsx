'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface FireFormProps {
  onSuccess?: () => void;
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function FireForm({ onSuccess, selectedLocation, onLocationSelect }: FireFormProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError('Please select a location on the map');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await apiClient.createFire({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        description,
      });
      setDescription('');
      onLocationSelect(0, 0);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report fire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        {selectedLocation ? (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </div>
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            Click on the map to select a location
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe what you see..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedLocation}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300"
      >
        {loading ? 'Reporting...' : 'Report Fire'}
      </button>
    </form>
  );
}
