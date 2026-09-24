import React, { useState } from 'react';
import { Product } from '../../types';
import { Settings2, Plus, Check, Edit2, Sparkles, Tag } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  onUpdateProduct,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
  };

  const handleSaveEdit = (product: Product) => {
    onUpdateProduct({
      ...product,
      price: Number(editPrice),
    });
    setEditingId(null);
  };

  const handleToggleActive = (product: Product) => {
    onUpdateProduct({
      ...product,
      isActive: !product.isActive,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-700" />
            Gestão de Preços do Dia & Itens Ativos
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ajuste os valores para o dia da feira e ative/pause os alimentos disponíveis para pré-reserva.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((product) => {
          const isEditing = editingId === product.id;

          return (
            <div
              key={product.id}
              className={`p-3.5 rounded-xl border transition-all ${
                product.isActive
                  ? 'bg-stone-50/70 border-stone-200'
                  : 'bg-stone-100/50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{product.imageEmoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 leading-tight">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Unidade: {product.unit}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(product)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                    product.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {product.isActive ? 'Disponível' : 'Pausado'}
                </button>
              </div>

              {/* Price Row */}
              <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-stone-500 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.10"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 bg-white border border-emerald-500 rounded text-xs font-bold text-stone-900 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(product)}
                      className="p-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-[10px] text-stone-500">Preço atual:</span>
                      <div className="text-xs font-extrabold text-stone-900">
                        R$ {product.price.toFixed(2).replace('.', ',')} / {product.unit}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartEdit(product)}
                      className="text-[11px] text-stone-500 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Alterar Preço
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
