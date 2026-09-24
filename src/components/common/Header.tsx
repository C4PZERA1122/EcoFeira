import React from 'react';
import { UserRole } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  ShoppingBag,
  Store,
  User,
  Wifi,
  WifiOff,
  Info,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenProjectModal: () => void;
  onOpenMyReservations?: () => void;
  reservationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  cartCount,
  onOpenCart,
  onOpenProjectModal,
  onOpenMyReservations,
  reservationsCount,
}) => {
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline } = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => onRoleChange('consumer')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-xs shrink-0">
                🌱
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-stone-900 text-base sm:text-lg tracking-tight">
                    EcoFeira
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    PWA
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-stone-500 font-medium leading-none">
                  Feiras sem desperdício • ODS 2
                </span>
              </div>
            </div>
          </div>

          {/* Center: Persona Toggle (Desktop Only: hidden md:flex) */}
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            <button
              id="role-switch-consumer"
              onClick={() => onRoleChange('consumer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'consumer'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sou Consumidor</span>
            </button>
            <button
              id="role-switch-farmer"
              onClick={() => onRoleChange('farmer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sou Feirante / Produtor</span>
            </button>
          </div>

          {/* Right Action Tools: Offline Simulator, Project Info, Install, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Offline Simulation Toggle for the Prototype Presentation */}
            <button
              id="toggle-offline-simulation-btn"
              onClick={toggleSimulatedOffline}
              title="Testar funcionamento Offline-First do feirante na feira"
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isSimulatedOffline
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline">Rede Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  <span className="text-[11px] font-bold text-amber-900">Offline</span>
                </>
              )}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Project Pitch / ODS Modal */}
            <button
              id="open-project-modal-btn"
              onClick={onOpenProjectModal}
              className="p-1.5 sm:p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Visão Geral do Projeto, ODS 2 e Metodologia"
            >
              <Info className="w-4 h-4 text-emerald-700" />
            </button>

            {/* Consumer Reservations List trigger (Desktop) */}
            {currentRole === 'consumer' && onOpenMyReservations && reservationsCount > 0 && (
              <button
                id="my-reservations-button"
                onClick={onOpenMyReservations}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                title="Minhas Pré-reservas"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Minhas Reservas ({reservationsCount})</span>
              </button>
            )}

            {/* Shopping Cart Drawer Trigger (Consumer Mode - Desktop and Mobile) */}
            {currentRole === 'consumer' && (
              <button
                id="open-cart-drawer-btn"
                onClick={onOpenCart}
                className="relative flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cesta</span>
                {cartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Persona Switcher Sub-bar (Mobile Only: md:hidden) */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs font-bold text-center gap-1">
            <button
              id="mobile-role-switch-consumer"
              onClick={() => onRoleChange('consumer')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
                currentRole === 'consumer'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60 font-black'
                  : 'text-stone-500 hover:text-stone-800 font-semibold'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sou Consumidor</span>
            </button>

            <button
              id="mobile-role-switch-farmer"
              onClick={() => onRoleChange('farmer')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
                currentRole === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60 font-black'
                  : 'text-stone-500 hover:text-stone-800 font-semibold'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sou Feirante</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
