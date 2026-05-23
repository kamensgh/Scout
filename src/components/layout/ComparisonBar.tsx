'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, X } from 'lucide-react';
import { useComparisonStore } from '@/store/comparison-store';
import { Button } from '@/components/ui/Button';

export function ComparisonBar() {
  const { comparedIds, clear } = useComparisonStore();

  return (
    <AnimatePresence>
      {comparedIds.length >= 2 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-scout-dark text-white rounded-2xl shadow-modal px-5 py-3 flex items-center gap-4"
        >
          <BarChart2 size={18} className="text-white/70" />
          <span className="text-sm font-medium">
            {comparedIds.length} item{comparedIds.length !== 1 ? 's' : ''} selected
          </span>
          <Link href="/compare">
            <Button size="sm" variant="accent">
              Compare
            </Button>
          </Link>
          <button onClick={clear} className="p-1 rounded hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
