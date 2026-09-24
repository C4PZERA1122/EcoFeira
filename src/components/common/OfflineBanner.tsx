import React from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium transition-all"
    >
      <div className="flex items-center gap-2 max-w-2xl">
        <WifiOff className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
        <div>
          <span className="font-bold">Modo Offline (Sem Sinal na Feira):</span>{' '}
          {isSimulatedOffline
            ? 'Simulação ativa! O EcoFeira continua funcionando 100% com dados salvos no aparelho.'
            : 'Você está sem conexão com a internet. O aplicativo está utilizando o cache local seguro.'}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isSimulatedOffline && (
          <button
            id="restore-online-simulation-button"
            onClick={toggleSimulatedOffline}
            className="flex items-center gap-1 bg-amber-700/90 hover:bg-amber-800 text-white text-xs px-2.5 py-1 rounded-md border border-amber-400/40 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restaurar Conexão</span>
          </button>
        )}
      </div>
    </div>
  );
};
