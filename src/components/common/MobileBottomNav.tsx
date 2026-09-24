import React from 'react';
import { UserRole } from '../../types';
import {
  ShoppingBag,
  Store,
  Truck,
  PackageCheck,
  Tag,
  Layers,
  ArrowRightLeft,
  Apple,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  reservationsCount: number;
  showMyReservations: boolean;
  onToggleReservations: (show: boolean) => void;
  farmerTab: 'forecast' | 'orders' | 'products';
  onFarmerTabChange: (tab: 'forecast' | 'orders' | 'products') => void;
  pendingOrdersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  onRoleChange,
  cartCount,
  onOpenCart,
  reservationsCount,
  showMyReservations,
  onToggleReservations,
  farmerTab,
  onFarmerTabChange,
  pendingOrdersCount,
}) => {
  const scrollToSection = (sectionId: string) => {
    onToggleReservations(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Navegação Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div
        className={`grid ${
          currentRole === 'consumer' ? 'grid-cols-5' : 'grid-cols-4'
        } h-16 max-w-lg mx-auto px-1 items-center`}
      >
        {currentRole === 'consumer' ? (
          <>
            {/* Tab 1: Alimentos / Catálogo */}
            <button
              id="mobile-nav-catalog"
              onClick={() => scrollToSection('catalogo-section')}
              className={`flex flex-col items-center justify-center h-full py-1 text-center transition-colors cursor-pointer ${
                !showMyReservations
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Apple className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight">Alimentos</span>
            </button>

            {/* Tab 2: Bancas */}
            <button
              id="mobile-nav-stalls"
              onClick={() => scrollToSection('bancas-section')}
              className="flex flex-col items-center justify-center h-full py-1 text-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <Store className="w-5 h-5 mb-0.5 text-stone-600" />
              <span className="text-[10px] leading-tight">Bancas</span>
            </button>

            {/* Tab 3: Cesta de Pré-Reserva */}
            <button
              id="mobile-nav-cart"
              onClick={onOpenCart}
              className="flex flex-col items-center justify-center h-full py-1 text-center relative text-emerald-800 font-bold transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                {cartCount > 0 && (
                  <span
                    id="mobile-cart-badge"
                    className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-2xs animate-pulse"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight text-emerald-900 mt-0.5">Cesta</span>
            </button>

            {/* Tab 4: Minhas Reservas */}
            <button
              id="mobile-nav-reservations"
              onClick={() => onToggleReservations(true)}
              className={`flex flex-col items-center justify-center h-full py-1 text-center relative transition-colors cursor-pointer ${
                showMyReservations
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <Layers className="w-5 h-5 mb-0.5" />
                {reservationsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {reservationsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight">Reservas</span>
            </button>

            {/* Tab 5: Alternar p/ Modo Feirante */}
            <button
              id="mobile-nav-switch-farmer"
              onClick={() => onRoleChange('farmer')}
              className="flex flex-col items-center justify-center h-full py-1 text-center text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
              title="Mudar para o Painel do Feirante"
            >
              <ArrowRightLeft className="w-5 h-5 mb-0.5 text-stone-600" />
              <span className="text-[10px] leading-tight">Feirante</span>
            </button>
          </>
        ) : (
          /* Farmer Navigation on Mobile */
          <>
            {/* Tab 1: Carga & Colheita */}
            <button
              id="mobile-nav-farmer-forecast"
              onClick={() => onFarmerTabChange('forecast')}
              className={`flex flex-col items-center justify-center h-full py-1 text-center transition-colors cursor-pointer ${
                farmerTab === 'forecast'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Truck className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight">Carga</span>
            </button>

            {/* Tab 2: Entregas na Barraca */}
            <button
              id="mobile-nav-farmer-orders"
              onClick={() => onFarmerTabChange('orders')}
              className={`flex flex-col items-center justify-center h-full py-1 text-center relative transition-colors cursor-pointer ${
                farmerTab === 'orders'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <PackageCheck className="w-5 h-5 mb-0.5" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 bg-amber-400 text-stone-950 text-[9px] font-black rounded-full flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight">Entregas</span>
            </button>

            {/* Tab 3: Gestão de Preços */}
            <button
              id="mobile-nav-farmer-products"
              onClick={() => onFarmerTabChange('products')}
              className={`flex flex-col items-center justify-center h-full py-1 text-center transition-colors cursor-pointer ${
                farmerTab === 'products'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Tag className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight">Preços</span>
            </button>

            {/* Tab 4: Alternar p/ Modo Consumidor */}
            <button
              id="mobile-nav-switch-consumer"
              onClick={() => onRoleChange('consumer')}
              className="flex flex-col items-center justify-center h-full py-1 text-center text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
              title="Mudar para visão do Consumidor"
            >
              <ArrowRightLeft className="w-5 h-5 mb-0.5 text-stone-600" />
              <span className="text-[10px] leading-tight">Consumidor</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
