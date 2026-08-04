'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import type { Product } from '@/lib/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    const load = async () => {
      const all = await fetch('/api/products').then((r) => r.json());
      const p = (all as Product[]).find((x) => x.id === params.id);
      if (p) {
        setProduct(p);
        setForm({ name: p.name, description: p.description, price: String(p.price) });
        setImages(p.images || []);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImages((prev) => [...prev, event.target?.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError('Product name and price are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          images,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update product');
        return;
      }
      router.push('/dashboard/profile');
      router.refresh();
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (!product) return <p className="text-gray-400 text-sm">Product not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/profile" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">Update your product details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Input id="name" label="Product Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <Input id="price" label="Price (NGN)" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Product Images</p>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition-colors">
                <Upload className="w-5 h-5" />
                <span className="text-[10px] mt-1">Upload</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href="/dashboard/profile"><Button type="button" variant="ghost">Cancel</Button></Link>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
