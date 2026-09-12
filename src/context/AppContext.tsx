import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ViewType,
  Product,
  Customer,
  Sale,
  KhataEntry,
  StockMovement,
  Order,
  Offer,
  Profile,
  Shop,
} from '../types';
import {
  initialProfile,
  initialShop,
  initialProducts,
  initialCustomers,
  initialSales,
  initialKhataEntries,
  initialStockMovements,
  initialOrders,
  initialOffers,
} from '../data/initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  profile: Profile;
  shop: Shop;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  khataEntries: KhataEntry[];
  stockMovements: StockMovement[];
  orders: Order[];
  offers: Offer[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Actions
  recordSale: (data: {
    customerId?: string;
    customerName?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'cash' | 'khata' | 'digital';
  }) => Sale;
  
  addKhataPayment: (customerId: string, amount: number, note: string) => void;
  addKhataCredit: (customerId: string, amount: number, note: string) => void;
  addProduct: (data: Omit<Product, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  adjustStock: (
    productId: string,
    type: 'restock' | 'damage' | 'adjustment',
    quantityChange: number,
    note: string
  ) => void;
  addCustomer: (data: Omit<Customer, 'id' | 'shopId' | 'createdAt' | 'updatedAt' | 'khataBalance'>) => Customer;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  createOrder: (data: Omit<Order, 'id' | 'shopId' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOffer: (data: Omit<Offer, 'id' | 'shopId'>) => Offer;
  toggleOfferActive: (offerId: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'munshi_lang',
  PRODUCTS: 'munshi_products_v1',
  CUSTOMERS: 'munshi_customers_v1',
  SALES: 'munshi_sales_v1',
  KHATA: 'munshi_khata_v1',
  STOCK: 'munshi_stock_v1',
  ORDERS: 'munshi_orders_v1',
  OFFERS: 'munshi_offers_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [profile] = useState<Profile>(initialProfile);
  const [shop] = useState<Shop>(initialShop);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [khataEntries, setKhataEntries] = useState<KhataEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KHATA);
    return saved ? JSON.parse(saved) : initialKhataEntries;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    return saved ? JSON.parse(saved) : initialOffers;
  });

  // Sync to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KHATA, JSON.stringify(khataEntries));
  }, [khataEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  // Record Sale and update stock & khata automatically
  const recordSale = (data: {
    customerId?: string;
    customerName?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'cash' | 'khata' | 'digital';
  }): Sale => {
    const now = new Date().toISOString();
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Build sale items and calculate total
    let totalAmount = 0;
    const saleItems = data.items.map((item, idx) => {
      const prod = products.find((p) => p.id === item.productId);
      const unitPrice = prod ? prod.sellingPrice : 0;
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;
      return {
        id: `si_${Date.now()}_${idx}`,
        saleId: invoiceNumber,
        productId: item.productId,
        productName: prod ? prod.name : 'Unknown Product',
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const isKhata = data.paymentMethod === 'khata';
    const paidAmount = isKhata ? 0 : totalAmount;
    const khataAmount = isKhata ? totalAmount : 0;

    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      shopId: shop.id,
      invoiceNumber,
      customerId: data.customerId,
      customerName: data.customerName || (data.customerId ? customers.find((c) => c.id === data.customerId)?.name : 'Cash Customer'),
      items: saleItems,
      totalAmount,
      paymentStatus: isKhata ? 'khata' : 'paid',
      paidAmount,
      khataAmount,
      paymentMethod: data.paymentMethod,
      createdAt: now,
    };

    // Update Products stock & log stock movements
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = data.items.find((ci) => ci.productId === p.id);
        if (!cartItem) return p;
        const newQty = Math.max(0, p.stockQuantity - cartItem.quantity);
        return {
          ...p,
          stockQuantity: newQty,
          updatedAt: now,
        };
      })
    );

    const newMovements: StockMovement[] = data.items.map((ci) => {
      const prod = products.find((p) => p.id === ci.productId);
      const prevStock = prod ? prod.stockQuantity : 0;
      return {
        id: `sm_${Date.now()}_${ci.productId}`,
        shopId: shop.id,
        productId: ci.productId,
        productName: prod ? prod.name : '',
        type: 'sale',
        quantity: -ci.quantity,
        previousStock: prevStock,
        newStock: Math.max(0, prevStock - ci.quantity),
        note: `Sold on ${invoiceNumber}`,
        createdAt: now,
      };
    });
    setStockMovements((prev) => [...newMovements, ...prev]);

    // If Khata payment, add khata entry and update customer balance
    if (isKhata && data.customerId) {
      const targetCustomer = customers.find((c) => c.id === data.customerId);
      const customerName = targetCustomer ? targetCustomer.name : 'Customer';

      const newKhata: KhataEntry = {
        id: `k_${Date.now()}`,
        shopId: shop.id,
        customerId: data.customerId,
        customerName,
        type: 'credit',
        amount: totalAmount,
        note: `Bill #${invoiceNumber}`,
        saleId: newSale.id,
        createdAt: now,
      };
      setKhataEntries((prev) => [newKhata, ...prev]);

      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === data.customerId) {
            return {
              ...c,
              khataBalance: c.khataBalance + totalAmount,
              updatedAt: now,
            };
          }
          return c;
        })
      );
    }

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  // Add Khata cash payment (wasooli / jama)
  const addKhataPayment = (customerId: string, amount: number, note: string) => {
    const now = new Date().toISOString();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const newEntry: KhataEntry = {
      id: `k_${Date.now()}`,
      shopId: shop.id,
      customerId,
      customerName: customer.name,
      type: 'payment',
      amount,
      note: note || 'Cash received at shop',
      createdAt: now,
    };

    setKhataEntries((prev) => [newEntry, ...prev]);
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            khataBalance: Math.max(0, c.khataBalance - amount),
            updatedAt: now,
          };
        }
        return c;
      })
    );
  };

  // Add manual Khata credit (udhaar entry)
  const addKhataCredit = (customerId: string, amount: number, note: string) => {
    const now = new Date().toISOString();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const newEntry: KhataEntry = {
      id: `k_${Date.now()}`,
      shopId: shop.id,
      customerId,
      customerName: customer.name,
      type: 'credit',
      amount,
      note: note || 'Manual udhaar entry',
      createdAt: now,
    };

    setKhataEntries((prev) => [newEntry, ...prev]);
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            khataBalance: c.khataBalance + amount,
            updatedAt: now,
          };
        }
        return c;
      })
    );
  };

  const addProduct = (data: Omit<Product, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>): Product => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `prod_${Date.now()}`,
      shopId: shop.id,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates, updatedAt: now } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const adjustStock = (
    productId: string,
    type: 'restock' | 'damage' | 'adjustment',
    quantityChange: number,
    note: string
  ) => {
    const now = new Date().toISOString();
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const previousStock = prod.stockQuantity;
    const newStock = Math.max(0, previousStock + quantityChange);

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newStock, updatedAt: now } : p))
    );

    const movement: StockMovement = {
      id: `sm_${Date.now()}`,
      shopId: shop.id,
      productId,
      productName: prod.name,
      type,
      quantity: quantityChange,
      previousStock,
      newStock,
      note,
      createdAt: now,
    };

    setStockMovements((prev) => [movement, ...prev]);
  };

  const addCustomer = (
    data: Omit<Customer, 'id' | 'shopId' | 'createdAt' | 'updatedAt' | 'khataBalance'>
  ): Customer => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...data,
      id: `cust_${Date.now()}`,
      shopId: shop.id,
      khataBalance: 0,
      createdAt: now,
      updatedAt: now,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    const now = new Date().toISOString();
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates, updatedAt: now } : c))
    );
  };

  const createOrder = (data: Omit<Order, 'id' | 'shopId' | 'orderNumber' | 'createdAt'>): Order => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...data,
      id: `ord_${Date.now()}`,
      shopId: shop.id,
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: now,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const addOffer = (data: Omit<Offer, 'id' | 'shopId'>): Offer => {
    const newOffer: Offer = {
      ...data,
      id: `off_${Date.now()}`,
      shopId: shop.id,
    };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const toggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, active: !o.active } : o))
    );
  };

  const resetToDemoData = () => {
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setKhataEntries(initialKhataEntries);
    setStockMovements(initialStockMovements);
    setOrders(initialOrders);
    setOffers(initialOffers);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.KHATA);
    localStorage.removeItem(STORAGE_KEYS.STOCK);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.OFFERS);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentView,
        setCurrentView,
        profile,
        shop,
        products,
        customers,
        sales,
        khataEntries,
        stockMovements,
        orders,
        offers,
        searchQuery,
        setSearchQuery,
        recordSale,
        addKhataPayment,
        addKhataCredit,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCustomer,
        updateCustomer,
        createOrder,
        updateOrderStatus,
        addOffer,
        toggleOfferActive,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
