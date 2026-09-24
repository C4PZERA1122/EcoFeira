import React from 'react';
import { FairLocation } from '../../types';
import { MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

interface FairSelectorProps {
  fairs: FairLocation[];
  activeFair: FairLocation;
  onSelectFair: (fairId: string) => void;
}

export const FairSelector: React.FC<FairSelectorProps> = ({
  fairs,
  activeFair,
  onSelectFair,
}) => {
  return (
    <section className="bg-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden mb-6">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-emerald-700/50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-10 w-32 h-32 rounded-full bg-emerald-600/30 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold mb-2 border border-emerald-600/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cadeia Curta de Alimentos • Pré-reserva Sem Desperdício</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Próxima Feira Livre: {activeFair.name}
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
              Reserve seus alimentos direto com os feirantes antes do dia da feira. Você garante produtos frescos colhidos no ponto e o produtor colhe apenas a quantidade certa.
            </p>
          </div>

          {/* Quick Fair Dropdown Switcher */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 shrink-0 w-full md:w-auto">
            <label htmlFor="fair-select-input" className="block text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mb-1">
              Selecionar Feira Livre:
            </label>
            <select
              id="fair-select-input"
              value={activeFair.id}
              onChange={(e) => onSelectFair(e.target.value)}
              className="w-full md:w-64 bg-emerald-900/90 text-white text-xs font-semibold py-2 px-3 rounded-lg border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {fairs.map((fair) => (
                <option key={fair.id} value={fair.id} className="bg-stone-900 text-white">
                  {fair.name} ({fair.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fair Highlights Info Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-emerald-700/80">
          <div className="flex items-center gap-2 text-xs text-emerald-100">
            <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
            <span><strong>Data:</strong> {activeFair.nextDate}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-100">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <span><strong>Horário de Retirada:</strong> {activeFair.timeWindow}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-100">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate"><strong>Local:</strong> {activeFair.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
