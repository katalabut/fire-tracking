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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
            📍
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Fire Location
            </label>
            {selectedLocation ? (
              <div className="space-y-1">
                <div className="text-sm font-mono text-gray-700 bg-white rounded-lg px-3 py-2 border border-blue-200">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
                <p className="text-xs text-blue-700 font-medium">✓ Location selected on map</p>
              </div>
            ) : (
              <div className="text-sm text-blue-700 bg-blue-50/50 p-3 rounded-lg border border-blue-200/50">
                👆 Click on the map to select the fire location
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
          What do you see?
        </label>
        <textarea
          id="description"
          rows={5}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-none"
          placeholder="Describe the fire: size, smoke color, nearby landmarks..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="mt-2 text-xs text-gray-500">
          Be as detailed as possible to help firefighters respond quickly
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedLocation}
        className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Reporting Fire...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🔥</span>
            Report Fire Emergency
          </span>
        )}
      </button>
    </form>
  );
}
