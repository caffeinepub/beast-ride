import React, { useState } from 'react';
import type { Product } from '../../backend';
import { useGetAllCategories } from '../../hooks/useQueries';
import { useAddProduct, useUpdateProduct } from '../../hooks/useMutations';
import { X, Loader2 } from 'lucide-react';

interface Props {
  mode: 'add' | 'edit';
  initialData?: Product;
  onClose: () => void;
}

export default function ProductFormModal({ mode, initialData, onClose }: Props) {
  const { data: categories } = useGetAllCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState(initialData?.name ?? '');
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [inventory, setInventory] = useState(initialData?.inventory?.toString() ?? '100');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLoading = addProduct.isPending || updateProduct.isPending;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = 'Valid price is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (mode === 'add') {
        await addProduct.mutateAsync({
          name: name.trim(),
          price: Number(price),
          image: image.trim(),
          description: description.trim(),
          category: category.trim(),
          inventory: BigInt(Math.max(0, parseInt(inventory) || 0)),
        });
      } else if (initialData) {
        await updateProduct.mutateAsync({
          id: initialData.id,
          name: name.trim(),
          price: Number(price),
          image: image.trim(),
          description: description.trim(),
          category: category.trim(),
          inventory: BigInt(Math.max(0, parseInt(inventory) || 0)),
        });
      }
      onClose();
    } catch (err) {
      // error handled by mutation
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#0B0B0B',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: "'Barlow', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.35rem',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2
            className="text-xl font-heading uppercase tracking-widest"
            style={{ color: '#ffffff' }}
          >
            {mode === 'add' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#C9C9C9', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Carbon Fiber Helmet"
              style={inputStyle}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: '#D10000' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Price + Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Price ($) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={inputStyle}
              />
              {errors.price && (
                <p className="text-xs mt-1" style={{ color: '#D10000' }}>
                  {errors.price}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Inventory</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="100"
                min="0"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat.id.toString()} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-xs mt-1" style={{ color: '#D10000' }}>
                {errors.category}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label style={labelStyle}>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Error from mutation */}
          {(addProduct.isError || updateProduct.isError) && (
            <p className="text-xs" style={{ color: '#D10000' }}>
              Operation failed. Make sure you have admin access.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-heading uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#C9C9C9',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 beast-btn flex items-center justify-center gap-2"
              style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : mode === 'add' ? (
                'Add Product'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
