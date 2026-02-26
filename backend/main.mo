import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProductId = Nat;
  type Price = Float;
  type MediaUrl = Text;

  type Product = {
    id : ProductId;
    name : Text;
    price : Price;
    image : MediaUrl;
    description : Text;
    category : Text;
    inventory : Nat;
  };

  type Category = {
    id : Nat;
    name : Text;
    slug : Text;
  };

  type Collection = {
    id : Nat;
    name : Text;
    description : Text;
    productIds : [ProductId];
  };

  type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    price : Price;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  type PaymentMethod = {
    #COD;
    #UPI;
    #Card;
  };

  type Order = {
    orderId : Text;
    customerName : Text;
    mobileNumber : Text;
    email : Text;
    fullAddress : Text;
    city : Text;
    state : Text;
    pincode : Text;
    paymentMethod : PaymentMethod;
    orderStatus : OrderStatus;
    createdAt : Int;
    items : [OrderItem];
    totalAmount : Price;
  };

  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<ProductId, Product>();
  let categories = Map.empty<Nat, Category>();
  let collections = Map.empty<Nat, Collection>();
  let orders = Map.empty<Text, Order>();

  var nextProductId = 2;
  var nextCategoryId = 3;
  var nextCollectionId = 2;
  var nextOrderId = 3;

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management (admin only)
  public shared ({ caller }) func addProduct(
    name : Text,
    price : Price,
    image : MediaUrl,
    description : Text,
    category : Text,
    inventory : Nat,
  ) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let product : Product = {
      id = nextProductId;
      name;
      price;
      image;
      description;
      category;
      inventory;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(
    id : ProductId,
    name : Text,
    price : Price,
    image : MediaUrl,
    description : Text,
    category : Text,
    inventory : Nat,
  ) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist!") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          price;
          image;
          description;
          category;
          inventory;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(id);
  };

  // Category management (admin only)
  public shared ({ caller }) func addCategory(name : Text, slug : Text) : async Category {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let category : Category = {
      id = nextCategoryId;
      name;
      slug;
    };
    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category;
  };

  public shared ({ caller }) func updateCategory(id : Nat, name : Text, slug : Text) : async Category {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?_) {
        let updatedCategory : Category = {
          id;
          name;
          slug;
        };
        categories.add(id, updatedCategory);
        updatedCategory;
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not categories.containsKey(id)) {
      Runtime.trap("Category does not exist");
    };
    categories.remove(id);
  };

  // Collection management (admin only)
  public shared ({ caller }) func addCollection(name : Text, description : Text) : async Collection {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let collection : Collection = {
      id = nextCollectionId;
      name;
      description;
      productIds = [];
    };
    collections.add(nextCollectionId, collection);
    nextCollectionId += 1;
    collection;
  };

  public shared ({ caller }) func updateCollection(id : Nat, name : Text, description : Text) : async Collection {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (collections.get(id)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?existingCollection) {
        let updatedCollection : Collection = {
          id;
          name;
          description;
          productIds = existingCollection.productIds;
        };
        collections.add(id, updatedCollection);
        updatedCollection;
      };
    };
  };

  public shared ({ caller }) func deleteCollection(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not collections.containsKey(id)) {
      Runtime.trap("Collection does not exist");
    };
    collections.remove(id);
  };

  public shared ({ caller }) func assignProductToCollection(
    collectionId : Nat,
    productId : ProductId,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (collections.get(collectionId)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?collection) {
        let updatedProductIds = collection.productIds.concat([productId]);
        let updatedCollection = { collection with productIds = updatedProductIds };
        collections.add(collectionId, updatedCollection);
      };
    };
  };

  public shared ({ caller }) func removeProductFromCollection(
    collectionId : Nat,
    productId : ProductId,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (collections.get(collectionId)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?collection) {
        let updatedProductIds = collection.productIds.filter(func(id) { id != productId });
        let updatedCollection = { collection with productIds = updatedProductIds };
        collections.add(collectionId, updatedCollection);
      };
    };
  };

  // Order management
  public shared ({ caller }) func createOrder(
    customerName : Text,
    mobileNumber : Text,
    email : Text,
    fullAddress : Text,
    city : Text,
    state : Text,
    pincode : Text,
    paymentMethod : PaymentMethod,
    items : [OrderItem],
    totalAmount : Price,
  ) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let orderId = nextOrderId.toText();
    let order : Order = {
      orderId;
      customerName;
      mobileNumber;
      email;
      fullAddress;
      city;
      state;
      pincode;
      paymentMethod;
      orderStatus = #pending;
      createdAt = Time.now();
      items;
      totalAmount;
    };
    orders.add(orderId, order);
    nextOrderId += 1;
    order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = { order with orderStatus = status };
        orders.add(orderId, updatedOrder);
        updatedOrder;
      };
    };
  };

  // Order queries (admin only)
  public query ({ caller }) func getOrderById(orderId : Text) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.get(orderId);
  };

  public shared ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let matchingOrdersIter = orders.values().filter(
      func(order) { order.orderStatus == status }
    );
    matchingOrdersIter.toArray();
  };

  // Product queries (public)
  public query func fetchProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist!") };
      case (?product) { product };
    };
  };

  public query func filterByCategory(category : Text) : async [Product] {
    let productsIter = products.values();
    let filteredIter = productsIter.filter(
      func(product) {
        product.category == category;
      }
    );
    filteredIter.toArray();
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Category and collection queries (public)
  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  public query func getAllCollections() : async [Collection] {
    collections.values().toArray();
  };

  public query func getCollectionById(id : Nat) : async ?Collection {
    collections.get(id);
  };
};
