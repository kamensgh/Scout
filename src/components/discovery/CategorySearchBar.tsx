'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'electronics', label: '🔌 Electronics' },
  { id: 'furniture', label: '🛋️ Furniture' },
  { id: 'kitchen', label: '🍳 Kitchen' },
  { id: 'sports', label: '🏃 Sports' },
  { id: 'fashion', label: '👗 Fashion' },
  { id: 'groceries', label: '🛒 Groceries' },
  { id: 'diy', label: '🔧 DIY' },
];

interface CategorySearchBarProps {
  onCategoryChange?: (category: string) => void;
  defaultCategory?: string;
}

export function CategorySearchBar({ onCategoryChange, defaultCategory = 'electronics' }: CategorySearchBarProps) {
  const [active, setActive] = useState(defaultCategory);
  const [custom, setCustom] = useState('');

  const select = (id: string) => {
    setActive(id);
    onCategoryChange?.(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => select(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              active === id
                ? 'bg-scout-dark text-white border-scout-dark'
                : 'bg-white text-scout-muted border-scout-border hover:border-scout-dark hover:text-scout-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted" />
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && custom.trim()) { select(custom.trim().toLowerCase()); } }}
          placeholder="Or type any category..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-scout-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-scout-dark/20 focus:border-scout-dark transition-all"
        />
      </div>
    </div>
  );
}
