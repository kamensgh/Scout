import type { ProductCategory } from '@/types';

export function getCategories() {
  return [
    { id: 'audio' as ProductCategory, label: 'Audio', icon: '🎧', count: 142 },
    { id: 'computing' as ProductCategory, label: 'Computing', icon: '💻', count: 318 },
    { id: 'tvs' as ProductCategory, label: 'TVs', icon: '📺', count: 96 },
    { id: 'home' as ProductCategory, label: 'Home', icon: '🏠', count: 482 },
    { id: 'kitchen' as ProductCategory, label: 'Kitchen', icon: '🍳', count: 211 },
    { id: 'furniture' as ProductCategory, label: 'Furniture', icon: '🛋️', count: 173 },
    { id: 'diy' as ProductCategory, label: 'DIY', icon: '🔧', count: 264 },
    { id: 'sports' as ProductCategory, label: 'Sports', icon: '🚴', count: 187 },
  ];
}
