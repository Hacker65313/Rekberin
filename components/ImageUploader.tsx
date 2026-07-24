'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from './Toast';

interface Props {
  bucket: 'products' | 'stores';
  folder: string;
  multiple?: boolean;
  max?: number;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function ImageUploader({
  bucket,
  folder,
  multiple = false,
  max = 5,
  value,
  onChange,
  label = 'Unggah Gambar',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const uploadFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (value.length + files.length > max) {
      push(`Maksimal ${max} gambar`, 'error');
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const urls: string[] = [];
      for (const file of files) {
        if (file.size > 3 * 1024 * 1024) {
          push(`Gambar ${file.name} > 3MB, dilewati`, 'error');
          continue;
        }
        const ext = file.name.split('.').pop();
        const path = `${folder}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        urls.push(pub.publicUrl);
      }
      onChange([...value, ...urls]);
      push('Gambar berhasil diunggah', 'success');
    } catch (err: any) {
      push(err?.message || 'Gagal upload', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gray-200">
            <Image src={url} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
              aria-label="Hapus"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500',
              uploading && 'opacity-60',
            )}
          >
            {uploading ? (
              <svg className="h-6 w-6 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              </svg>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <span className="mt-1 text-xs">Tambah</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={uploadFiles}
      />
    </div>
  );
}
