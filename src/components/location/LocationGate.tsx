'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useLocationStore } from '@/store/location-store';
import { LocationModal } from './LocationModal';

export function LocationGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const status = useLocationStore(s => s.status);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (status !== 'resolved') return <LocationModal />;
  return <>{children}</>;
}
