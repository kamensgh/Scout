'use client';

import { useState, useEffect } from 'react';
import { Heart, Bell, Trash2, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/hooks/useCurrency';

export default function SavedPage() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'saved' | 'alerts'>('saved');
  const { savedProducts, priceAlerts, removeAlert } = useWishlistStore();
  const { formatPrice } = useCurrency();
  const { data: session } = useSession();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-scout-dark">Saved</h1>
        {session?.user && (
          <div className="flex items-center gap-2 text-sm text-scout-muted">
            {session.user.image && (
              <Image src={session.user.image} alt="" width={24} height={24} className="rounded-full" />
            )}
            <span>{session.user.name}</span>
          </div>
        )}
      </div>

      {/* Sign-in prompt */}
      {!session && (
        <div className="mb-6 flex items-center justify-between bg-scout-bg border border-scout-border rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-medium text-scout-dark">Sign in to sync your saves</p>
            <p className="text-xs text-scout-muted mt-0.5">Access your saved items across all your devices</p>
          </div>
          <button
            onClick={() => signIn('google')}
            className="flex items-center gap-1.5 px-4 py-2 bg-scout-dark text-white text-sm font-medium rounded-xl hover:bg-scout-dark/90 transition-colors shrink-0"
          >
            <LogIn size={14} /> Sign in
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-scout-bg border border-scout-border rounded-xl p-1 w-fit mb-8">
        {[
          { id: 'saved' as const, label: `Saved items (${savedProducts.length})`, icon: Heart },
          { id: 'alerts' as const, label: `Price alerts (${priceAlerts.length})`, icon: Bell },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-scout-dark shadow-card' : 'text-scout-muted hover:text-scout-dark'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {!session ? (
        <div className="text-center py-20">
          <Heart size={48} className="text-scout-border mx-auto mb-4" />
          <h2 className="text-xl font-bold text-scout-dark mb-2">Sign in to see your saved items</h2>
          <p className="text-scout-muted mb-6">Your saved products and price alerts will appear here.</p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-scout-dark text-white text-sm font-medium rounded-xl hover:bg-scout-dark/90 transition-colors"
          >
            <LogIn size={16} /> Sign in with Google
          </button>
        </div>
      ) : tab === 'saved' ? (
        savedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-scout-border mx-auto mb-4" />
            <h2 className="text-xl font-bold text-scout-dark mb-2">Nothing saved yet</h2>
            <p className="text-scout-muted mb-6">Tap the heart on any product to save it for later.</p>
            <Link href="/"><Button variant="primary">Start browsing</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      ) : (
        priceAlerts.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="text-scout-border mx-auto mb-4" />
            <h2 className="text-xl font-bold text-scout-dark mb-2">No price alerts</h2>
            <p className="text-scout-muted mb-6">Set a target price on any product and we&apos;ll alert you when it drops.</p>
            <Link href="/"><Button variant="primary">Find products</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {priceAlerts.map(alert => (
              <div key={alert.productId} className="flex items-center justify-between bg-white border border-scout-border rounded-2xl px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-scout-dark">{alert.productName}</p>
                  <p className="text-xs text-scout-muted mt-0.5">Alert when drops below <strong>{formatPrice(alert.targetPricePence)}</strong> · {alert.email}</p>
                </div>
                <button onClick={() => removeAlert(alert.productId)} className="text-scout-muted hover:text-scout-red transition-colors p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
