import Link from 'next/link';
import { Search } from 'lucide-react';

const LINKS = {
  Product: [
    { label: 'Discover', href: '/' },
    { label: 'Trending', href: '/trending' },
    { label: 'Assistant', href: '/chat' },
    { label: 'Visual search', href: '/image-search' },
    { label: 'Saved', href: '/saved' },
  ],
  Stores: [
    { label: 'Store map', href: '/map' },
    { label: 'All retailers', href: '/trending' },
    { label: 'For sellers', href: '/merchant' },
  ],
  Company: [
    { label: 'About', href: '/' },
    { label: 'Press', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Contact', href: '/chat' },
  ],
  Legal: [
    { label: 'Privacy', href: '/' },
    { label: 'Terms', href: '/' },
    { label: 'Cookies', href: '/' },
    { label: 'Affiliates', href: '/' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-scout-border bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-scout-dark rounded-lg flex items-center justify-center">
                <Search size={14} className="text-white" />
              </div>
              <span className="font-bold text-scout-dark">Scout</span>
            </div>
            <p className="text-sm text-scout-muted max-w-48 mb-4">
              Search once, pay less. Scout watches live prices across local retailers worldwide.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-scout-muted mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-scout-dark hover:text-scout-muted transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-scout-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-scout-muted">
          <span>© 2026 Scout · Made in London</span>
          <span>v0.4 — 3.2M prices indexed</span>
        </div>
      </div>
    </footer>
  );
}
