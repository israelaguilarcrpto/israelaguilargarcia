import React from 'react';
import { User, Clock, Building2, Calendar } from 'lucide-react';

interface ShiftMetaProps {
  emp: string;
  shift: string;
  stationName: string;
  dateStr: string;
  onChangeEmp: (val: string) => void;
  onChangeShift: (val: string) => void;
  onChangeStation: (val: string) => void;
}

const COMMON_SHIFTS = ['Mañana', 'Tarde', 'Noche', 'Mixto'];

export const ShiftMeta: React.FC<ShiftMetaProps> = ({
  emp,
  shift,
  stationName,
  dateStr,
  onChangeEmp,
  onChangeShift,
  onChangeStation,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
          <User className="w-4 h-4" />
          Datos del Turno y Despachador
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dateStr || new Date().toLocaleDateString('es-MX')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Despachador */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Despachador / Cajero
          </label>
          <div className="relative">
            <input
              type="text"
              value={emp}
              onChange={(e) => onChangeEmp(e.target.value)}
              placeholder="Nombre completo"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-600 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Turno */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Turno de Trabajo
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={shift}
              onChange={(e) => onChangeShift(e.target.value)}
              placeholder="Ej: Mañana"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-600 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
          <div className="flex gap-1 mt-1.5 overflow-x-auto pb-0.5">
            {COMMON_SHIFTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeShift(s)}
                className={`px-2 py-0.5 text-[10px] rounded-md font-semibold transition ${
                  shift.toLowerCase() === s.toLowerCase()
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Estación / Isla */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Estación / Isla (Opcional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={stationName}
              onChange={(e) => onChangeStation(e.target.value)}
              placeholder="Ej: Estación Centro #401"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-600 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
