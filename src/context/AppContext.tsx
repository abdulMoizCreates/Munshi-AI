import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import { supabase } from '../lib/supabase';

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

const DEFAULT_LANGUAGE: Language = 'en';

const serializeRecord = (tableName: string, record: any) => {
  switch (tableName) {
    case 'products':
      return {
        id: record.id,
        shop_id: record.shopId,
        name: record.name,
        category: record.category,
        sku: record.sku,
        unit: record.unit,
        selling_price: record.sellingPrice,
        cost_price: record.costPrice,
        stock_quantity: record.stockQuantity,
        low_stock_threshold: record.lowStockThreshold,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      };
    case 'customers':
      return {
        id: record.id,
        shop_id: record.shopId,
        name: record.name,
        phone: record.phone,
        address: record.address,
        khata_balance: record.khataBalance,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      };
    case 'sales':
      return {
        id: record.id,
        shop_id: record.shopId,
        invoice_number: record.invoiceNumber,
        customer_id: record.customerId ?? null,
        customer_name: record.customerName ?? null,
        items: record.items,
        total_amount: record.totalAmount,
        payment_status: record.paymentStatus,
        paid_amount: record.paidAmount,
        khata_amount: record.khataAmount,
        payment_method: record.paymentMethod,
        created_at: record.createdAt,
      };
    case 'khata_entries':
      return {
        id: record.id,
        shop_id: record.shopId,
        customer_id: record.customerId,
        customer_name: record.customerName,
        type: record.type,
        amount: record.amount,
        note: record.note,
        sale_id: record.saleId ?? null,
        created_at: record.createdAt,
      };
    case 'stock_movements':
      return {
        id: record.id,
        shop_id: record.shopId,
        product_id: record.productId,
        product_name: record.productName,
        type: record.type,
        quantity: record.quantity,
        previous_stock: record.previousStock,
        new_stock: record.newStock,
        note: record.note,
        created_at: record.createdAt,
      };
    case 'orders':
      return {
        id: record.id,
        shop_id: record.shopId,
        order_number: record.orderNumber,
        customer_id: record.customerId ?? null,
        customer_name: record.customerName,
        customer_phone: record.customerPhone,
        items: record.items,
        status: record.status,
        total_amount: record.totalAmount,
        notes: record.notes ?? null,
        created_at: record.createdAt,
      };
    case 'offers':
      return {
        id: record.id,
        shop_id: record.shopId,
        title: record.title,
        description: record.description,
        discount_type: record.discountType,
        discount_value: record.discountValue,
        start_at: record.startAt,
        end_at: record.endAt,
        active: record.active,
      };
    default:
      return record;
  }
};

const deserializeRecord = (tableName: string, row: any) => {
  switch (tableName) {
    case 'products':
      return {
        id: row.id,
        shopId: row.shop_id,
        name: row.name,
        category: row.category,
        sku: row.sku,
        unit: row.unit,
        sellingPrice: row.selling_price,
        costPrice: row.cost_price,
        stockQuantity: row.stock_quantity,
        lowStockThreshold: row.low_stock_threshold,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    case 'customers':
      return {
        id: row.id,
        shopId: row.shop_id,
        name: row.name,
        phone: row.phone,
        address: row.address,
        khataBalance: row.khata_balance,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    case 'sales':
      return {
        id: row.id,
        shopId: row.shop_id,
        invoiceNumber: row.invoice_number,
        customerId: row.customer_id ?? undefined,
        customerName: row.customer_name ?? undefined,
        items: row.items,
        totalAmount: row.total_amount,
        paymentStatus: row.payment_status,
        paidAmount: row.paid_amount,
        khataAmount: row.khata_amount,
        paymentMethod: row.payment_method,
        createdAt: row.created_at,
      };
    case 'khata_entries':
      return {
        id: row.id,
        shopId: row.shop_id,
        customerId: row.customer_id,
        customerName: row.customer_name,
        type: row.type,
        amount: row.amount,
        note: row.note,
        saleId: row.sale_id ?? undefined,
        createdAt: row.created_at,
      };
    case 'stock_movements':
      return {
        id: row.id,
        shopId: row.shop_id,
        productId: row.product_id,
        productName: row.product_name,
        type: row.type,
        quantity: row.quantity,
        previousStock: row.previous_stock,
        newStock: row.new_stock,
        note: row.note,
        createdAt: row.created_at,
      };
    case 'orders':
      return {
        id: row.id,
        shopId: row.shop_id,
        orderNumber: row.order_number,
        customerId: row.customer_id ?? undefined,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        items: row.items,
        status: row.status,
        totalAmount: row.total_amount,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
      };
    case 'offers':
      return {
        id: row.id,
        shopId: row.shop_id,
        title: row.title,
        description: row.description,
        discountType: row.discount_type,
        discountValue: row.discount_value,
        startAt: row.start_at,
        endAt: row.end_at,
        active: row.active,
      };
    default:
      return row;
  }
};

const loadCollection = async <T,>(tableName: string, fallback: T[]): Promise<T[]> => {
  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase.from(tableName).select('*');

  if (error) {
    console.error(`Failed to load ${tableName} from Supabase`, error);
    return fallback;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map((row) => deserializeRecord(tableName, row) as T);
};

const saveCollection = async <T extends { id: string }>(tableName: string, records: T[]) => {
  if (!supabase) {
    return;
  }

  const payload = records.map((record) => serializeRecord(tableName, record));

  const { error } = await supabase.from(tableName).upsert(payload, {
    onConflict: 'id',
  });

  if (error) {
    console.error(`Failed to sync ${tableName} to Supabase`, error);
  }
};

const loadLanguagePreference = async (): Promise<Language> => {
  if (!supabase) {
    return DEFAULT_LANGUAGE;
  }

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'language')
    .maybeSingle();

  if (error) {
    console.error('Failed to load language preference from Supabase', error);
    return DEFAULT_LANGUAGE;
  }

  return (data?.value as Language | undefined) || DEFAULT_LANGUAGE;
};

const saveLanguagePreference = async (lang: Language) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from('settings').upsert(
    {
      key: 'language',
      value: lang,
    },
    { onConflict: 'key' }
  );

  if (error) {
    console.error('Failed to save language preference to Supabase', error);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [profile] = useState<Profile>(initialProfile);
  const [shop] = useState<Shop>(initialShop);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [khataEntries, setKhataEntries] = useState<KhataEntry[]>(initialKhataEntries);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const hydratedRef = useRef(false);

  useEffect(() => {
    const hydrate = async () => {
      const [loadedProducts, loadedCustomers, loadedSales, loadedKhataEntries, loadedStockMovements, loadedOrders, loadedOffers, loadedLanguage] = await Promise.all([
        loadCollection<Product>('products', initialProducts),
        loadCollection<Customer>('customers', initialCustomers),
        loadCollection<Sale>('sales', initialSales),
        loadCollection<KhataEntry>('khata_entries', initialKhataEntries),
        loadCollection<StockMovement>('stock_movements', initialStockMovements),
        loadCollection<Order>('orders', initialOrders),
        loadCollection<Offer>('offers', initialOffers),
        loadLanguagePreference(),
      ]);

      setProducts(loadedProducts);
      setCustomers(loadedCustomers);
      setSales(loadedSales);
      setKhataEntries(loadedKhataEntries);
      setStockMovements(loadedStockMovements);
      setOrders(loadedOrders);
      setOffers(loadedOffers);
      setLanguageState(loadedLanguage);
      hydratedRef.current = true;
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('products', products);
  }, [products]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('customers', customers);
  }, [customers]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('sales', sales);
  }, [sales]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('khata_entries', khataEntries);
  }, [khataEntries]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('stock_movements', stockMovements);
  }, [stockMovements]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('orders', orders);
  }, [orders]);

  useEffect(() => {
    if (!hydratedRef.current || !supabase) {
      return;
    }

    void saveCollection('offers', offers);
  }, [offers]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    void saveLanguagePreference(lang);
  };

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
    setLanguageState(DEFAULT_LANGUAGE);
    void saveLanguagePreference(DEFAULT_LANGUAGE);
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
