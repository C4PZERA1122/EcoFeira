import React, { useState, useEffect } from 'react';
import { UserRole, Product, ReservationOrder, OrderStatus } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/common/Header';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ProjectModal } from './components/common/ProjectModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FairSelector } from './components/consumer/FairSelector';
import { VendorSelector } from './components/consumer/VendorSelector';
import { ProductCatalog } from './components/consumer/ProductCatalog';
import { CartDrawer } from './components/consumer/CartDrawer';
import { VoucherModal } from './components/consumer/VoucherModal';
import { MyReservationsView } from './components/consumer/MyReservationsView';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('consumer');
  const [fairs, setFairs] = useState(storageService.getFairs());
  const [vendors, setVendors] = useState(storageService.getVendors());
  const [products, setProducts] = useState(storageService.getProducts());
  const [orders, setOrders] = useState(storageService.getOrders());

  const [activeFairId, setActiveFairId] = useState(storageService.getActiveFairId());
  const [activeFarmerVendorId, setActiveFarmerVendorId] = useState(storageService.getActiveVendorId());
  const [selectedConsumerVendorId, setSelectedConsumerVendorId] = useState<string | 'all'>('all');

  // Consumer cart & modals state
  const [cartItems, setCartItems] = useState<{ [productId: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeVoucherOrder, setActiveVoucherOrder] = useState<ReservationOrder | null>(null);
  const [showMyReservations, setShowMyReservations] = useState(false);

  // Farmer tabs state (synchronized with mobile navigation)
  const [farmerTab, setFarmerTab] = useState<'forecast' | 'orders' | 'products'>('forecast');

  const { isOnline } = useOnlineStatus();

  // Keep state reactive with local storage and sync
  useEffect(() => {
    const updateFromStorage = () => {
      setFairs(storageService.getFairs());
      setVendors(storageService.getVendors());
      setProducts(storageService.getProducts());
      setOrders(storageService.getOrders());
      setActiveFairId(storageService.getActiveFairId());
      setActiveFarmerVendorId(storageService.getActiveVendorId());
    };

    const unsubscribe = storageService.subscribe(updateFromStorage);
    return () => unsubscribe();
  }, []);

  const activeFair = fairs.find((f) => f.id === activeFairId) || fairs[0];

  // Farmer pending separation orders count for mobile badge
  const pendingOrdersCount = orders.filter(
    (o) => o.vendorId === activeFarmerVendorId && o.status === 'pendente'
  ).length;

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      } );
    } else {
      setCartItems((prev) => ({ ...prev, [productId]: quantity }));
    }
  };

  const handleClearCart = () => {
    setCartItems({});
  };

  const totalCartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // Calculate cart subtotal for floating banner
  const productMap = new Map(products.map((p) => [p.id, p]));
  const cartSubtotal = Object.entries(cartItems).reduce((sum, [pId, qty]) => {
    const prod = productMap.get(pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  // Status updates
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    storageService.updateOrderStatus(orderId, status);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    storageService.updateProduct(updatedProduct);
  };

  // Switch active fair
  const handleSelectFair = (fairId: string) => {
    setActiveFairId(fairId);
    storageService.setActiveFairId(fairId);
    setSelectedConsumerVendorId('all');
  };

  // Switch active farmer vendor
  const handleSelectFarmerVendor = (vendorId: string) => {
    setActiveFarmerVendorId(vendorId);
    storageService.setActiveVendorId(vendorId);
  };

  // When a reservation completes successfully
  const handleOrderSuccess = (order: ReservationOrder) => {
    setActiveVoucherOrder(order);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden w-full">
      {/* Offline Status & Simulator Alert */}
      <OfflineBanner />

      {/* Main App Navigation */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setShowMyReservations(false);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenMyReservations={() => setShowMyReservations(true)}
        reservationsCount={orders.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {currentRole === 'consumer' ? (
          <div>
            {showMyReservations ? (
              <MyReservationsView
                orders={orders}
                onSelectOrder={(order) => setActiveVoucherOrder(order)}
                onBackToCatalog={() => setShowMyReservations(false)}
              />
            ) : (
              <>
                {/* Fair Location & Date Selector */}
                <FairSelector
                  fairs={fairs}
                  activeFair={activeFair}
                  onSelectFair={handleSelectFair}
                />

                {/* Stalls / Family Producers Showcase */}
                <VendorSelector
                  vendors={vendors}
                  selectedVendorId={selectedConsumerVendorId}
                  onSelectVendor={setSelectedConsumerVendorId}
                />

                {/* Produce Catalog */}
                <ProductCatalog
                  products={products}
                  vendors={vendors}
                  selectedVendorId={selectedConsumerVendorId}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              </>
            )}
          </div>
        ) : (
          /* Farmer / Stallholder Dashboard */
          <FarmerDashboard
            vendors={vendors}
            activeVendorId={activeFarmerVendorId}
            onSelectVendor={handleSelectFarmerVendor}
            products={products}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateProduct={handleUpdateProduct}
            isOnline={isOnline}
            activeTab={farmerTab}
            onTabChange={setFarmerTab}
          />
        )}
      </main>

      {/* Bottom Floating Cart Bar for Mobile & Desktop (Consumer Mode) */}
      {currentRole === 'consumer' && totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              id="floating-cart-bar-btn"
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition-transform transform active:scale-98 cursor-pointer border border-emerald-700"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold leading-tight">
                    {totalCartCount} {totalCartCount === 1 ? 'item na cesta' : 'itens na cesta'}
                  </span>
                  <span className="block text-[11px] text-emerald-200">
                    Pré-reserva para a próxima feira
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
                <div className="p-1 rounded-lg bg-emerald-700 text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Native-style Mobile Bottom Navigation */}
      <MobileBottomNav
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setShowMyReservations(false);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        reservationsCount={orders.length}
        showMyReservations={showMyReservations}
        onToggleReservations={(show) => setShowMyReservations(show)}
        farmerTab={farmerTab}
        onFarmerTabChange={setFarmerTab}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-auto mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">EcoFeira PWA</span>
            <span>•</span>
            <span>Alinhado à ODS 2 (Fome Zero e Agricultura Sustentável)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              Visão do Projeto & Pitch
            </button>
            <span>•</span>
            <span>Suporte Offline-First Ativo</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Sem Burocracia</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        products={products}
        vendors={vendors}
        activeFair={activeFair}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Digital Voucher Modal */}
      <VoucherModal
        order={activeVoucherOrder}
        onClose={() => setActiveVoucherOrder(null)}
      />

      {/* Project Overview & ODS 2 Pitch Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}
