import React, { useState } from 'react';
import { FuelPrices } from '../types';
import { Sparkles, Check, DollarSign } from 'lucide-react';

interface PricesBarProps {
  prices: FuelPrices;
  onChangePrice: (fuel: string, value: number) => void;
  lastSavedTime?: string;
}

export const PricesBar: React.FC<PricesBarProps> = ({
  prices,
  onChangePrice,
  lastSavedTime,
}) => {
  const [justSaved, setJustSaved] = useState(false);

  const handlePriceChange = (fuel: string, rawVal: string) => {
    const val = parseFloat(rawVal) || 0;
    onChangePrice(fuel, val);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Precios por Litro (Guardados en memoria)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>{justSaved ? '¡Precio actualizado!' : 'Persistente en localStorage'}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Magna */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 sm:p-3 relative group transition hover:border-emerald-500/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
              Magna
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
              Verde
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-emerald-400 font-mono font-bold text-sm pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={prices.Magna ?? ''}
              onChange={(e) => handlePriceChange('Magna', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-6 pr-2 py-1.5 text-center font-mono-numbers font-bold text-base sm:text-lg text-emerald-300 focus:outline-none focus:border-emerald-400 transition"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Premium */}
        <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-2.5 sm:p-3 relative group transition hover:border-rose-500/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-extrabold text-rose-400">
              Premium
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-semibold">
              Roja
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-rose-400 font-mono font-bold text-sm pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={prices.Premium ?? ''}
              onChange={(e) => handlePriceChange('Premium', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-6 pr-2 py-1.5 text-center font-mono-numbers font-bold text-base sm:text-lg text-rose-300 focus:outline-none focus:border-rose-400 transition"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Diesel */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-2.5 sm:p-3 relative group transition hover:border-amber-500/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-extrabold text-amber-400">
              Diesel
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-semibold">
              Negra
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-amber-400 font-mono font-bold text-sm pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={prices.Diesel ?? ''}
              onChange={(e) => handlePriceChange('Diesel', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-6 pr-2 py-1.5 text-center font-mono-numbers font-bold text-base sm:text-lg text-amber-300 focus:outline-none focus:border-amber-400 transition"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>* Modifica cualquier precio y se guardará automáticamente para tus próximos cortes.</span>
      </div>
    </div>
  );
};
