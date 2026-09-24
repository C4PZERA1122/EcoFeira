import React, { useState } from 'react';
import { Vendor, Product, ReservationOrder, OrderStatus } from '../../types';
import { DemandForecastTable } from './DemandForecastTable';
import { OrderManager } from './OrderManager';
import { ProductManager } from './ProductManager';
import {
  TrendingUp,
  Sprout,
  DollarSign,
  CloudRain,
  Store,
  Truck,
  PackageCheck,
  Tag,
  WifiOff,
  CheckCircle2,
  FileText,
  Printer,
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface FarmerDashboardProps {
  vendors: Vendor[];
  activeVendorId: string;
  onSelectVendor: (vendorId: string) => void;
  products: Product[];
  orders: ReservationOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateProduct: (product: Product) => void;
  isOnline: boolean;
  activeTab?: 'forecast' | 'orders' | 'products';
  onTabChange?: (tab: 'forecast' | 'orders' | 'products') => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  vendors,
  activeVendorId,
  onSelectVendor,
  products,
  orders,
  onUpdateOrderStatus,
  onUpdateProduct,
  isOnline,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'forecast' | 'orders' | 'products'>('forecast');
  const activeTab = controlledTab ?? internalTab;

  const setActiveTab = (tab: 'forecast' | 'orders' | 'products') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === activeVendor.id);
  const vendorOrders = orders.filter((o) => o.vendorId === activeVendor.id);

  // Compute real-time stall impact metrics
  const impact = storageService.calculateImpact(activeVendor.id);

  const pendingSeparationCount = vendorOrders.filter((o) => o.status === 'pendente').length;
  const readyPickupCount = vendorOrders.filter((o) => o.status === 'separado').length;
  const completedCount = vendorOrders.filter((o) => o.status === 'retirado').length;

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Stall Bar & Fair Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
              {activeVendor.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-stone-900">
                  {activeVendor.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Produtor Familiar
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {activeVendor.stallNumber} • {activeVendor.community}
              </p>
            </div>
          </div>

          {/* Switch Active Vendor (for demo testing) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <label htmlFor="vendor-select-dropdown" className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              Banca Ativa:
            </label>
            <select
              id="vendor-select-dropdown"
              value={activeVendor.id}
              onChange={(e) => onSelectVendor(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-base sm:text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.stallNumber.split(' ')[1] || 'Banca'})
                </option>
              ))}
            </select>

            <button
              onClick={handlePrintSummary}
              className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition cursor-pointer shrink-0"
              title="Imprimir Resumo da Carga para o Caminhão"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ODS 2 Real-Time Impact Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mb-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              Alimentos Salvos do Descarte
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-950">
              ~{impact.foodSavedKg} <span className="text-xs font-normal">kg</span>
            </div>
            <span className="text-[10px] text-emerald-700">Evitados pela colheita sob demanda</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Receita Pré-Garantida
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              R$ {impact.guaranteedRevenue.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[10px] text-stone-500">Vendas fechadas antes de sair de casa</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Taxa de Assertividade
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              96%
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Precisão da carga do caminhão</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-teal-600" />
              CO₂ Evitado (ODS 2 & 12)
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              ~{impact.co2AvoidedKg} <span className="text-xs font-normal">kg CO₂e</span>
            </div>
            <span className="text-[10px] text-stone-500">Menos lixo orgânico em aterros</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          id="farmer-tab-forecast"
          onClick={() => setActiveTab('forecast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'forecast'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Planejamento de Carga & Colheita</span>
        </button>

        <button
          id="farmer-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer relative ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Entregas na Banca ({vendorOrders.length})</span>
          {pendingSeparationCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-stone-900">
              {pendingSeparationCount} pendentes
            </span>
          )}
        </button>

        <button
          id="farmer-tab-products"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Preços do Dia & Produtos ({vendorProducts.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'forecast' && (
        <DemandForecastTable
          products={vendorProducts}
          orders={vendorOrders}
          vendorName={activeVendor.name}
        />
      )}

      {activeTab === 'orders' && (
        <OrderManager
          orders={vendorOrders}
          onUpdateStatus={onUpdateOrderStatus}
          isOnline={isOnline}
        />
      )}

      {activeTab === 'products' && (
        <ProductManager
          products={vendorProducts}
          onUpdateProduct={onUpdateProduct}
        />
      )}
    </div>
  );
};
