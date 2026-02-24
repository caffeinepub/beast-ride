import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
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

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useGetOrdersByStatus(status: OrderStatus | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'status', status],
    queryFn: async () => {
      if (!actor || status === null) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !isFetching && status !== null,
    staleTime: 0,
  });
}
