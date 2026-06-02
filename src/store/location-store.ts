import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const RICH_COUNTRIES = ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'IE'];

interface LocationState {
  rawInput: string | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  countryName: string | null;
  displayName: string | null;
  dataRegion: 'rich' | 'sparse';
  method: 'gps' | 'text' | null;
  status: 'idle' | 'detecting' | 'resolved' | 'error';
  error: string | null;
  isPickerOpen: boolean;
  setFromText: (input: string) => Promise<void>;
  setFromGPS: () => Promise<void>;
  clear: () => void;
  openPicker: () => void;
  closePicker: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      rawInput: null,
      lat: null,
      lng: null,
      city: null,
      country: null,
      countryName: null,
      displayName: null,
      dataRegion: 'rich',
      method: null,
      status: 'idle',
      error: null,
      isPickerOpen: false,

      setFromText: async (input: string) => {
        set({ status: 'detecting', error: null, rawInput: input });
        try {
          const res = await fetch(`/api/location/geocode?input=${encodeURIComponent(input)}`);
          const json = await res.json();
          if (!res.ok || json.error) throw new Error(json.error || 'Geocoding failed');
          const { lat, lng, city, country, countryName, displayName } = json.data;
          const dataRegion: 'rich' | 'sparse' = RICH_COUNTRIES.includes(country) ? 'rich' : 'sparse';
          set({ lat, lng, city, country, countryName, displayName, dataRegion, method: 'text', status: 'resolved', error: null });
        } catch (err) {
          set({ status: 'error', error: err instanceof Error ? err.message : 'Location not found' });
        }
      },

      setFromGPS: async () => {
        set({ status: 'detecting', error: null });
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) reject(new Error('Geolocation not supported'));
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          const { latitude: lat, longitude: lng } = position.coords;
          const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`);
          const json = await res.json();
          if (!res.ok || json.error) throw new Error(json.error || 'Reverse geocoding failed');
          const { city, country, countryName, displayName } = json.data;
          const dataRegion: 'rich' | 'sparse' = RICH_COUNTRIES.includes(country) ? 'rich' : 'sparse';
          set({ lat, lng, city, country, countryName, displayName, dataRegion, method: 'gps', status: 'resolved', error: null, rawInput: displayName });
        } catch (err) {
          if (err instanceof GeolocationPositionError && err.code === 1) {
            set({ status: 'error', error: 'Location permission denied. Please enter your city or postcode.' });
          } else {
            set({ status: 'error', error: err instanceof Error ? err.message : 'Could not detect location' });
          }
        }
      },

      clear: () => set({
        rawInput: null, lat: null, lng: null, city: null, country: null,
        countryName: null, displayName: null, dataRegion: 'rich',
        method: null, status: 'idle', error: null, isPickerOpen: false,
      }),
      openPicker: () => set({ isPickerOpen: true }),
      closePicker: () => set({ isPickerOpen: false }),
    }),
    { name: 'scout-location', partialize: (state) => ({
      rawInput: state.rawInput, lat: state.lat, lng: state.lng,
      city: state.city, country: state.country, countryName: state.countryName,
      displayName: state.displayName, dataRegion: state.dataRegion,
      method: state.method, status: state.status,
    })},
  )
);
