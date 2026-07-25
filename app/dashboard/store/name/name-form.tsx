'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify, cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/types';

export default function EditNameForm({ store }: { store: Store }) {
  const router = useRouter();
  const { push } = useToast();
  const [name, setName] = useState(store.name);
  const [saving, setSaving] = useState(false);

  const slug = slugify(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      push('Nama toko wajib diisi', 'error');
      return;
    }
    if (name.trim() === store.name) {
      push('Nama tidak berubah', 'info');
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      // Cek slug unik
      const newSlug = slugify(name);
      const { data: existing } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', store.id)
        .maybeSingle();
      if (existing) {
        push('Nama toko sudah dipakai, pilih nama lain', 'error');
        setSaving(false);
        return;
      }
      const { error } = await supabase
        .from('stores')
        .update({ name: name.trim(), slug: newSlug })
        .eq('id', store.id);
      if (error) throw error;
      push('Nama toko berhasil diubah!', 'success');
      router.push('/dashboard/store');
      router.refresh();
    } catch (err: any) {
      push(err?.message || 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/dashboard/store" className="btn-ghost mb-4 px-3 py-1.5 text-xs">
        ← Kembali ke Toko Saya
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Edit Nama Toko</h1>
      <p className="mt-1 text-sm text-gray-500">Ubah nama toko Anda. Link toko juga akan diperbarui.</p>

      {slug && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <span className="font-medium">Link toko baru:</span>
          <code className="rounded-lg bg-white px-2 py-0.5 text-brand-600">
            /store/{slug}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="label">Nama Toko</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama toko"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={cn('btn-primary w-full', saving && 'opacity-60')}
        >
          {saving ? (
            <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.2-8.5" />
            </svg>
          ) : 'Simpan Nama Baru'}
        </button>
      </form>
    </div>
  );
}
