import React from 'react';
import { ReservationOrder } from '../../types';
import { Layers, QrCode, ArrowLeft, CheckCircle2, Clock, MapPin, Store } from 'lucide-react';

interface MyReservationsViewProps {
  orders: ReservationOrder[];
  onSelectOrder: (order: ReservationOrder) => void;
  onBackToCatalog: () => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  orders,
  onSelectOrder,
  onBackToCatalog,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToCatalog}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition cursor-pointer"
            title="Voltar ao catálogo"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              Minhas Pré-Reservas da Feira
            </h2>
            <p className="text-xs text-stone-500">
              Apresente o código na banca no dia da feira para retirar seus alimentos frescos.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToCatalog}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          + Fazer nova reserva
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-2xl flex items-center justify-center mx-auto mb-3">
            🧾
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Nenhuma reserva realizada ainda</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Explore o catálogo de produtores e faça sua primeira pré-reserva para o próximo dia de feira!
          </p>
          <button
            onClick={onBackToCatalog}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer"
          >
            Ver Alimentos da Feira
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => {
            const isCompleted = order.status === 'retirado';
            const isReady = order.status === 'separado';

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                        {order.code}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 mt-1.5 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-stone-400" />
                        {order.vendorName}
                      </h4>
                      <span className="text-xs text-stone-500 block">
                        {order.stallNumber} • {order.fairName}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isCompleted
                          ? 'bg-stone-100 text-stone-600'
                          : isReady
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'separado'
                        ? 'Separado na Banca'
                        : order.status === 'retirado'
                        ? 'Retirado'
                        : 'Pendente (Na Horta)'}
                    </span>
                  </div>

                  <div className="py-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Retirada: <strong>{order.pickupTimeEstimate || 'Horário da feira'}</strong></span>
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1">
                      Itens: {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total a Pagar</span>
                    <span className="text-sm font-extrabold text-stone-900">
                      R$ {order.totalAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer border border-emerald-200"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver Comprovante</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
