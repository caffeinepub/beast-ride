import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, Category, Collection, Order } from '../backend';
import { OrderStatus } from '../backend';

export function useAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error('No actor or id');
      return actor.fetchProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategory(category: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAllCollections() {
  const { actor, isFetching } = useActor();

  return useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCollections();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetCollectionById(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Collection | null>({
    queryKey: ['collection', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCollectionById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Checks whether the currently authenticated caller is an admin.
 * Only runs when the user is authenticated and the actor is ready.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const actorReady = !!actor && !isFetching && !isInitializing;

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: actorReady && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useGetAllOrders(enabled: boolean = true) {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  // Only run when:
  // 1. Identity is fully initialized (not still loading stored session)
  // 2. User is authenticated (has an identity — anonymous actor cannot call admin methods)
  // 3. Actor is ready and not currently being recreated
  // 4. Caller has been confirmed as admin (passed via `enabled` prop)
  const isAuthenticated = !!identity;
  const actorReady = !!actor && !isFetching && !isInitializing;

  return useQuery<Order[]>({
    queryKey: ['orders', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllOrders();
    },
    enabled: actorReady && isAuthenticated && enabled,
    staleTime: 0,
    // Do not retry on authorization errors — they won't resolve on retry
    retry: (failureCount, error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useGetOrdersByStatus(status: OrderStatus | null) {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const actorReady = !!actor && !isFetching && !isInitializing;

  return useQuery<Order[]>({
    queryKey: ['orders', 'status', status, identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || status === null) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: actorReady && isAuthenticated && status !== null,
    staleTime: 0,
    retry: (failureCount, error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
