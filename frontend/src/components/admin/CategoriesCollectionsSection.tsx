import React, { useState } from 'react';
import { useGetAllCategories, useGetAllCollections, useAllProducts } from '../../hooks/useQueries';
import {
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
  useAddCollection,
  useUpdateCollection,
  useDeleteCollection,
  useAssignProductToCollection,
  useRemoveProductFromCollection,
} from '../../hooks/useMutations';
import type { Category, Collection, Product } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';

// ─── Category Panel ───────────────────────────────────────────────────────────

function CategoryPanel() {
  const { data: categories, isLoading } = useGetAllCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormError('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormError('');
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      setFormError('Name and slug are required');
      return;
    }
    try {
      if (editingId !== null) {
        await updateCategory.mutateAsync({ id: editingId, name: formName.trim(), slug: formSlug.trim() });
      } else {
        await addCategory.mutateAsync({ name: formName.trim(), slug: formSlug.trim() });
      }
      resetForm();
    } catch {
      setFormError('Operation failed. Check admin access.');
    }
  };

  const handleDelete = async (id: bigint) => {
    await deleteCategory.mutateAsync(id);
  };

  const isSubmitting = addCategory.isPending || updateCategory.isPending;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#0B0B0B',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: '0.45rem 0.65rem',
    fontSize: '0.8rem',
    outline: 'none',
    fontFamily: "'Barlow', sans-serif",
  };

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.06)',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2
          className="text-lg font-heading uppercase tracking-widest"
          style={{ color: '#ffffff' }}
        >
          Categories
        </h2>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setFormName(''); setFormSlug(''); setFormError(''); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-heading uppercase tracking-wider"
          style={{
            backgroundColor: '#D10000',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId !== null) && (
        <form
          onSubmit={handleSubmit}
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0D0D0D' }}
        >
          <p className="text-xs font-heading uppercase tracking-widest mb-3" style={{ color: '#D10000' }}>
            {editingId !== null ? 'Edit Category' : 'New Category'}
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Category name"
              style={inputStyle}
            />
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="category-slug"
              style={inputStyle}
            />
          </div>
          {formError && <p className="text-xs mt-2" style={{ color: '#D10000' }}>{formError}</p>}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-1.5 text-xs font-heading uppercase tracking-wider"
              style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-1.5 text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1"
              style={{ backgroundColor: '#D10000', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <p className="p-5 text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No categories yet.
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id.toString()}
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div>
                <p className="text-sm font-heading uppercase" style={{ color: '#ffffff' }}>
                  {cat.name}
                </p>
                <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  /{cat.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9', cursor: 'pointer' }}
                >
                  <Pencil size={12} />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-1.5"
                      style={{ backgroundColor: 'rgba(209,0,0,0.1)', border: '1px solid rgba(209,0,0,0.3)', color: '#D10000', cursor: 'pointer' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-heading uppercase tracking-widest" style={{ color: '#ffffff' }}>
                        Delete Category
                      </AlertDialogTitle>
                      <AlertDialogDescription style={{ color: '#C9C9C9' }}>
                        Delete "{cat.name}"? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9' }}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(cat.id)} style={{ backgroundColor: '#D10000', color: '#ffffff' }}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Collection Panel ─────────────────────────────────────────────────────────

function CollectionPanel() {
  const { data: collections, isLoading } = useGetAllCollections();
  const { data: allProducts } = useAllProducts();
  const addCollection = useAddCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const assignProduct = useAssignProductToCollection();
  const removeProduct = useRemoveProductFromCollection();

  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [assigningId, setAssigningId] = useState<bigint | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormError('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const startEdit = (col: Collection) => {
    setEditingId(col.id);
    setFormName(col.name);
    setFormDesc(col.description);
    setFormError('');
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Name is required');
      return;
    }
    try {
      if (editingId !== null) {
        await updateCollection.mutateAsync({ id: editingId, name: formName.trim(), description: formDesc.trim() });
      } else {
        await addCollection.mutateAsync({ name: formName.trim(), description: formDesc.trim() });
      }
      resetForm();
    } catch {
      setFormError('Operation failed. Check admin access.');
    }
  };

  const handleDelete = async (id: bigint) => {
    await deleteCollection.mutateAsync(id);
    if (expandedId === id) setExpandedId(null);
  };

  const handleAssign = async (collectionId: bigint) => {
    if (!selectedProductId) return;
    setAssigningId(collectionId);
    try {
      await assignProduct.mutateAsync({ collectionId, productId: BigInt(selectedProductId) });
      setSelectedProductId('');
    } finally {
      setAssigningId(null);
    }
  };

  const handleRemove = async (collectionId: bigint, productId: bigint) => {
    await removeProduct.mutateAsync({ collectionId, productId });
  };

  const getProductById = (id: bigint): Product | undefined =>
    allProducts?.find((p) => p.id === id);

  const isSubmitting = addCollection.isPending || updateCollection.isPending;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#0B0B0B',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: '0.45rem 0.65rem',
    fontSize: '0.8rem',
    outline: 'none',
    fontFamily: "'Barlow', sans-serif",
  };

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.06)',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2
          className="text-lg font-heading uppercase tracking-widest"
          style={{ color: '#ffffff' }}
        >
          Collections
        </h2>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setFormName(''); setFormDesc(''); setFormError(''); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-heading uppercase tracking-wider"
          style={{ backgroundColor: '#D10000', border: 'none', color: '#ffffff', cursor: 'pointer' }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId !== null) && (
        <form
          onSubmit={handleSubmit}
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0D0D0D' }}
        >
          <p className="text-xs font-heading uppercase tracking-widest mb-3" style={{ color: '#D10000' }}>
            {editingId !== null ? 'Edit Collection' : 'New Collection'}
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Collection name"
              style={inputStyle}
            />
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          {formError && <p className="text-xs mt-2" style={{ color: '#D10000' }}>{formError}</p>}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-1.5 text-xs font-heading uppercase tracking-wider"
              style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-1.5 text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1"
              style={{ backgroundColor: '#D10000', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div>
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : !collections || collections.length === 0 ? (
          <p className="p-5 text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No collections yet.
          </p>
        ) : (
          collections.map((col) => {
            const isExpanded = expandedId === col.id;
            return (
              <div
                key={col.id.toString()}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                {/* Collection Row */}
                <div className="flex items-center justify-between px-5 py-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : col.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ color: isExpanded ? '#D10000' : '#C9C9C9' }}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                    <div>
                      <p className="text-sm font-heading uppercase" style={{ color: '#ffffff' }}>
                        {col.name}
                      </p>
                      {col.description && (
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {col.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="ml-2 px-1.5 py-0.5 text-xs font-heading"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      {col.productIds.length}
                    </span>
                  </button>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => startEdit(col)}
                      className="p-1.5"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9', cursor: 'pointer' }}
                    >
                      <Pencil size={12} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-1.5"
                          style={{ backgroundColor: 'rgba(209,0,0,0.1)', border: '1px solid rgba(209,0,0,0.3)', color: '#D10000', cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading uppercase tracking-widest" style={{ color: '#ffffff' }}>
                            Delete Collection
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ color: '#C9C9C9' }}>
                            Delete "{col.name}"? This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#C9C9C9' }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(col.id)} style={{ backgroundColor: '#D10000', color: '#ffffff' }}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Expanded: Products */}
                {isExpanded && (
                  <div
                    className="px-5 pb-4"
                    style={{ backgroundColor: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {/* Assigned Products */}
                    <p className="text-xs font-heading uppercase tracking-widest pt-3 mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Assigned Products
                    </p>
                    {col.productIds.length === 0 ? (
                      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        No products assigned.
                      </p>
                    ) : (
                      <div className="space-y-1.5 mb-3">
                        {col.productIds.map((pid) => {
                          const product = getProductById(pid);
                          return (
                            <div
                              key={pid.toString()}
                              className="flex items-center justify-between px-3 py-2"
                              style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                              <div className="flex items-center gap-2">
                                {product?.image && (
                                  <img
                                    src={product.image}
                                    alt={product?.name}
                                    className="w-8 h-8 object-cover"
                                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                  />
                                )}
                                <span className="text-xs font-heading uppercase" style={{ color: '#C9C9C9' }}>
                                  {product?.name ?? `Product #${pid.toString()}`}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemove(col.id, pid)}
                                className="p-1"
                                style={{ background: 'none', border: 'none', color: 'rgba(209,0,0,0.6)', cursor: 'pointer' }}
                                title="Remove from collection"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Assign Product */}
                    <p className="text-xs font-heading uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Assign Product
                    </p>
                    <div className="flex gap-2">
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        style={{
                          flex: 1,
                          backgroundColor: '#0B0B0B',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: selectedProductId ? '#ffffff' : 'rgba(255,255,255,0.3)',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.75rem',
                          outline: 'none',
                          cursor: 'pointer',
                          fontFamily: "'Barlow', sans-serif",
                        }}
                      >
                        <option value="">Select a product...</option>
                        {allProducts
                          ?.filter((p) => !col.productIds.includes(p.id))
                          .map((p) => (
                            <option key={p.id.toString()} value={p.id.toString()}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => handleAssign(col.id)}
                        disabled={!selectedProductId || assigningId === col.id}
                        className="px-3 py-1.5 text-xs font-heading uppercase tracking-wider flex items-center gap-1"
                        style={{
                          backgroundColor: selectedProductId ? '#D10000' : 'rgba(255,255,255,0.05)',
                          border: 'none',
                          color: selectedProductId ? '#ffffff' : 'rgba(255,255,255,0.3)',
                          cursor: selectedProductId ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {assigningId === col.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function CategoriesCollectionsSection() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-heading uppercase tracking-widest mb-1"
          style={{ color: '#ffffff' }}
        >
          Categories & Collections
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Organize your products into categories and curated collections
        </p>
      </div>

      {/* Two panels */}
      <div className="flex flex-col lg:flex-row gap-6">
        <CategoryPanel />
        <CollectionPanel />
      </div>
    </div>
  );
}
