import React from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Save, Share2, FileText } from 'lucide-react';

interface BannerResultProps {
  totalExpected: number;
  totalReceived: number;
  totalLiters: number;
  diff: number;
  onSaveCut: () => void;
  onDownloadTxt: () => void;
  onOpenShare: () => void;
}

export const BannerResult: React.FC<BannerResultProps> = ({
  totalExpected,
  totalReceived,
  totalLiters,
  diff,
  onSaveCut,
  onDownloadTxt,
  onOpenShare,
}) => {
  const isExact = Math.abs(diff) < 0.05;
  const isSurplus = diff > 0.05;
  const isShort = diff < -0.05;

  let bgClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-100';
  let badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  let title = 'CORTE CUADRADO EXACTO';
  let subtitle = 'El dinero entregado coincide perfectamente con la venta de contadores.';
  let icon = <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />;

  if (isSurplus) {
    bgClass = 'bg-blue-950/80 border-blue-500 text-blue-100';
    badgeClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    title = 'SOBRANTE EN CAJA';
    subtitle = `Hay dinero adicional entregado que excede el cálculo de bombas por $${diff.toFixed(2)}.`;
    icon = <ArrowUpRight className="w-8 h-8 text-blue-400 shrink-0" />;
  } else if (isShort) {
    bgClass = 'bg-red-950/80 border-red-500 text-red-100';
    badgeClass = 'bg-red-500/20 text-red-300 border-red-500/30';
    title = 'FALTANTE EN CAJA';
    subtitle = `Falta dinero por cubrir para igualar la venta registrada en contadores.`;
    icon = <ArrowDownRight className="w-8 h-8 text-red-400 shrink-0" />;
  }

  return (
    <div className="mb-4">
      {/* Dynamic Status Banner */}
      <div
        className={`border-2 rounded-2xl p-5 text-center shadow-2xl transition-all duration-300 ${bgClass}`}
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          {icon}
          <div className="text-xl sm:text-2xl font-black tracking-tight">{title}</div>
        </div>

        <div className="font-mono-numbers text-3xl sm:text-5xl font-black my-2 tracking-tight">
          {isSurplus && '+'}
          {isShort && '-'}
          ${Math.abs(diff).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <p className="text-xs sm:text-sm font-medium opacity-90 max-w-lg mx-auto">
          {subtitle}
        </p>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-numbers">
          <div>
            <span className="opacity-70">Litros Vendidos: </span>
            <span className="font-bold">{totalLiters.toFixed(3)} L</span>
          </div>
          <div>
            <span className="opacity-70">Esperado: </span>
            <span className="font-bold">${totalExpected.toFixed(2)}</span>
          </div>
          <div>
            <span className="opacity-70">Arqueado: </span>
            <span className="font-bold">${totalReceived.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Workflow Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
        <button
          type="button"
          onClick={onSaveCut}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Guardar en Historial</span>
        </button>

        <button
          type="button"
          onClick={onOpenShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-sky-950/40 transition active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir Enlace / QR</span>
        </button>

        <button
          type="button"
          onClick={onDownloadTxt}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs sm:text-sm transition active:scale-95"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Descargar Reporte (.TXT)</span>
        </button>
      </div>
    </div>
  );
};
