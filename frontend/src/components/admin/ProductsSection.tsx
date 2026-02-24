import React, { useState } from 'react';
import { useAllProducts } from '../../hooks/useQueries';
import { useDeleteProduct } from '../../hooks/useMutations';
import type { Product } from '../../backend';
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
import ProductFormModal from './ProductFormModal';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function ProductsSection() {
  const { data: products, isLoading, error } = useAllProducts();
  const deleteProduct = useDeleteProduct();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-heading uppercase tracking-widest mb-1"
            style={{ color: '#ffffff' }}
          >
            Products
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="beast-btn flex items-center gap-2"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
          overflowX: 'auto',
        }}
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: '#D10000' }}>
              Failed to load products.
            </p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No products yet. Add your first product.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Inventory', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-heading uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id.toString()}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td className="px-4 py-3">
                    <div
                      className="w-12 h-12 overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: '#1A1A1A', color: 'rgba(255,255,255,0.2)' }}
                        >
                          N/A
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-heading uppercase" style={{ color: '#ffffff' }}>
                      {product.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 line-clamp-1"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      {product.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 text-xs font-heading uppercase tracking-wider"
                      style={{
                        backgroundColor: 'rgba(209,0,0,0.1)',
                        border: '1px solid rgba(209,0,0,0.3)',
                        color: '#D10000',
                      }}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-heading" style={{ color: '#ffffff' }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#C9C9C9' }}>
                    {product.inventory.toString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="p-1.5 transition-colors"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#C9C9C9',
                          cursor: 'pointer',
                        }}
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1.5 transition-colors"
                            style={{
                              backgroundColor: 'rgba(209,0,0,0.1)',
                              border: '1px solid rgba(209,0,0,0.3)',
                              color: '#D10000',
                              cursor: 'pointer',
                            }}
                            title="Delete"
                          >
                            {deletingId === product.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle
                              className="font-heading uppercase tracking-widest"
                              style={{ color: '#ffffff' }}
                            >
                              Delete Product
                            </AlertDialogTitle>
                            <AlertDialogDescription style={{ color: '#C9C9C9' }}>
                              Are you sure you want to delete "{product.name}"? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#C9C9C9',
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              style={{ backgroundColor: '#D10000', color: '#ffffff' }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <ProductFormModal mode="add" onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {editProduct && (
        <ProductFormModal
          mode="edit"
          initialData={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}
