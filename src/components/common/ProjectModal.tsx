import React from 'react';
import { X, Target, Sprout, Smartphone, WifiOff, Users, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da feira e dos pedidos?')) {
      storageService.resetToDefaults();
      onClose();
    }
  };

  return (
    <div
      id="project-overview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-stone-100 gap-2">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0">
              🌱
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 truncate">Projeto EcoFeira</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  ODS 2 – Fome Zero
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 line-clamp-2 sm:line-clamp-none">
                Pré-reserva de hortifrúti em feiras livres com estimativa de demanda e desperdício zero
              </p>
            </div>
          </div>
          <button
            id="close-project-modal-button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-stone-700">
          {/* Problema & Solucao */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
              <h3 className="font-bold text-rose-900 flex items-center gap-1.5 text-sm mb-2">
                <Target className="w-4 h-4 text-rose-600" />
                O Problema Enfrentado
              </h3>
              <p className="text-xs text-rose-950/80 leading-relaxed">
                Feirantes e pequenos agricultores frequentemente levam volumes muito superiores ao volume real de vendas por falta de previsibilidade de demanda. Isso acarreta sobra de produtos altamente perecíveis, descarte em caçambas e prejuízos financeiros aos produtores.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm mb-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                A Solução EcoFeira
              </h3>
              <p className="text-xs text-emerald-950/80 leading-relaxed">
                Um PWA leve que conecta o consumidor ao feirante antes do dia da feira. Clientes reservam seus alimentos favoritos com antecedência. O feirante calcula exatamente o volume a colher e transportar, garantindo vendas e eliminando sobras.
              </p>
            </div>
          </div>

          {/* Diferenciais Competitivos */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Diferenciais em Relação a Concorrentes (Itrade, OneLink)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="font-semibold text-xs text-stone-900 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Baixa Burocracia
                </div>
                <p className="text-[11px] text-stone-600">
                  Sem contratos complexos ou cadastros pesados. Desenhado para a realidade simples do pequeno feirante familiar.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="font-semibold text-xs text-stone-900 mb-1 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> PWA Sem Download
                </div>
                <p className="text-[11px] text-stone-600">
                  Roda direto no navegador do smartphone ou instala em segundos sem gastar memória do aparelho com apps pesados.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="font-semibold text-xs text-stone-900 mb-1 flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5 text-emerald-600" /> Offline First
                </div>
                <p className="text-[11px] text-stone-600">
                  Na praça ou rua da feira, o sinal oscila com frequência. As listas de reservas e entregas funcionam mesmo sem sinal de internet.
                </p>
              </div>
            </div>
          </div>

          {/* ODS 2 & Metodologia */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <h4 className="font-bold text-amber-950 text-sm mb-2 flex items-center gap-1.5">
              <span>🌾</span> Alinhamento com a ODS 2 (Fome Zero e Agricultura Sustentável)
            </h4>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              O projeto atua diretamente na meta 12.3 e ODS 2: reduzindo perdas pós-colheita ao longo das cadeias produtivas de hortifrúti e valorizando a renda do agricultor familiar através de cadeias curtas de comercialização (short food supply chains).
            </p>
          </div>

          {/* Metodologia de desenvolvimento */}
          <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-700" /> Metodologia Ágil (Scrum & Kanban)
            </div>
            <p>
              Desenvolvimento iterativo em sprints curtas, priorizando feedback contínuo de feirantes em campo para ajustes rápidos de usabilidade e fluxos de atendimento na barraca.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="reset-prototype-button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-rose-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Dados Iniciais de Demonstração</span>
          </button>

          <button
            id="close-modal-bottom-button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer shadow-xs"
          >
            Fechar e Explorar Protótipo
          </button>
        </div>
      </div>
    </div>
  );
};
