import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <p className="text-6xl font-bold text-scout-border mb-4">404</p>
        <h1 className="text-2xl font-bold text-scout-dark mb-2">Page not found</h1>
        <p className="text-scout-muted mb-6">We couldn&apos;t find what you&apos;re looking for.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/"><Button variant="primary">Go home</Button></Link>
          <Link href="/search?q="><Button variant="secondary"><Search size={16} /> Search</Button></Link>
        </div>
      </div>
    </div>
  );
}
