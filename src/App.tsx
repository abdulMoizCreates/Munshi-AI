import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SalesView } from './components/SalesView';
import { KhataView } from './components/KhataView';
import { InventoryView } from './components/InventoryView';
import { ProductsView } from './components/ProductsView';
import { CustomersView } from './components/CustomersView';
import { OrdersView } from './components/OrdersView';
import { OffersView } from './components/OffersView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'sales':
        return <SalesView />;
      case 'khata':
        return <KhataView />;
      case 'inventory':
        return <InventoryView />;
      case 'products':
        return <ProductsView />;
      case 'customers':
        return <CustomersView />;
      case 'orders':
        return <OrdersView />;
      case 'offers':
        return <OffersView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          id="main-viewport"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
