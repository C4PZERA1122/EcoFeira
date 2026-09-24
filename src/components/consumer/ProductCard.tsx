import React from 'react';
import { Product, Vendor } from '../../types';
import { Plus, Minus, Check, Leaf, HeartHandshake } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  vendor?: Vendor;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  vendor,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const percentReserved = Math.min(
    100,
    Math.round((product.currentReservedKg / product.harvestLimitKg) * 100)
  );

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-4">
        {/* Top badges: Emoji + Organic / Family Tags */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shrink-0">
            {product.imageEmoji}
          </div>

          <div className="flex flex-wrap gap-1 justify-end">
            {product.isOrganic && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <Leaf className="w-2.5 h-2.5" /> Orgânico
              </span>
            )}
            {product.isFamilyFarm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                <HeartHandshake className="w-2.5 h-2.5" /> Família Rural
              </span>
            )}
          </div>
        </div>

        {/* Product Title and Vendor */}
        <h3 className="font-bold text-stone-900 text-sm leading-snug">
          {product.name}
        </h3>

        {vendor && (
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>{vendor.avatarEmoji}</span>
            <span className="truncate">{vendor.name} • {vendor.stallNumber.split(' ')[1] || 'Banca'}</span>
          </p>
        )}

        <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {product.harvestNotice && (
          <div className="mt-2.5 text-[10px] font-medium text-stone-600 bg-stone-50 px-2 py-1 rounded-md border border-stone-200/60 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">●</span>
            <span className="truncate">{product.harvestNotice}</span>
          </div>
        )}

        {/* Harvest Quota Gauge */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-stone-500 font-medium mb-1">
            <span>Cota de Colheita Reservada</span>
            <span className="font-bold text-stone-700">{percentReserved}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentReserved > 80 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${percentReserved}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Price & Add to Cart Controls */}
      <div className="p-4 pt-3 border-t border-stone-100 bg-stone-50/40 flex items-center justify-between">
        <div>
          <span className="text-xs text-stone-500">Preço na feira:</span>
          <div className="font-extrabold text-stone-900 text-base">
            R$ {product.price.toFixed(2).replace('.', ',')}
            <span className="text-xs font-medium text-stone-500"> / {product.unit}</span>
          </div>
        </div>

        {quantityInCart === 0 ? (
          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Reservar</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 rounded-xl p-1 border border-emerald-300">
            <button
              id={`remove-cart-btn-${product.id}`}
              onClick={() => onRemoveFromCart(product.id)}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center hover:bg-emerald-200 text-emerald-900 transition cursor-pointer active:scale-90"
              title="Diminuir"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-black px-1.5 min-w-5 text-center">
              {quantityInCart}
            </span>
            <button
              id={`increment-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer active:scale-90"
              title="Aumentar"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
