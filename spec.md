# Specification

## Summary
**Goal:** Add an Admin Dashboard to the Beast Ride app with Order Management, Product Listing Management, and Category/Collection Management, backed by new Motoko backend functions.

**Planned changes:**
- Extend the Motoko backend actor with an `Order` type and functions: `createOrder`, `updateOrderStatus`, `getAllOrders`, `getOrderById`, `getOrdersByStatus`; pre-populate with mock orders
- Extend the Motoko backend actor with product CRUD update functions: `addProduct`, `updateProduct`, `deleteProduct`; add an `inventory` field to the Product type
- Extend the Motoko backend actor with `Category` and `Collection` types and full CRUD functions: `addCategory`, `updateCategory`, `deleteCategory`, `addCollection`, `updateCollection`, `deleteCollection`, `assignProductToCollection`, `removeProductFromCollection`, `getAllCategories`, `getAllCollections`, `getCollectionById`; pre-populate Bike Accessories and Car Performance categories
- Add a `/admin` route in the React frontend, accessible only to Internet Identity authenticated users
- Build a dark sidebar layout matching the Beast Ride design system (#0B0B0B background, red accent #D10000, silver text, uppercase labels) with nav links to Orders, Products, and Categories & Collections sections
- Build the Orders admin section: full-width dark table with columns (Order ID, Customer, Items, Total, Status badge, Created Date), status filter bar, per-row status update dropdown, loading skeleton; connected to backend via React Query
- Build the Products admin section: dark table with image thumbnail, name, category, price, inventory, and Edit/Delete actions; "Add Product" button opens a modal form; confirmation prompt on delete; React Query cache invalidated on mutations
- Build the Categories & Collections admin section: two side-by-side panels (stacked on mobile) for Categories (name, slug, inline add/edit/delete) and Collections (name, description, expandable product list with assign/remove product controls); all mutations invalidate React Query caches

**User-visible outcome:** Authenticated admins can navigate to `/admin` to manage orders (view and update statuses), products (add, edit, delete), and categories/collections (create, edit, delete, assign products) through a fully functional dark-themed dashboard.
