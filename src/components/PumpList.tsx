import React, { useState } from 'react';
import { Pump, FuelPrices } from '../types';
import { Gauge, Plus, Trash2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

interface PumpListProps {
  pumps: Pump[];
  prices: FuelPrices;
  onChangePump: (index: number, field: 'init' | 'final' | 'name' | 'fuel', value: any) => void;
  onAddPump: (pump: Pump) => void;
  onRemovePump: (index: number) => void;
  onSetInitFromLastFinal?: () => void;
  hasPreviousCut?: boolean;
}

export const PumpList: React.FC<PumpListProps> = ({
  pumps,
  prices,
  onChangePump,
  onAddPump,
  onRemovePump,
  onSetInitFromLastFinal,
  hasPreviousCut,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFuel, setNewFuel] = useState<'Magna' | 'Premium' | 'Diesel'>('Magna');
  const [newInit, setNewInit] = useState('0');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddPump({
      id: Date.now(),
      name: newName.trim(),
      fuel: newFuel,
      init: parseFloat(newInit) || 0,
      final: parseFloat(newInit) || 0,
    });
    setNewName('');
    setShowAddForm(false);
  };

  const getFuelColorClass = (fuel: string) => {
    switch (fuel) {
      case 'Magna':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Premium':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Diesel':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Lectura de Contadores por Bomba
          </h2>
          <span className="text-xs text-slate-400">
            {pumps.length} {pumps.length === 1 ? 'bomba registrada' : 'bombas registradas'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasPreviousCut && onSetInitFromLastFinal && (
            <button
              type="button"
              onClick={onSetInitFromLastFinal}
              className="text-[11px] font-semibold text-sky-400 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/80 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 active:scale-95"
              title="Copiar las lecturas finales del último corte como iniciales"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Copiar Iniciales del Corte Previo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>{showAddForm ? 'Cancelar' : 'Agregar Bomba'}</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-700 rounded-xl p-3 mb-4 space-y-3">
          <div className="text-xs font-bold text-slate-200">Registrar nueva bomba o dispensador:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Ej: Bomba 12 (Isla 6)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              required
            />
            <select
              value={newFuel}
              onChange={(e) => setNewFuel(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="Magna">Magna (Verde)</option>
              <option value="Premium">Premium (Roja)</option>
              <option value="Diesel">Diesel (Negra)</option>
            </select>
            <input
              type="number"
              step="0.001"
              placeholder="Lectura inicial"
              value={newInit}
              onChange={(e) => setNewInit(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-bold"
            >
              Guardar Bomba
            </button>
          </div>
        </form>
      )}

      {/* Grid of pumps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pumps.map((p, i) => {
          const unitPrice = prices[p.fuel] || 0;
          const isNegative = p.final < p.init;
          const liters = Math.max(0, p.final - p.init);
          const totalAmt = liters * unitPrice;
          const fuelBadge = getFuelColorClass(p.fuel);

          return (
            <div
              key={p.id || i}
              className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 relative hover:border-slate-700 transition shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">
                    {p.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${fuelBadge}`}>
                    {p.fuel} (${unitPrice.toFixed(2)})
                  </span>
                </div>

                {pumps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemovePump(i)}
                    className="text-slate-600 hover:text-red-400 p-1 transition"
                    title="Eliminar bomba"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Counters inputs */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Lectura Inicial
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={p.init === 0 ? '' : p.init}
                    onChange={(e) => onChangePump(i, 'init', parseFloat(e.target.value) || 0)}
                    placeholder="0.000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2.5 text-center font-mono-numbers font-bold text-base text-sky-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Lectura Final
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={p.final === 0 ? '' : p.final}
                    onChange={(e) => onChangePump(i, 'final', parseFloat(e.target.value) || 0)}
                    placeholder="0.000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2.5 text-center font-mono-numbers font-bold text-base text-sky-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {isNegative && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded mb-2 border border-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Lectura final menor a la inicial (posible error o vuelta de odómetro)</span>
                </div>
              )}

              {/* Calculation Subtotal row */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono-numbers">
                <div className="text-slate-300">
                  <span className="text-slate-500 text-[11px]">Venta: </span>
                  <span className="font-bold text-sky-300">{liters.toFixed(3)}</span>
                  <span className="text-slate-500 text-[11px]"> L</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 text-[11px]">Importe: </span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ${totalAmt.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
