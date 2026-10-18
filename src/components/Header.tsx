import React from 'react';
import { Fuel, Share2, Download, History, RotateCcw, FileCode, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenShare: () => void;
  onOpenHistory: () => void;
  onDownloadHtml: () => void;
  onReset: () => void;
  historyCount: number;
  hasSharedData: boolean;
  onClearSharedBanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenShare,
  onOpenHistory,
  onDownloadHtml,
  onReset,
  historyCount,
  hasSharedData,
  onClearSharedBanner,
}) => {
  return (
    <header className="mb-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Fuel className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">
                  CORTES DE BOMBA
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OFFLINE 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arqueo de efectivo y contadores de combustible
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap active:scale-95"
              title="Compartir enlace dinámico o código QR"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir Enlace</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95"
              title="Ver historial de cortes anteriores"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Historial</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-sky-500 text-white text-[10px] font-mono">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap active:scale-95"
              title="Descargar archivo HTML independiente para abrir en cualquier móvil sin internet"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Descargar HTML</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center justify-center p-2 bg-slate-800/80 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-slate-700/80 rounded-xl text-xs transition active:scale-95"
              title="Limpiar contadores y montos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasSharedData && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Estás visualizando datos compartidos desde un enlace dinámico.
            </span>
            {onClearSharedBanner && (
              <button
                onClick={onClearSharedBanner}
                className="text-[11px] font-bold text-amber-300 hover:text-white underline ml-2 shrink-0"
              >
                Cerrar aviso
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
