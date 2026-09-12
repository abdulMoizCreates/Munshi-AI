import { Language } from '../types';

export const formatPKR = (amount: number): string => {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-PK').format(rounded);
  return `Rs. ${formatted}`;
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
};

export const formatTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

export const formatDateTime = (isoString: string): string => {
  return `${formatDate(isoString)} ${formatTime(isoString)}`;
};

export const translations = {
  en: {
    appName: 'Munshi AI',
    appTagline: 'Digital Business Assistant',
    greetingGreeting: 'Good morning',
    greetingSub: "Here's what's happening at your shop today.",
    greetingDesc: 'Keep track of sales, stock and your business performance.',
    searchPlaceholder: 'Search products, customers, invoices (Press /)...',
    
    // Navigation
    navDashboard: 'Dashboard',
    navSales: 'Sales POS',
    navKhata: 'Khata Ledger',
    navProducts: 'Products',
    navInventory: 'Inventory',
    navCustomers: 'Customers',
    navOrders: 'Orders',
    navOffers: 'Offers',
    navReports: 'Reports',
    navSettings: 'Settings & Plan',
    
    // Metrics
    metricTodaySales: "Today's Sales",
    metricMonthSales: 'Monthly Sales',
    metricKhataOutstanding: 'Outstanding Khata',
    metricActiveDebtors: 'debtors with balance',
    metricLowStock: 'Low Stock Items',
    metricNeedsRestock: 'needs restock attention',
    metricOrdersToday: 'Orders Today',
    
    // Quick Actions
    actionNewSale: 'Record Sale',
    actionAddKhataPayment: 'Record Payment',
    actionAddProduct: 'Add Product',
    actionAddCustomer: 'Add Customer',
    actionAdjustStock: 'Adjust Stock',
    actionNewOrder: 'New Order',
    
    // Headers & Labels
    recentSales: 'Recent Sales',
    topProducts: 'Top Selling Products',
    inventoryAlerts: 'Inventory Attention',
    viewAll: 'View All',
    noData: 'No records found',
    filterAll: 'All',
    search: 'Search',
    status: 'Status',
    date: 'Date',
    total: 'Total',
    customer: 'Customer',
    amount: 'Amount',
    action: 'Action',
    price: 'Price',
    stock: 'Stock',
    category: 'Category',
    sku: 'SKU',
    unit: 'Unit',
    subtotal: 'Subtotal',
    discount: 'Discount',
    paid: 'Paid',
    balance: 'Balance',
    notes: 'Notes',
    save: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    printReceipt: 'Print Receipt',
    
    // Khata specific
    khataBaqiRaqam: 'Outstanding Balance',
    khataJama: 'Receive Payment',
    khataUdhaar: 'Add Credit',
    khataHistory: 'Transaction History',
    khataClear: 'Settled / No Balance',
    
    // Sales POS
    cartEmpty: 'No items in cart yet. Select products on the left.',
    checkout: 'Complete Sale',
    paymentMethodCash: 'Cash (Naqad)',
    paymentMethodKhata: 'Add to Khata (Udhaar)',
    paymentMethodDigital: 'Online / EasyPaisa / JazzCash',
    
    // Language switcher
    switchLanguage: 'Language',
  },
  ur: {
    appName: 'Munshi AI',
    appTagline: 'Kiryana Ka Digital Munshi',
    greetingGreeting: 'Assalam-o-Alaikum',
    greetingSub: 'Aaj aapki dukan ki soorat-e-haal yeh hai.',
    greetingDesc: 'Sales, stock aur karobar ki kargardagi par nazar rakhein.',
    searchPlaceholder: 'Product, customer ya bill talash karein...',
    
    // Navigation
    navDashboard: 'Dashboard',
    navSales: 'Sales Counter',
    navKhata: 'Khata',
    navProducts: 'Products',
    navInventory: 'Stock',
    navCustomers: 'Customers',
    navOrders: 'Orders',
    navOffers: 'Offers',
    navReports: 'Reports',
    navSettings: 'Dukan Settings',
    
    // Metrics
    metricTodaySales: 'Aaj Ki Sales',
    metricMonthSales: 'Mahana Sales',
    metricKhataOutstanding: 'Baqi Raqam (Khata)',
    metricActiveDebtors: 'gahak jinki taraf baqi hai',
    metricLowStock: 'Stock Kam Hai',
    metricNeedsRestock: 'items foran mangwayen',
    metricOrdersToday: 'Aaj Ke Orders',
    
    // Quick Actions
    actionNewSale: 'Nayi Sale',
    actionAddKhataPayment: 'Payment Jama Karein',
    actionAddProduct: 'Naya Product',
    actionAddCustomer: 'Naya Customer',
    actionAdjustStock: 'Stock Tabdeel Karein',
    actionNewOrder: 'Naya Order',
    
    // Headers & Labels
    recentSales: 'Haal hi ki Sales',
    topProducts: 'Zyada Bikne Wale Products',
    inventoryAlerts: 'Kam Stock Ki Ittila',
    viewAll: 'Sab Dekhein',
    noData: 'Koi record nahi mila',
    filterAll: 'Sab',
    search: 'Talash',
    status: 'Halat',
    date: 'Tareekh',
    total: 'Kul Raqam',
    customer: 'Gahak / Customer',
    amount: 'Raqam',
    action: 'Amal',
    price: 'Qeemat',
    stock: 'Maujooda Stock',
    category: 'Category',
    sku: 'SKU / Barcode',
    unit: 'Unit (Paimana)',
    subtotal: 'Subtotal',
    discount: 'Reayat / Discount',
    paid: 'Wasool Hui',
    balance: 'Baqi',
    notes: 'Wazahat / Note',
    save: 'Mehfooz Karein',
    cancel: 'Mansookh',
    confirm: 'Tasdeeq Karein',
    delete: 'Khatam Karein',
    edit: 'Durust Karein',
    printReceipt: 'Raseed Print Karein',
    
    // Khata specific
    khataBaqiRaqam: 'Baqi Raqam',
    khataJama: 'Raqam Jama Karein',
    khataUdhaar: 'Udhaar Likhein',
    khataHistory: 'Khata Ki Tareekh',
    khataClear: 'Hisab Saaf Hai',
    
    // Sales POS
    cartEmpty: 'Cart khaali hai. Bayen janib se product chunein.',
    checkout: 'Sale Mukammal Karein',
    paymentMethodCash: 'Naqad (Cash)',
    paymentMethodKhata: 'Khata (Udhaar)',
    paymentMethodDigital: 'EasyPaisa / JazzCash / Bank',
    
    // Language switcher
    switchLanguage: 'Zuban',
  }
};

export const useT = (lang: Language) => {
  return translations[lang] || translations.en;
};
