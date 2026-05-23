'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MapPin, Heart, BarChart2, Menu, X } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { useComparisonStore } from '@/store/comparison-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'Discover', href: '/' },
  { label: 'Browse', href: '/trending' },
  { label: 'Assistant', href: '/chat' },
  { label: 'Stores', href: '/map' },
  { label: 'Visual', href: '/image-search' },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { displayName, openPicker } = useLocationStore();
  const { comparedIds } = useComparisonStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-scout-border">
      {/* Top bar */}
      <div className="border-b border-scout-border/50 bg-scout-bg">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-xs text-scout-muted">
          <div className="flex items-center gap-4">
            {displayName && (
              <button onClick={openPicker} className="flex items-center gap-1 hover:text-scout-dark transition-colors">
                <MapPin size={11} />
                <span>{displayName}</span>
              </button>
            )}
            <span>Free price alerts</span>
            <span className="hidden sm:inline">3.2M prices · updated hourly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/merchant" className="hover:text-scout-dark transition-colors">Sell on Scout</Link>
            <Link href="/chat" className="hover:text-scout-dark transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-scout-dark rounded-lg flex items-center justify-center">
            <Search size={14} className="text-white" />
          </div>
          <span className="font-bold text-scout-dark tracking-tight">Scout</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-scout-dark text-white'
                  : 'text-scout-muted hover:text-scout-dark hover:bg-scout-bg'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search bar (hidden on home) */}
        {!isHome && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 h-9 bg-scout-bg border border-scout-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-scout-dark/20 focus:border-scout-dark transition-all"
              />
            </div>
          </form>
        )}

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-1">
          {comparedIds.length > 0 && (
            <Link href="/compare" className="relative">
              <Button variant="ghost" size="icon" aria-label="Compare">
                <BarChart2 size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-scout-blue text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {comparedIds.length}
                </span>
              </Button>
            </Link>
          )}
          <Link href="/saved">
            <Button variant="ghost" size="icon" aria-label="Saved">
              <Heart size={18} />
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-scout-bg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-scout-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === href ? 'bg-scout-dark text-white' : 'text-scout-muted hover:text-scout-dark'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
