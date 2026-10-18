import React from 'react';
import { PaymentsData } from '../types';
import { Banknote, Coins, Ticket, CreditCard, MinusCircle, Calculator } from 'lucide-react';

interface PaymentSectionProps {
  payments: PaymentsData;
  onChangePayment: (field: keyof PaymentsData, val: number) => void;
  onOpenBillCalculator: () => void;
  totalExpected: number;
  totalReceived: number;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  payments,
  onChangePayment,
  onOpenBillCalculator,
  totalExpected,
  totalReceived,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
          <Banknote className="w-4 h-4" />
          Dinero Entregado / Recolectado
        </h2>

        <button
          type="button"
          onClick={onOpenBillCalculator}
          className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          title="Contar billetes por denominación ($1000, $500, $200, $100, $50, $20)"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Contador de Billetes</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Efectivo en Billetes */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <label className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              Billetes ($)
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            value={payments.cash === 0 ? '' : payments.cash}
            onChange={(e) => onChangePayment('cash', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2 text-center font-mono-numbers font-bold text-lg text-emerald-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Monedas */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <label className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Monedas ($)
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            value={payments.coins === 0 ? '' : payments.coins}
            onChange={(e) => onChangePayment('coins', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2 text-center font-mono-numbers font-bold text-lg text-amber-300 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Vales de Gasolina */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <label className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-sky-400" />
              Vales ($)
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            value={payments.vouchers === 0 ? '' : payments.vouchers}
            onChange={(e) => onChangePayment('vouchers', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2 text-center font-mono-numbers font-bold text-lg text-sky-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Tarjetas Bancarias */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <label className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              Tarjetas / TPV ($)
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            value={payments.cards === 0 ? '' : payments.cards}
            onChange={(e) => onChangePayment('cards', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-2 text-center font-mono-numbers font-bold text-lg text-purple-300 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Retiros / Gastos adicionales */}
      <div className="mb-4">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MinusCircle className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-slate-300">
                Gotas / Retiros a Bóveda / Gastos del Turno
              </span>
              <p className="text-[11px] text-slate-500">
                Dinero ya retirado de pista y respaldado con comprobante (se suma al arqueo)
              </p>
            </div>
          </div>
          <div className="w-full sm:w-44">
            <input
              type="number"
              step="0.01"
              value={payments.expenses === 0 ? '' : payments.expenses}
              onChange={(e) => onChangePayment('expenses', parseFloat(e.target.value) || 0)}
              placeholder="$0.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-center font-mono-numbers font-bold text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen comparativo de totales */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-center">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Vendido en Bombas
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono-numbers">
            ${totalExpected.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Dinero en Arqueo
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono-numbers">
            ${totalReceived.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
