import React, { useState } from 'react';
import { useGetAllOrders } from '../../hooks/useQueries';
import { useUpdateOrderStatus } from '../../hooks/useMutations';
import { OrderStatus } from '../../backend';
import type { Order } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: 'Pending',
  [OrderStatus.confirmed]: 'Confirmed',
  [OrderStatus.shipped]: 'Shipped',
  [OrderStatus.delivered]: 'Delivered',
  [OrderStatus.cancelled]: 'Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  [OrderStatus.pending]: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
  [OrderStatus.confirmed]: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  [OrderStatus.shipped]: { bg: 'rgba(249,115,22,0.15)', text: '#FB923C' },
  [OrderStatus.delivered]: { bg: 'rgba(34,197,94,0.15)', text: '#4ADE80' },
  [OrderStatus.cancelled]: { bg: 'rgba(107,114,128,0.15)', text: '#9CA3AF' },
};

const ALL_STATUSES = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.shipped,
  OrderStatus.delivered,
  OrderStatus.cancelled,
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className="px-2 py-0.5 text-xs font-heading uppercase tracking-wider"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.text}33`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function OrderRow({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus();
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const handleStatusChange = async (status: OrderStatus) => {
    setUpdatingId(order.orderId);
    try {
      await updateStatus.mutateAsync({ orderId: order.orderId, status });
    } finally {
      setUpdatingId(null);
    }
  };

  const isUpdating = updatingId === order.orderId || updateStatus.isPending;

  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <td className="px-4 py-3 font-mono text-xs" style={{ color: '#C9C9C9' }}>
        #{order.orderId.toString()}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: '#C9C9C9' }}>
        Customer {order.customerId.toString()}
      </td>
      <td className="px-4 py-3 text-sm text-center" style={{ color: '#C9C9C9' }}>
        {order.items.length}
      </td>
      <td className="px-4 py-3 text-sm font-heading" style={{ color: '#ffffff' }}>
        ${order.totalAmount.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {formatDate(order.createdAt)}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              disabled={isUpdating}
              className="flex items-center gap-1 px-2 py-1 text-xs font-heading uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#C9C9C9',
                cursor: 'pointer',
              }}
            >
              {isUpdating ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  Update <ChevronDown size={12} />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {ALL_STATUSES.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => handleStatusChange(s)}
                className="text-xs font-heading uppercase tracking-wider cursor-pointer"
                style={{ color: STATUS_COLORS[s].text }}
              >
                {STATUS_LABELS[s]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function OrdersSection() {
  const { data: orders, isLoading, error } = useGetAllOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders =
    filterStatus === 'all'
      ? (orders ?? [])
      : (orders ?? []).filter((o) => o.status === filterStatus);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-heading uppercase tracking-widest mb-1"
          style={{ color: '#ffffff' }}
        >
          Orders
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Manage and update customer orders
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className="px-3 py-1.5 text-xs font-heading uppercase tracking-wider transition-all"
          style={{
            backgroundColor: filterStatus === 'all' ? '#D10000' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${filterStatus === 'all' ? '#D10000' : 'rgba(255,255,255,0.1)'}`,
            color: filterStatus === 'all' ? '#ffffff' : '#C9C9C9',
            cursor: 'pointer',
          }}
        >
          All ({orders?.length ?? 0})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = (orders ?? []).filter((o) => o.status === s).length;
          const isActive = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 text-xs font-heading uppercase tracking-wider transition-all"
              style={{
                backgroundColor: isActive ? STATUS_COLORS[s].bg : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? STATUS_COLORS[s].text : 'rgba(255,255,255,0.1)'}`,
                color: isActive ? STATUS_COLORS[s].text : '#C9C9C9',
                cursor: 'pointer',
              }}
            >
              {STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
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
              <Skeleton key={i} className="h-10 w-full" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: '#D10000' }}>
              Failed to load orders. Make sure you have admin access.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No orders found.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-heading uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <OrderRow key={order.orderId.toString()} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
