import React, { useState } from 'react';
import { useGetAllOrders } from '../../hooks/useQueries';
import { useUpdateOrderStatus } from '../../hooks/useMutations';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { OrderStatus, PaymentMethod } from '../../backend';
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

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'COD',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.Card]: 'Card',
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
      className="px-2 py-0.5 text-xs font-heading uppercase tracking-wider whitespace-nowrap"
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

function formatDateTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function OrderRow({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: OrderStatus) => {
    setIsUpdating(true);
    try {
      await updateStatus.mutateAsync({ orderId: order.orderId, status });
    } finally {
      setIsUpdating(false);
    }
  };

  const fullAddress = [order.fullAddress, order.city, order.state, order.pincode]
    .filter(Boolean)
    .join(', ');

  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Order ID */}
      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: '#D10000' }}>
        #{order.orderId}
      </td>

      {/* Customer Name */}
      <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: '#ffffff' }}>
        {order.customerName || '—'}
      </td>

      {/* Mobile */}
      <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: '#C9C9C9' }}>
        {order.mobileNumber || '—'}
      </td>

      {/* Address */}
      <td
        className="px-4 py-3 text-xs"
        style={{ color: 'rgba(201,201,201,0.7)', maxWidth: '180px' }}
      >
        <span className="line-clamp-2">{fullAddress || '—'}</span>
      </td>

      {/* Products */}
      <td className="px-4 py-3 text-xs" style={{ color: '#C9C9C9', maxWidth: '160px' }}>
        <ul className="space-y-0.5">
          {order.items.map((item, idx) => (
            <li key={idx} className="whitespace-nowrap">
              <span style={{ color: 'rgba(201,201,201,0.5)' }}>×{item.quantity.toString()}</span>{' '}
              Product #{item.productId.toString()}
            </li>
          ))}
        </ul>
      </td>

      {/* Payment Method */}
      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#C9C9C9' }}>
        <span
          className="px-2 py-0.5 font-heading uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {PAYMENT_LABELS[order.paymentMethod] ?? String(order.paymentMethod)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={order.orderStatus} />
      </td>

      {/* Date & Time */}
      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {formatDateTime(order.createdAt)}
      </td>

      {/* Action */}
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
                minHeight: '32px',
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
  const { isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: orders, isLoading, error } = useGetAllOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  // Show loading while identity is initializing or actor is being set up with identity
  const isSettingUp = isInitializing || actorFetching || (!orders && !error && !!identity);

  const filteredOrders =
    filterStatus === 'all'
      ? (orders ?? [])
      : (orders ?? []).filter((o) => o.orderStatus === filterStatus);

  // Determine if the error is an authorization error
  const isAuthError =
    error &&
    (error.message?.includes('Unauthorized') || error.message?.includes('admin'));

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
          const count = (orders ?? []).filter((o) => o.orderStatus === s).length;
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
        {isLoading || isSettingUp ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: '#D10000' }}>
              {isAuthError
                ? 'Access denied. Your account does not have admin privileges.'
                : 'Failed to load orders. Please try refreshing the page.'}
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
                {[
                  'Order ID',
                  'Customer',
                  'Mobile',
                  'Address',
                  'Products',
                  'Payment',
                  'Status',
                  'Date & Time',
                  'Action',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-heading uppercase tracking-widest whitespace-nowrap"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <OrderRow key={order.orderId} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
