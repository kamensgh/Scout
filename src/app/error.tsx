'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <AlertTriangle size={40} className="text-scout-accent mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-scout-dark mb-2">Something went wrong</h1>
        <p className="text-scout-muted mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <Button variant="primary" onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
