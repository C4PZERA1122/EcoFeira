import React from 'react';
import { ReservationOrder } from '../../types';
import { X, CheckCircle, QrCode, MapPin, Calendar, Clock, DollarSign, Share2, Download, Leaf } from 'lucide-react';

interface VoucherModalProps {
  order: ReservationOrder | null;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `EcoFeira - Comprovante ${order.code}`,
        text: `Minha pré-reserva na EcoFeira: ${order.code} para retirada na ${order.stallNumber} (${order.vendorName}). Total: R$ ${order.totalAmount.toFixed(2)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `EcoFeira - Comprovante ${order.code} | ${order.vendorName} (${order.stallNumber}) | R$ ${order.totalAmount.toFixed(2)}`
      );
      alert('Código e detalhes copiados para a área de transferência!');
    }
  };

  return (
    <div
      id="voucher-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        id="voucher-modal-content"
        className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          id="close-voucher-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
            <Leaf className="w-3 h-3" /> Pré-Reserva Confirmada
          </span>
          <h2 className="text-xl font-extrabold text-stone-900">
            Tudo Certo, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            O feirante foi notificado e colherá seus alimentos na medida certa.
          </p>
        </div>

        {/* Digital Ticket / Pass */}
        <div className="bg-stone-50 border-2 border-dashed border-emerald-300 rounded-2xl p-5 space-y-4 relative">
          {/* Reservation Code & QR Code Simulation */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Código de Retirada
              </span>
              <div className="text-2xl font-black text-emerald-900 font-mono tracking-wider">
                {order.code}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Mostre este código ao feirante
              </span>
            </div>

            {/* Clean SVG QR Code pattern */}
            <div className="w-20 h-20 bg-white p-1.5 rounded-xl border border-stone-200 shadow-2xs flex flex-col items-center justify-center">
              <svg viewBox="0 0 29 29" className="w-full h-full text-stone-800">
                <path
                  fill="currentColor"
                  d="M0 0h7v7H0zM2 2v3h3V2zM8 0h1v2H8zM10 0h3v1h-3zM14 0h1v4h-1zM16 0h2v1h-2zM20 0h2v2h-2zM22 0h7v7h-7zM24 2v3h3V2zM0 8h1v1H0zM2 8h1v2H2zM4 8h3v1H4zM9 8h4v1H9zM15 8h2v2h-2zM18 8h1v1h-1zM20 8h2v1h-2zM23 8h2v1h-2zM27 8h2v2h-2zM0 10h2v1H0zM4 10h1v3H4zM6 10h1v1H6zM8 10h1v2H8zM11 10h3v1h-3zM17 10h1v2h-1zM21 10h2v1h-2zM25 10h1v2h-1zM0 12h3v1H0zM7 12h1v1H7zM9 12h2v1H9zM13 12h1v2h-1zM18 12h2v1h-2zM22 12h2v1h-2zM27 12h2v1h-2zM0 14h1v1H0zM2 14h2v1H2zM5 14h2v1H5zM8 14h4v1H8zM15 14h1v3h-1zM17 14h2v2h-2zM21 14h3v1h-3zM25 14h1v1h-1zM28 14h1v1h-1zM0 16h2v1H0zM3 16h2v1H3zM7 16h1v1H7zM10 16h2v1h-2zM13 16h1v1h-1zM19 16h1v2h-1zM23 16h1v2h-1zM26 16h3v1h-3zM0 18h2v1H0zM4 18h1v1H4zM6 18h3v1H6zM11 18h3v1h-3zM16 18h1v1h-1zM18 18h1v2h-1zM21 18h1v1h-1zM24 18h1v1h-1zM27 18h1v1h-1zM0 20h1v2H0zM2 20h2v1H2zM5 20h2v1H5zM8 20h2v1H8zM12 20h2v1h-2zM15 20h2v1h-2zM19 20h1v1h-1zM22 20h2v1h-2zM26 20h1v2h-1zM0 22h7v7H0zM2 24v3h3v-3zM8 22h1v2H8zM10 22h3v1h-3zM15 22h1v3h-1zM17 22h3v1h-3zM22 22h2v1h-2zM25 22h2v1h-2zM28 22h1v3h-1zM8 24h3v2H8zM12 24h2v1h-2zM18 24h3v1h-3zM22 24h1v3h-1zM24 24h2v1h-2zM8 26h1v3H8zM10 26h2v1h-2zM14 26h2v1h-2zM17 26h1v3h-1zM19 26h2v1h-2zM24 26h3v1h-3zM28 26h1v3h-1zM2 27h3v-1H2zM9 28h5v1H9zM16 28h1v1h-1zM20 28h3v1h-3zM25 28h2v1h-2z"
                />
              </svg>
              <span className="text-[8px] font-mono text-stone-400 mt-0.5">ECO-ID</span>
            </div>
          </div>

          {/* Location & Stall details */}
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">{order.vendorName}</strong>
                <span className="block text-emerald-800 font-semibold">{order.stallNumber}</span>
                <span className="text-[11px] text-stone-500">{order.fairName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Horário Previsto: <strong>{order.pickupTimeEstimate || '08h às 10h'}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Valor a Pagar: <strong className="text-stone-900 text-sm">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</strong> ({order.paymentMethod === 'pix_na_retirada' ? 'Pix na Banca' : order.paymentMethod === 'cartao_na_retirada' ? 'Cartão' : 'Dinheiro'})
              </span>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="pt-3 border-t border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Itens da Cesta ({order.items.length})
            </span>
            <div className="space-y-1 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <span>{item.imageEmoji}</span>
                    <span>{item.quantity}x {item.productName} ({item.unit})</span>
                  </span>
                  <span className="font-semibold">
                    R$ {item.subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 space-y-2">
          <button
            id="share-voucher-btn"
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar / Salvar Comprovante</span>
          </button>

          <button
            id="done-voucher-btn"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
          >
            Concluir e Voltar ao Início
          </button>
        </div>

        <p className="text-[10px] text-stone-400 text-center mt-3">
          ✓ Salvo no armazenamento seguro offline deste navegador.
        </p>
      </div>
    </div>
  );
};
