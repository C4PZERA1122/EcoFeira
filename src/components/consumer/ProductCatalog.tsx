import React, { useState, useMemo } from 'react';
import { Product, Vendor, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, Sparkles, Leaf } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  vendors: Vendor[];
  selectedVendorId: string | 'all';
  cartItems: { [productId: string]: number };
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'todos', label: 'Todos os Itens', icon: '🧺' },
  { id: 'folhas_verduras', label: 'Folhas & Verduras', icon: '🥬' },
  { id: 'legumes_raizes', label: 'Legumes & Raízes', icon: '🥕' },
  { id: 'frutas', label: 'Frutas da Estação', icon: '🍎' },
  { id: 'temperos_ervas', label: 'Temperos & Ervas', icon: '🌿' },
  { id: 'artesanal', label: 'Feito na Roça', icon: '🍯' },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  vendors,
  selectedVendorId,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  const vendorMap = useMemo(() => {
    return new Map(vendors.map((v) => [v.id, v]));
  }, [vendors]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.isActive) return false;

      // Filter by vendor
      if (selectedVendorId !== 'all' && product.vendorId !== selectedVendorId) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
        return false;
      }

      // Filter by organic
      if (onlyOrganic && !product.isOrganic) {
        return false;
      }

      // Filter by search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [products, selectedVendorId, selectedCategory, onlyOrganic, searchTerm]);

  return (
    <section id="catalogo-section" className="scroll-mt-20">
      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-products-input"
              type="text"
              placeholder="Buscar tomate, alface, mandioca, morangos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-base sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              id="filter-organic-toggle"
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                onlyOrganic
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${onlyOrganic ? 'text-emerald-700' : 'text-stone-400'}`} />
              <span>Apenas Orgânicos</span>
            </button>

            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
              {filteredProducts.length} itens encontrados
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 w-full max-w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              vendor={vendorMap.get(product.vendorId)}
              quantityInCart={cartItems[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-3xl flex items-center justify-center mx-auto mb-3">
            🌾
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Nenhum alimento encontrado</h3>
          <p className="text-xs text-stone-500 mt-1">
            Tente buscar com outro termo ou remover os filtros de categoria e feirante.
          </p>
          <button
            id="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('todos');
              setOnlyOrganic(false);
            }}
            className="mt-4 px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </section>
  );
};
