'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify, cn } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/types';

interface Props {
  store: Store | null;
  ownerId: string;
}

const CATEGORIES = [
  'Fashion', 'Elektronik', 'Makanan', 'Kesehatan', 'Olahraga',
  'Hobi', 'Otomotif', 'Rumah', 'Kecantikan', 'Lainnya',
];

export default function StoreForm({ store, ownerId }: Props) {
  const isEdit = !!store;
  const router = useRouter();
  const { push } = useToast();

  const [name, setName] = useState(store?.name || '');
  const [description, setDescription] = useState(store?.description || '');
  const [logo, setLogo] = useState<string[]>(store?.logo_url ? [store.logo_url] : []);
  const [banner, setBanner] = useState<string[]>(store?.banner_url ? [store.banner_url] : []);
  const [whatsapp, setWhatsapp] = useState(store?.whatsapp || '');
  const [city, setCity] = useState(store?.city || '');
  const [address, setAddress] = useState(store?.address || '');
  const [saving, setSaving] = useState(false);

  const slug = slugify(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      push('Nama toko wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        owner_id: ownerId,
        name: name.trim(),
        slug,
        description,
        logo_url: logo[0] || null,
        banner_url: banner[0] || null,
        whatsapp,
        city,
        address,
      };

      if (isEdit && store) {
        const { error } = await supabase
          .from('stores')
          .update(payload)
          .eq('id', store.id);
        if (error) throw error;
        push('Toko berhasil diperbarui', 'success');
      } else {
        const { data: existing } = await supabase
          .from('stores')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        if (existing) {
          push('Slug toko sudah dipakai, ubah nama toko', 'error');
          setSaving(false);
          return;
        }
        const { data, error } = await supabase
          .from('stores')
          .insert({ ...payload, rating: 5.0 })
          .select()
          .single();
        if (error) throw error;
        push('Toko berhasil dibuat! 🎉', 'success');
      }
      router.refresh();
    } catch (err: any) {
      push(err?.message || 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Kelola Toko' : 'Buat Toko Baru'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? 'Perbarui informasi toko Anda.'
              : 'Lengkapi informasi toko untuk mulai berjualan.'}
          </p>
        </div>
        {isEdit && (
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="btn-outline text-xs"
          >
            Lihat Toko ↗
          </Link>
        )}
      </div>

      {/* Preview link unik */}
      {slug && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <span className="font-medium">Link toko:</span>
          <code className="rounded-lg bg-white px-2 py-0.5 text-brand-600">
            /store/{slug}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kolom kiri */}
        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Nama Toko</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Toko Sehat Jaya"
              required
            />
          </div>
          <div>
            <label className="label">Deskripsi Toko</label>
            <textarea
              className="input min-h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang toko Anda..."
            />
          </div>
          <div>
            <label className="label">Nomor WhatsApp</label>
            <input
              className="input"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Kota</label>
              <input
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta"
              />
            </div>
            <div>
              <label className="label">Kategori Utama</label>
              <select
                className="input"
                value={city}
                onChange={() => {}}
                disabled
              >
                <option>Pilih kategori di produk</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Alamat Lengkap</label>
            <textarea
              className="input min-h-20"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
            />
          </div>
        </div>

        {/* Kolom kanan - upload */}
        <div className="space-y-4">
          <div className="card p-5">
            <ImageUploader
              bucket="stores"
              folder={`store-${slug || 'tmp'}/logo`}
              multiple={false}
              max={1}
              value={logo}
              onChange={setLogo}
              label="Logo Toko"
            />
          </div>
          <div className="card p-5">
            <ImageUploader
              bucket="stores"
              folder={`store-${slug || 'tmp'}/banner`}
              multiple={false}
              max={1}
              value={banner}
              onChange={setBanner}
              label="Banner Toko"
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
            ) : isEdit ? (
              'Simpan Perubahan'
            ) : (
              'Buat Toko'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
