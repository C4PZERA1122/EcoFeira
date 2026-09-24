import React from 'react';
import { Vendor } from '../../types';
import { Store, Star, Award } from 'lucide-react';

interface VendorSelectorProps {
  vendors: Vendor[];
  selectedVendorId: string | 'all';
  onSelectVendor: (vendorId: string | 'all') => void;
}

export const VendorSelector: React.FC<VendorSelectorProps> = ({
  vendors,
  selectedVendorId,
  onSelectVendor,
}) => {
  return (
    <div id="bancas-section" className="mb-6 scroll-mt-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-emerald-700" />
          Bancas e Produtores Familiares Participantes
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          {vendors.length} bancas ativas
        </span>
      </div>

      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory w-full max-w-full">
        {/* All Stalls Option */}
        <button
          id="vendor-filter-all"
          onClick={() => onSelectVendor('all')}
          className={`shrink-0 w-56 sm:w-auto text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between snap-start ${
            selectedVendorId === 'all'
              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
              🛒
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-xs text-stone-900 truncate">
                Todas as Bancas
              </span>
              <span className="block text-[11px] text-stone-500 truncate">
                Ver hortifrúti completo da feira
              </span>
            </div>
          </div>
          <div className="text-[10px] font-semibold text-emerald-700">
            Catálogo Unificado da Feira
          </div>
        </button>

        {/* Individual Vendors */}
        {vendors.map((vendor) => {
          const isSelected = selectedVendorId === vendor.id;
          return (
            <button
              key={vendor.id}
              id={`vendor-filter-${vendor.id}`}
              onClick={() => onSelectVendor(vendor.id)}
              className={`shrink-0 w-56 sm:w-auto text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between snap-start ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl shrink-0">{vendor.avatarEmoji}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 leading-tight truncate">
                        {vendor.name}
                      </h4>
                      <span className="text-[10px] font-medium text-stone-500 block truncate">
                        {vendor.stallNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-600">
                  <span className="inline-flex items-center text-amber-600 font-bold gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {vendor.rating}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-[10px] text-stone-500 truncate">{vendor.community}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                <span className="truncate">{vendor.specialties[0]}</span>
                <span className="font-bold text-emerald-700">Explorar</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
