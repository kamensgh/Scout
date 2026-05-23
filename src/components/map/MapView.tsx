'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { Store } from '@/types';
import { useLocationStore } from '@/store/location-store';
import { Spinner } from '@/components/ui/Spinner';

const MAP_STYLE = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
];

interface MapViewProps {
  stores?: (Store & { distanceKm?: number })[];
  height?: string;
  className?: string;
}

export function MapView({ stores = [], height = '500px', className }: MapViewProps) {
  const { lat, lng } = useLocationStore();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (stores.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      if (lat && lng) bounds.extend({ lat, lng });
      stores.filter(s => s.lat && s.lng).forEach(s => bounds.extend({ lat: s.lat!, lng: s.lng! }));
      map.fitBounds(bounds, 60);
    }
  }, [stores, lat, lng]);

  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`flex items-center justify-center bg-scout-bg border border-scout-border rounded-2xl text-scout-muted text-sm ${className || ''}`} style={{ height }}>
        Map unavailable — add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-scout-bg border border-scout-border rounded-2xl ${className || ''}`} style={{ height }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${className || ''}`} style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={lat && lng ? { lat, lng } : { lat: 51.5074, lng: -0.1278 }}
        zoom={12}
        options={{ styles: MAP_STYLE, disableDefaultUI: false, zoomControl: true, streetViewControl: false, mapTypeControl: false }}
        onLoad={onMapLoad}
      >
        {/* User location */}
        {lat && lng && (
          <Marker
            position={{ lat, lng }}
            icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#2563EB', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }}
            title="Your location"
          />
        )}

        {/* Store markers */}
        {stores.filter(s => s.lat && s.lng).map(store => (
          <Marker
            key={store.id}
            position={{ lat: store.lat!, lng: store.lng! }}
            onClick={() => setSelectedStore(store.id)}
            title={store.name}
          />
        ))}

        {/* Info window */}
        {selectedStore && (() => {
          const store = stores.find(s => s.id === selectedStore);
          if (!store?.lat || !store?.lng) return null;
          return (
            <InfoWindow position={{ lat: store.lat, lng: store.lng }} onCloseClick={() => setSelectedStore(null)}>
              <div className="p-1">
                <p className="font-semibold text-sm">{store.name}</p>
                {store.address && <p className="text-xs text-gray-500 mt-0.5">{store.address}</p>}
                {store.distanceKm !== undefined && (
                  <p className="text-xs text-gray-500">{(store.distanceKm * 0.621).toFixed(1)} mi away</p>
                )}
              </div>
            </InfoWindow>
          );
        })()}
      </GoogleMap>
    </div>
  );
}
