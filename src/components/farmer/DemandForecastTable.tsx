import React, { useState } from 'react';
import { Product, ReservationOrder } from '../../types';
import { Truck, Scale, AlertTriangle, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';

interface DemandForecastTableProps {
  products: Product[];
  orders: ReservationOrder[];
  vendorName: string;
}

export const DemandForecastTable: React.FC<DemandForecastTableProps> = ({
  products,
  orders,
  vendorName,
}) => {
  // Safety margin for walk-by fair customers (percentage)
  const [safetyMarginPercent, setSafetyMarginPercent] = useState<number>(20);

  // Compute reserved quantity per product
  const reservedQuantities: { [productId: string]: number } = {};
  orders
    .filter((o) => o.status !== 'cancelado')
    .forEach((order) => {
      order.items.forEach((item) => {
        reservedQuantities[item.productId] =
          (reservedQuantities[item.productId] || 0) + item.quantity;
      });
    });

  // Calculate totals
  let totalPreReservedUnits = 0;
  let totalOptimizedTruckUnits = 0;
  let totalTraditionalTruckUnits = 0;

  const rows = products.map((prod) => {
    const reserved = reservedQuantities[prod.id] || 0;
    // Walk-by surplus buffer based on selected percentage
    const walkByMargin = Math.ceil(reserved * (safetyMarginPercent / 100));
    const optimizedLoad = reserved + walkByMargin;
    // In traditional blind approach, farmers typically haul their maximum capacity (harvestLimitKg)
    const traditionalBlindLoad = prod.harvestLimitKg;
    const potentialWasteAvoided = Math.max(0, traditionalBlindLoad - optimizedLoad);

    totalPreReservedUnits += reserved;
    totalOptimizedTruckUnits += optimizedLoad;
    totalTraditionalTruckUnits += traditionalBlindLoad;

    return {
      product: prod,
      reserved,
      walkByMargin,
      optimizedLoad,
      traditionalBlindLoad,
      potentialWasteAvoided,
    };
  });

  const totalWasteAvoided = Math.max(0, totalTraditionalTruckUnits - totalOptimizedTruckUnits);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              Planejamento de Carga Otimizada & Colheita
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Recomendação de colheita baseada nas pré-reservas reais da feira para a banca de {vendorName}.
          </p>
        </div>

        {/* Safety Margin Selector */}
        <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-600">Margem p/ Venda Avulsa:</span>
          <div className="flex gap-1">
            {[10, 20, 30].map((margin) => (
              <button
                key={margin}
                onClick={() => setSafetyMarginPercent(margin)}
                className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  safetyMarginPercent === margin
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                +{margin}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-900 text-white">
        <div>
          <span className="text-[11px] text-emerald-200 block">Pré-Reservas Confirmadas</span>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            {totalPreReservedUnits} <span className="text-xs text-white font-normal">itens garantidos</span>
          </div>
          <span className="text-[10px] text-emerald-300">Demanda real contratada</span>
        </div>

        <div>
          <span className="text-[11px] text-emerald-200 block">Carga Total a Transportar</span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalOptimizedTruckUnits} <span className="text-xs text-emerald-200 font-normal">unid / kg</span>
          </div>
          <span className="text-[10px] text-emerald-300">Reservas + {safetyMarginPercent}% avulso</span>
        </div>

        <div>
          <span className="text-[11px] text-emerald-200 block">Desperdício Potencial Evitado</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 flex items-center gap-1">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            ~{totalWasteAvoided} <span className="text-xs text-white font-normal">kg a menos no descarte</span>
          </div>
          <span className="text-[10px] text-emerald-300">Em relação à colheita às cegas</span>
        </div>
      </div>

      {/* Mobile Card View (sm / md:hidden) */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div
            key={row.product.id}
            className="p-3.5 bg-stone-50/90 border border-stone-200 rounded-xl space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl shrink-0">{row.product.imageEmoji}</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{row.product.name}</h4>
                  <span className="text-[11px] text-stone-500">Unidade: {row.product.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Colheita / Caminhão
                </span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-black text-sm shadow-2xs">
                  {row.optimizedLoad} {row.product.unit}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/80 text-center">
              <div className="bg-white p-2 rounded-lg border border-stone-200/60">
                <span className="block text-[10px] text-stone-500 font-semibold">Pré-Reservado</span>
                <span className="text-xs font-black text-emerald-800">{row.reserved} {row.product.unit}</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-stone-200/60">
                <span className="block text-[10px] text-stone-500 font-semibold">Avulso (+{safetyMarginPercent}%)</span>
                <span className="text-xs font-black text-stone-700">+{row.walkByMargin}</span>
              </div>

              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span className="block text-[10px] text-emerald-800 font-semibold">Sobra Evitada</span>
                <span className="text-xs font-black text-emerald-700">-{row.potentialWasteAvoided} {row.product.unit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>Método Tradicional sem EcoFeira:</span>
              <span className="line-through">{row.traditionalBlindLoad} {row.product.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Harvest & Load Table (Desktop & Tablet: hidden md:block) */}
      <div className="hidden md:block overflow-x-auto border border-stone-200 rounded-xl">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3 px-3.5">Alimento</th>
              <th className="py-3 px-3.5">Unidade</th>
              <th className="py-3 px-3.5 text-center">Pré-Reservado</th>
              <th className="py-3 px-3.5 text-center">Margem (+{safetyMarginPercent}%)</th>
              <th className="py-3 px-3.5 text-center text-emerald-900 font-bold bg-emerald-50/50">Carga Recomendada</th>
              <th className="py-3 px-3.5 text-center text-stone-400">Método Tradicional</th>
              <th className="py-3 px-3.5 text-right text-emerald-700">Economia / Sobra Zero</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row) => (
              <tr key={row.product.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3 px-3.5 font-bold text-stone-900 flex items-center gap-2">
                  <span className="text-lg">{row.product.imageEmoji}</span>
                  <span>{row.product.name}</span>
                </td>
                <td className="py-3 px-3.5 text-stone-500">{row.product.unit}</td>
                <td className="py-3 px-3.5 text-center font-bold text-emerald-800">
                  {row.reserved}
                </td>
                <td className="py-3 px-3.5 text-center text-stone-500">
                  +{row.walkByMargin}
                </td>
                <td className="py-3 px-3.5 text-center font-black text-emerald-950 bg-emerald-50/50">
                  {row.optimizedLoad} {row.product.unit}
                </td>
                <td className="py-3 px-3.5 text-center text-stone-400 line-through">
                  {row.traditionalBlindLoad} {row.product.unit}
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-emerald-700">
                  -{row.potentialWasteAvoided} {row.product.unit} de sobra
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Dica para o Feirante:</strong> Ao carregar o caminhão com a quantidade calculada, você economiza combustível, evita transportar caixas pesadas desnecessárias e assegura que 100% dos alimentos colhidos terão destino comercial garantido.
        </p>
      </div>
    </div>
  );
};
