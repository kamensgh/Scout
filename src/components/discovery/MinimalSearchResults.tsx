'use client';

import { useState } from 'react';
import { CategorySearchBar } from './CategorySearchBar';
import { NearbyStoresGrid } from './NearbyStoresGrid';

interface MinimalSearchResultsProps {
  initialQuery?: string;
}

export function MinimalSearchResults({ initialQuery }: MinimalSearchResultsProps) {
  const [category, setCategory] = useState(initialQuery || 'electronics');

  return (
    <div className="space-y-6">
      <CategorySearchBar onCategoryChange={setCategory} defaultCategory={category} />
      <NearbyStoresGrid category={category} />
    </div>
  );
}
