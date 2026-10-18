import React, { useState } from 'react';
import { X, Check, Calculator, RotateCcw, Plus, Minus } from 'lucide-react';
import { BillDenominations } from '../types';

interface BillCalculatorModalProps {
  initialDenominations?: BillDenominations;
  onApplyCash: (totalAmount: number, breakdown: BillDenominations) => void;
  onClose: () => void;
}

const DENOMINATIONS: Array<{ key: keyof BillDenominations; label: string; value: number; color: string }> = [
  { key: 'b1000', label: '$1,000', value: 1000, color: 'text-amber-400 border-amber-500/30' },
  { key: 'b500', label: '$500', value: 500, color: 'text-sky-400 border-sky-500/30' },
  { key: 'b200', label: '$200', value: 200, color: 'text-emerald-400 border-emerald-500/30' },
  { key: 'b100', label: '$100', value: 100, color: 'text-rose-400 border-rose-500/30' },
  { key: 'b50', label: '$50', value: 50, color: 'text-purple-400 border-purple-500/30' },
  { key: 'b20', label: '$20', value: 20, color: 'text-blue-400 border-blue-500/30' },
];

export const BillCalculatorModal: React.FC<BillCalculatorModalProps> = ({
  initialDenominations,
  onApplyCash,
  onClose,
}) => {
  const [counts, setCounts] = useState<BillDenominations>({
    b1000: initialDenominations?.b1000 || 0,
    b500: initialDenominations?.b500 || 0,
    b200: initialDenominations?.b200 || 0,
    b100: initialDenominations?.b100 || 0,
    b50: initialDenominations?.b50 || 0,
    b20: initialDenominations?.b20 || 0,
  });

  const updateCount = (key: keyof BillDenominations, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const setCountDirect = (key: keyof BillDenominations, valStr: string) => {
    const val = parseInt(valStr, 10);
    setCounts((prev) => ({
      ...prev,
      [key]: isNaN(val) ? 0 : Math.max(0, val),
    }));
  };

  const handleReset = () => {
    setCounts({
      b1000: 0,
      b500: 0,
      b200: 0,
      b100: 0,
      b50: 0,
      b20: 0,
    });
  };

  const totalCalculated = DENOMINATIONS.reduce(
    (acc, d) => acc + (counts[d.key] || 0) * d.value,
    0
  );

  const handleApply = () => {
    onApplyCash(totalCalculated, counts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base text-white">
              Arqueo de Billetes por Denominación
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Banner */}
        <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total en Billetes Contados
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono-numbers mt-1">
            ${totalCalculated.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Denominations List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {DENOMINATIONS.map((d) => {
            const count = counts[d.key] || 0;
            const subtotal = count * d.value;

            return (
              <div
                key={d.key}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
              >
                <div className="w-20 shrink-0">
                  <span className={`font-black text-base font-mono-numbers ${d.color.split(' ')[0]}`}>
                    {d.label}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    = ${subtotal.toLocaleString('es-MX')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateCount(d.key, -1)}
                    disabled={count === 0}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold flex items-center justify-center transition active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={count === 0 ? '' : count}
                    onChange={(e) => setCountDirect(d.key, e.target.value)}
                    placeholder="0"
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 text-center font-mono-numbers font-bold text-base text-white focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    type="button"
                    onClick={() => updateCount(d.key, 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateCount(d.key, 5)}
                    className="px-1.5 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-[11px] text-slate-300 font-bold transition"
                    title="Sumar 5 billetes"
                  >
                    +5
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Poner contadores en cero"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar al Efectivo (${totalCalculated.toLocaleString('es-MX')})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
