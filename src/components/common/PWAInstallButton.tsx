import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode, show subtle badge
  if (isInstalled) {
    return (
      <div
        id="pwa-installed-badge"
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
        title="EcoFeira instalado como PWA"
      >
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA Ativo</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-button"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        title="Instalar EcoFeira no seu dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
          title="Instalar no iPhone ou iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-install-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    🌱
                  </div>
                  <h3 className="text-base font-bold text-stone-900">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  id="close-ios-guide-button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    No navegador Safari, toque no botão de <strong className="text-stone-800">Compartilhar</strong> (ícone do quadrado com seta para cima <Share className="w-3.5 h-3.5 inline mx-0.5" />).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    Role o menu de opções para baixo e selecione <strong className="text-stone-800">Adicionar à Tela de Início</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    Toque em <strong className="text-stone-800">Adicionar</strong> no canto superior direito. Pronto! O EcoFeira funcionará offline como um app nativo sem consumir armazenamento da loja.
                  </div>
                </div>
              </div>

              <button
                id="dismiss-ios-guide"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition cursor-pointer"
              >
                Entendi, fechar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default desktop / browser simulated button
  return (
    <button
      id="pwa-generic-guide-button"
      onClick={() => setShowIOSGuide(true)}
      className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 text-xs font-medium transition cursor-pointer"
      title="Saiba como instalar este PWA"
    >
      <Download className="w-3.5 h-3.5 text-emerald-600" />
      <span>Instalar PWA</span>
    </button>
  );
};
