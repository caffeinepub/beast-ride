import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: bigint;
    name: string;
    slug: string;
}
export type Time = bigint;
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
    price: Price;
}
export type MediaUrl = string;
export interface Order {
    status: OrderStatus;
    createdAt: Time;
    orderId: bigint;
    updatedAt: Time;
    totalAmount: Price;
    customerId: bigint;
    items: Array<OrderItem>;
}
export type Price = number;
export interface Collection {
    id: bigint;
    productIds: Array<ProductId>;
    name: string;
    description: string;
}
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    inventory: bigint;
    name: string;
    description: string;
    category: string;
    image: MediaUrl;
    price: Price;
}
export interface UserProfile {
    name: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string, slug: string): Promise<Category>;
    addCollection(name: string, description: string): Promise<Collection>;
    addProduct(name: string, price: Price, image: MediaUrl, description: string, category: string, inventory: bigint): Promise<Product>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignProductToCollection(collectionId: bigint, productId: ProductId): Promise<void>;
    createOrder(customerId: bigint, items: Array<OrderItem>, totalAmount: Price): Promise<Order>;
    deleteCategory(id: bigint): Promise<void>;
    deleteCollection(id: bigint): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    fetchProduct(id: ProductId): Promise<Product>;
    filterByCategory(category: string): Promise<Array<Product>>;
    getAllCategories(): Promise<Array<Category>>;
    getAllCollections(): Promise<Array<Collection>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollectionById(id: bigint): Promise<Collection | null>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeProductFromCollection(collectionId: bigint, productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: bigint, name: string, slug: string): Promise<Category>;
    updateCollection(id: bigint, name: string, description: string): Promise<Collection>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<Order>;
    updateProduct(id: ProductId, name: string, price: Price, image: MediaUrl, description: string, category: string, inventory: bigint): Promise<Product>;
}
