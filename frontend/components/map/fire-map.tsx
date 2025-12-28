'use client';

import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import type { Fire } from '@/lib/types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface FireMapProps {
  fires: Fire[];
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function FireMap({ fires, onMapClick, selectedLocation }: FireMapProps) {
  const [selectedFire, setSelectedFire] = useState<Fire | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 33.3,
    latitude: 34.9,
    zoom: 8,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleMapClick = useCallback(
    (event: any) => {
      if (onMapClick) {
        const { lng, lat } = event.lngLat;
        onMapClick(lat, lng);
      }
    },
    [onMapClick]
  );

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'reported':
        return '#ef4444'; // red
      case 'seen':
        return '#f59e0b'; // orange
      case 'closed':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Mapbox token not configured. Please set NEXT_PUBLIC_MAPBOX_TOKEN.
        </p>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      onClick={handleMapClick}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxToken}
      style={{ width: '100%', height: '100%' }}
    >
      {fires.map((fire) => (
        <Marker
          key={fire.id}
          longitude={fire.longitude}
          latitude={fire.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedFire(fire);
          }}
        >
          <div
            style={{ backgroundColor: getMarkerColor(fire.status) }}
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white font-bold text-xs"
          >
            🔥
          </div>
        </Marker>
      ))}

      {selectedLocation && (
        <Marker
          longitude={selectedLocation.lng}
          latitude={selectedLocation.lat}
          anchor="bottom"
        >
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-200 shadow-lg flex items-center justify-center text-xl">
            📍
          </div>
        </Marker>
      )}

      {selectedFire && (
        <Popup
          longitude={selectedFire.longitude}
          latitude={selectedFire.latitude}
          anchor="top"
          onClose={() => setSelectedFire(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-sm mb-1">Fire Report #{selectedFire.id}</h3>
            <p className="text-xs text-gray-600 mb-2">{selectedFire.description}</p>
            <div className="text-xs">
              <span
                className={`px-2 py-1 rounded ${
                  selectedFire.status === 'reported'
                    ? 'bg-red-100 text-red-800'
                    : selectedFire.status === 'seen'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {selectedFire.status.toUpperCase()}
              </span>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
