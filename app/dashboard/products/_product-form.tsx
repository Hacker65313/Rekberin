'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { useToast } from '@/components/Toast';
import type { Product } from '@/lib/types';

const CATEGORIES = [
  'Fashion', 'Elektronik', 'Makanan', 'Kesehatan', 'Olahraga',
  'Hobi', 'Otomotif', 'Rumah', 'Kecantikan', 'Lainnya',
];

export default function ProductForm({
  storeId,
  storeSlug,
  product,
}: {
  storeId: string;
  storeSlug: string;
  product: Product | null;
}) {
  const isEdit = !!product;
  const router = useRouter();
  const { push } = useToast();

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [weight, setWeight] = useState(product ? String(product.weight) : '');
  const [category, setCategory] = useState(product?.category || 'Fashion');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return push('Nama produk wajib diisi', 'error');
    if (!price || Number(price) < 0) return push('Harga tidak valid', 'error');
    if (!images.length) return push('Minimal 1 foto produk', 'error');

    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        store_id: storeId,
        name: name.trim(),
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        weight: Number(weight) || 0,
        category,
        images,
      };
      if (isEdit && product) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);
        if (error) throw error;
        push('Produk diperbarui', 'success');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        push('Produk ditambahkan! 🎉', 'success');
      }
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      push(err?.message || 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/products" className="btn-ghost px-3 py-2 text-sm">
          ← Kembali
        </Link>
      </div>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="card space-y-4 p-5">
          <ImageUploader
            bucket="products"
            folder={`store-${storeSlug}/${Date.now()}`}
            multiple
            max={6}
            value={images}
            onChange={setImages}
            label="Foto Produk (maks 6)"
          />
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Nama Produk</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kaos Premium Cotton"
              required
            />
          </div>
          <div>
            <label className="label">Deskripsi Produk</label>
            <textarea
              className="input min-h-28"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail produk, ukuran, bahan, kondisi, dll."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Harga (Rp)</label>
              <input
                type="number"
                min="0"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50000"
                required
              />
            </div>
            <div>
              <label className="label">Stok</label>
              <input
                type="number"
                min="0"
                className="input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <label className="label">Berat (gram)</label>
              <input
                type="number"
                min="0"
                className="input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="250"
              />
            </div>
            <div>
              <label className="label">Kategori</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className={cn('btn-primary flex-1', saving && 'opacity-60')}
          >
            {saving ? (
              <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              </svg>
            ) : isEdit ? (
              'Simpan Perubahan'
            ) : (
              'Tambah Produk'
            )}
          </button>
          <Link href="/dashboard/products" className="btn-outline">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
