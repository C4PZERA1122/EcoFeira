import React, { useState } from 'react';
import { ReservationOrder, OrderStatus } from '../../types';
import { Search, CheckCircle2, PackageCheck, Clock, Phone, AlertCircle, Sparkles, Filter } from 'lucide-react';

interface OrderManagerProps {
  orders: ReservationOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  isOnline: boolean;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  onUpdateStatus,
  isOnline,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'todos' && order.status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchCode = order.code.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      return matchName || matchCode || matchPhone;
    }
    return true;
  });

  const counts = {
    todos: orders.length,
    pendente: orders.filter((o) => o.status === 'pendente').length,
    separado: orders.filter((o) => o.status === 'separado').length,
    retirado: orders.filter((o) => o.status === 'retirado').length,
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-700" />
            Entregas e Reservas da Banca (Atendimento na Feira)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Consulte a lista de encomendas e marque as entregas. Funciona mesmo sem sinal de internet na barraca.
          </p>
        </div>

        {!isOnline && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Operando no Modo Offline (Local)</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-farmer-orders-input"
            type="text"
            placeholder="Buscar por cliente, ECO-9481, celular..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-base sm:text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'todos', label: 'Todos', count: counts.todos },
            { id: 'pendente', label: 'Pendentes de Separação', count: counts.pendente },
            { id: 'separado', label: 'Prontos na Banca', count: counts.separado },
            { id: 'retirado', label: 'Entregues', count: counts.retirado },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  statusFilter === tab.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
          <p className="text-xs">Nenhum pedido encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'pendente';
            const isSeparated = order.status === 'separado';
            const isDelivered = order.status === 'retirado';

            return (
              <div
                key={order.id}
                id={`farmer-order-card-${order.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isDelivered
                    ? 'bg-stone-50/70 border-stone-200 opacity-80'
                    : isSeparated
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-stone-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-200/60">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-sm text-emerald-950 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
                        {order.code}
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        {order.customerName}
                      </span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-[11px] text-stone-500 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>Janela de Retirada: <strong>{order.pickupTimeEstimate || '08h às 10h'}</strong></span>
                      <span>•</span>
                      <span>Pagamento: <strong>{order.paymentMethod === 'pix_na_retirada' ? 'Pix' : order.paymentMethod === 'cartao_na_retirada' ? 'Cartão' : 'Dinheiro'}</strong></span>
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200 mt-1.5 inline-block">
                        <strong>Obs do cliente:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions according to status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending && (
                      <button
                        id={`mark-separated-btn-${order.id}`}
                        onClick={() => onUpdateStatus(order.id, 'separado')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        Marcar como Separado na Banca
                      </button>
                    )}

                    {isSeparated && (
                      <button
                        id={`mark-delivered-btn-${order.id}`}
                        onClick={() => onUpdateStatus(order.id, 'retirado')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Confirmar Entrega & Pagamento</span>
                      </button>
                    )}

                    {isDelivered && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Entregue e Pago
                      </span>
                    )}

                    {/* Quick revert for testing */}
                    {isDelivered && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'pendente')}
                        className="text-[10px] text-stone-400 hover:text-stone-600 underline cursor-pointer"
                      >
                        Desfazer
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in the reservation */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-500">Cesta:</span>
                    {order.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-stone-200 px-2 py-0.5 rounded-md font-medium text-stone-800"
                      >
                        {it.imageEmoji} {it.quantity}x {it.productName} ({it.unit})
                      </span>
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-stone-900">
                      R$ {order.totalAmount.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      ~{order.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
