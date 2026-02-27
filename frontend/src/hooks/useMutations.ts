import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderItem } from '../backend';
import { OrderStatus, PaymentMethod } from '../backend';

export function useClaimAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.claimAdmin();
    },
    onSuccess: () => {
      // Invalidate admin status and existence checks so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['checkAdminsExist'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      price,
      image,
      description,
      category,
      inventory,
    }: {
      name: string;
      price: number;
      image: string;
      description: string;
      category: string;
      inventory: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(name, price, image, description, category, inventory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      image,
      description,
      category,
      inventory,
    }: {
      id: bigint;
      name: string;
      price: number;
      image: string;
      description: string;
      category: string;
      inventory: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, name, price, image, description, category, inventory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCategory(name, slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, slug }: { id: bigint; name: string; slug: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCategory(id, name, slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useAddCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCollection(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: bigint;
      name: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCollection(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useDeleteCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCollection(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useAssignProductToCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      productId,
    }: {
      collectionId: bigint;
      productId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignProductToCollection(collectionId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useRemoveProductFromCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      productId,
    }: {
      collectionId: bigint;
      productId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeProductFromCollection(collectionId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerName,
      mobileNumber,
      email,
      fullAddress,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      totalAmount,
    }: {
      customerName: string;
      mobileNumber: string;
      email: string;
      fullAddress: string;
      city: string;
      state: string;
      pincode: string;
      paymentMethod: PaymentMethod;
      items: OrderItem[];
      totalAmount: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(
        customerName,
        mobileNumber,
        email,
        fullAddress,
        city,
        state,
        pincode,
        paymentMethod,
        items,
        totalAmount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
