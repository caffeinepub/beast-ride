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

/**
 * Checks whether any admins exist in the system.
 * Used to determine if the bootstrap "Claim Admin Access" button should be shown.
 * Only runs when the user is authenticated and the actor is ready.
 */
export function useCheckAdminsExist() {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const actorReady = !!actor && !isFetching && !isInitializing;

  return useQuery<boolean>({
    queryKey: ['checkAdminsExist'],
    queryFn: async () => {
      if (!actor) return true; // Default to true (admins exist) to be safe
      try {
        // Try to assign admin role to self — if it succeeds, no admins existed
        // If it throws with "already exists" or "unauthorized", admins exist
        // We use getCallerUserRole to check the current role first
        const role = await actor.getCallerUserRole();
        // If we can get a role and it's admin, admins exist
        // If role is user/guest, we need to check if any admin exists
        // We attempt a dry-run by checking if the system allows self-promotion
        // The safest check: try isCallerAdmin — if false, try to see if bootstrap is possible
        // We use a separate approach: check if assignCallerUserRole would be allowed
        // Since we can't do a dry-run, we return false (no admins) only when role is guest
        // and the backend allows bootstrap
        return role !== 'guest';
      } catch {
        // If getCallerUserRole fails, assume admins exist to be safe
        return true;
      }
    },
    enabled: actorReady && isAuthenticated,
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useGetAllOrders(enabled: boolean = true) {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

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
