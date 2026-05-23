'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ImageUpload() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/image-search', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.data?.length) {
        router.push(`/search?q=visual-search&ids=${json.data.map((p: { id: string }) => p.id).join(',')}`);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-lg mx-auto">
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all',
            isDragActive
              ? 'border-scout-dark bg-scout-dark/5'
              : 'border-scout-border hover:border-scout-dark/50 hover:bg-scout-bg'
          )}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 bg-scout-bg border border-scout-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isDragActive ? <Upload size={24} className="text-scout-dark" /> : <Camera size={24} className="text-scout-muted" />}
          </div>
          <h3 className="text-base font-semibold text-scout-dark mb-1">
            {isDragActive ? 'Drop to search' : 'Upload an image'}
          </h3>
          <p className="text-sm text-scout-muted">
            Drag & drop or click to browse. JPG, PNG, WEBP supported.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-scout-bg">
            <Image src={preview} alt="Search image" fill className="object-contain" />
            {loading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 size={32} className="text-white animate-spin" />
              </div>
            )}
          </div>
          {!loading && (
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
