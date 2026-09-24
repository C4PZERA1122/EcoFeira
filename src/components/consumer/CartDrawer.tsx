import React, { useState } from 'react';
import { Product, Vendor, FairLocation, ReservationOrder, OrderItem } from '../../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [productId: string]: number };
  products: Product[];
  vendors: Vendor[];
  activeFair: FairLocation;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: ReservationOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  vendors,
  activeFair,
  onUpdateQuantity,
  onClearCart,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Mariana Duarte');
  const [customerPhone, setCustomerPhone] = useState('(21) 99876-1234');
  const [customerEmail, setCustomerEmail] = useState('mariana.duarte@email.com');
  const [pickupTime, setPickupTime] = useState('08h00 às 09h30');
  const [paymentMethod, setPaymentMethod] = useState<'pix_na_retirada' | 'dinheiro_na_retirada' | 'cartao_na_retirada'>('pix_na_retirada');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Build item objects
  const productMap = new Map(products.map((p) => [p.id, p]));
  const vendorMap = new Map(vendors.map((v) => [v.id, v]));

  const cartList: { product: Product; quantity: number; vendor?: Vendor }[] = [];
  let totalAmount = 0;
  let totalWeightKg = 0;

  Object.entries(cartItems).forEach(([pId, qty]) => {
    if (qty > 0) {
      const prod = productMap.get(pId);
      if (prod) {
        cartList.push({
          product: prod,
          quantity: qty,
          vendor: vendorMap.get(prod.vendorId),
        });
        totalAmount += prod.price * qty;

        // Weight estimation
        if (prod.unit === 'kg') {
          totalWeightKg += qty;
        } else if (prod.unit === 'dúzia') {
          totalWeightKg += qty * 1.0;
        } else if (prod.unit === 'maço') {
          totalWeightKg += qty * 0.35;
        } else if (prod.unit === 'bandeja') {
          totalWeightKg += qty * 0.4;
        } else {
          totalWeightKg += qty * 0.5;
        }
      }
    }
  });

  const estimatedSavedKg = Math.max(1, Math.round(totalWeightKg * 0.85));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartList.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor, informe seu nome e telefone para identificação na banca.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Primary vendor for the reservation (or first one)
      const primaryVendor = cartList[0].vendor || vendors[0];

      const orderItems: OrderItem[] = cartList.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unit: item.product.unit,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.product.price * item.quantity,
        imageEmoji: item.product.imageEmoji,
      }));

      const createdOrder = storageService.createOrder({
        fairId: activeFair.id,
        fairName: activeFair.name,
        vendorId: primaryVendor.id,
        vendorName: primaryVendor.name,
        stallNumber: primaryVendor.stallNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        items: orderItems,
        totalAmount,
        estimatedWeightKg: Number(totalWeightKg.toFixed(1)),
        pickupTimeEstimate: pickupTime,
        paymentMethod,
        notes: notes.trim(),
      });

      onClearCart();
      onClose();
      onOrderSuccess(createdOrder);
    } catch (err) {
      console.error('Error creating order', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity"
    >
      <div
        id="cart-drawer-content"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              🧺
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Cesta de Pré-Reserva
              </h2>
              <span className="text-xs text-stone-500">
                {cartList.length} itens selecionados para a feira
              </span>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {cartList.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-3xl flex items-center justify-center mx-auto mb-3">
                🍃
              </div>
              <h3 className="text-sm font-bold text-stone-800">Sua cesta está vazia</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Selecione frutas, verduras e legumes frescos do catálogo para pré-reservar com os feirantes.
              </p>
              <button
                id="cart-continue-shopping-btn"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer"
              >
                Voltar ao Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* ODS 2 Impact Callout */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Impacto ODS 2 Direto:</span> Com esta pré-reserva, você previne o descarte de aproximadamente <strong className="text-emerald-800">~{estimatedSavedKg} kg</strong> de alimentos frescos, garantindo colheita exata para o pequeno produtor.
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 uppercase tracking-wider">
                  <span>Itens da Pré-reserva</span>
                  <button
                    id="clear-cart-items-btn"
                    onClick={onClearCart}
                    className="text-stone-400 hover:text-rose-600 font-medium normal-case flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Limpar tudo
                  </button>
                </div>

                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
                  {cartList.map(({ product, quantity, vendor }) => (
                    <div key={product.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl shrink-0">{product.imageEmoji}</span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 block">
                            R$ {product.price.toFixed(2).replace('.', ',')} / {product.unit}
                            {vendor && ` • ${vendor.stallNumber.split(' ')[1] || 'Banca'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 sm:w-5 sm:h-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200 active:scale-90 cursor-pointer"
                            title="Diminuir"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5 text-center min-w-4">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 sm:w-5 sm:h-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200 active:scale-90 cursor-pointer"
                            title="Aumentar"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-extrabold text-stone-900 w-16 text-right">
                          R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Form - Zero bureaucracy */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Dados para Retirada na Banca (Sem Burocracia)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-name" className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Seu Nome Completo:
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Mariana Duarte"
                        className="w-full px-3 py-2 sm:py-1.5 bg-white border border-stone-200 rounded-lg text-base sm:text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-phone" className="block text-[11px] font-semibold text-stone-600 mb-1">
                        WhatsApp / Celular:
                      </label>
                      <input
                        id="checkout-phone"
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ex: (21) 99876-1234"
                        className="w-full px-3 py-2 sm:py-1.5 bg-white border border-stone-200 rounded-lg text-base sm:text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-pickup" className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Janela Prevista de Retirada na Feira:
                    </label>
                    <select
                      id="checkout-pickup"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 sm:py-1.5 bg-white border border-stone-200 rounded-lg text-base sm:text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="07h00 às 08h30">07h00 às 08h30 (Logo no início da feira)</option>
                      <option value="08h00 às 09h30">08h00 às 09h30 (Meio da manhã)</option>
                      <option value="09h30 às 11h00">09h30 às 11h00 (Horário convencional)</option>
                      <option value="11h00 às 12h30">11h00 às 12h30 (Final da feira)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Pagamento (Direto na Banca durante a Retirada):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <label
                        className={`p-2 rounded-lg border text-center text-[11px] font-semibold cursor-pointer transition-all ${
                          paymentMethod === 'pix_na_retirada'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          className="sr-only"
                          checked={paymentMethod === 'pix_na_retirada'}
                          onChange={() => setPaymentMethod('pix_na_retirada')}
                        />
                        <span>Pix na Banca</span>
                      </label>

                      <label
                        className={`p-2 rounded-lg border text-center text-[11px] font-semibold cursor-pointer transition-all ${
                          paymentMethod === 'dinheiro_na_retirada'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          className="sr-only"
                          checked={paymentMethod === 'dinheiro_na_retirada'}
                          onChange={() => setPaymentMethod('dinheiro_na_retirada')}
                        />
                        <span>Dinheiro</span>
                      </label>

                      <label
                        className={`p-2 rounded-lg border text-center text-[11px] font-semibold cursor-pointer transition-all ${
                          paymentMethod === 'cartao_na_retirada'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          className="sr-only"
                          checked={paymentMethod === 'cartao_na_retirada'}
                          onChange={() => setPaymentMethod('cartao_na_retirada')}
                        />
                        <span>Cartão Déb/Créd</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-notes" className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Observação para o Feirante (Opcional):
                    </label>
                    <input
                      id="checkout-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Prefiro tomates mais firmes; alface fresca..."
                      className="w-full px-3 py-2 sm:py-1.5 bg-white border border-stone-200 rounded-lg text-base sm:text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Submit button inside form */}
                <button
                  id="confirm-reservation-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Confirmar Pré-Reserva Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer: Totals */}
        {cartList.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Peso Estimado da Cesta:</span>
              <span className="font-semibold text-stone-800">~{totalWeightKg.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1 border-t border-stone-200/60">
              <span>Total a Pagar na Retirada:</span>
              <span className="text-emerald-800 text-lg">
                R$ {totalAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 text-center">
              Sem taxas antecipadas. O feirante separa sua encomenda com antecedência.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
