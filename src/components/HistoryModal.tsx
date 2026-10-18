import React from 'react';
import { X, History, Trash2, ArrowUpRight, ArrowDownRight, CheckCircle2, FolderDown, UploadCloud } from 'lucide-react';
import { ShiftCutRecord } from '../types';

interface HistoryModalProps {
  history: ShiftCutRecord[];
  onLoadCut: (cut: ShiftCutRecord) => void;
  onDeleteCut: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onLoadCut,
  onDeleteCut,
  onClearHistory,
  onClose,
}) => {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Historial_Cortes_Gasolinera_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-base text-white">
              Historial de Cortes Guardados ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History list */}
        <div className="my-3 space-y-2.5 overflow-y-auto flex-1 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Aún no hay cortes guardados en este dispositivo.</p>
              <p className="text-xs text-slate-600 mt-1">
                Haz clic en "Guardar en Historial" al finalizar un turno para registrarlo aquí.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isExact = Math.abs(item.diff) < 0.05;
              const isSurplus = item.diff > 0.05;
              const isShort = item.diff < -0.05;

              let statusText = 'CUADRADO';
              let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
              if (isSurplus) {
                statusText = `SOBRANTE (+${item.diff.toFixed(2)})`;
                badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
              } else if (isShort) {
                statusText = `FALTANTE (-$${Math.abs(item.diff).toFixed(2)})`;
                badgeColor = 'text-red-400 bg-red-500/10 border-red-500/30';
              }

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">
                          {item.emp || 'Sin nombre'}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                          Turno {item.shift || 'General'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.dateStr || new Date(item.createdAt).toLocaleString('es-MX')}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} font-mono-numbers shrink-0`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-900/60 rounded-xl text-xs font-mono-numbers mb-2.5">
                    <div>
                      <div className="text-[10px] text-slate-500">Litros:</div>
                      <div className="font-bold text-sky-400">{(item.totalLiters || 0).toFixed(2)} L</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Venta:</div>
                      <div className="font-bold text-slate-200">${(item.totalExpected || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Entregado:</div>
                      <div className="font-bold text-emerald-400">${(item.totalReceived || 0).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => onLoadCut(item)}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition active:scale-95"
                    >
                      Cargar en Pantalla
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCut(item.id)}
                      className="p-1 text-slate-600 hover:text-red-400 transition"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleExportJson}
              className="text-slate-400 hover:text-sky-400 flex items-center gap-1 font-semibold transition"
            >
              <FolderDown className="w-4 h-4" />
              <span>Exportar Respaldo JSON</span>
            </button>

            <button
              type="button"
              onClick={onClearHistory}
              className="text-red-400 hover:text-red-300 font-semibold transition"
            >
              Vaciar Historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
