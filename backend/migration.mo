import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";

module {
  type ProductId = Nat;
  type Price = Float;
  type MediaUrl = Text;

  type LegacyProduct = {
    id : ProductId;
    name : Text;
    price : Price;
    image : MediaUrl;
    description : Text;
    category : Text;
  };

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

  type Order = {
    orderId : Nat;
    customerId : Nat;
    items : [OrderItem];
    totalAmount : Price;
    status : OrderStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type OldActor = {
    products : Map.Map<ProductId, LegacyProduct>;
  };

  type NewActor = {
    products : Map.Map<ProductId, Product>;
    categories : Map.Map<Nat, Category>;
    collections : Map.Map<Nat, Collection>;
    orders : Map.Map<Nat, Order>;
    nextProductId : Nat;
    nextCategoryId : Nat;
    nextCollectionId : Nat;
    nextOrderId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let updatedProducts = old.products.map<ProductId, LegacyProduct, Product>(
      func(_id, legacyProduct) {
        {
          legacyProduct with
          inventory = 100;
        };
      }
    );

    let initialCategories = Map.empty<Nat, Category>();
    initialCategories.add(1, { id = 1; name = "Bike Accessories"; slug = "bike-accessories" });
    initialCategories.add(2, { id = 2; name = "Car Performance"; slug = "car-performance" });

    let initialCollections = Map.empty<Nat, Collection>();
    let initialOrders = Map.empty<Nat, Order>();

    {
      products = updatedProducts;
      categories = initialCategories;
      collections = initialCollections;
      orders = initialOrders;
      nextProductId = updatedProducts.size() + 1;
      nextCategoryId = 3;
      nextCollectionId = 1;
      nextOrderId = 1;
    };
  };
};
