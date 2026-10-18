/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FuelPrices, Pump, PaymentsData, ShiftCutRecord, BillDenominations } from './types';
import { Header } from './components/Header';
import { PricesBar } from './components/PricesBar';
import { ShiftMeta } from './components/ShiftMeta';
import { PumpList } from './components/PumpList';
import { PaymentSection } from './components/PaymentSection';
import { BannerResult } from './components/BannerResult';
import { ShareModal } from './components/ShareModal';
import { BillCalculatorModal } from './components/BillCalculatorModal';
import { HistoryModal } from './components/HistoryModal';
import { decodeCutFromUrl } from './utils/shareUtils';
import { generateStandaloneHtml } from './utils/standaloneHtml';
import { Check, Sparkles } from 'lucide-react';

// Default initial prices
const DEFAULT_PRICES: FuelPrices = {
  Magna: 23.55,
  Premium: 27.70,
  Diesel: 27.00,
};

// Default initial pumps from user's code
const DEFAULT_PUMPS: Pump[] = [
  { id: 1, name: 'Bomba 6 (Isla 3)', fuel: 'Magna', init: 0, final: 0 },
  { id: 2, name: 'Bomba 7 (Isla 3)', fuel: 'Magna', init: 0, final: 0 },
  { id: 3, name: 'Bomba 6 (Isla 3)', fuel: 'Premium', init: 0, final: 0 },
  { id: 4, name: 'Bomba 7 (Isla 3)', fuel: 'Premium', init: 0, final: 0 },
  { id: 5, name: 'Bomba 8 (Isla 4)', fuel: 'Diesel', init: 0, final: 0 },
  { id: 6, name: 'Bomba 9 (Isla 4)', fuel: 'Diesel', init: 0, final: 0 },
  { id: 7, name: 'Bomba 10 (Isla 5)', fuel: 'Diesel', init: 0, final: 0 },
  { id: 8, name: 'Bomba 11 (Isla 5)', fuel: 'Diesel', init: 0, final: 0 },
];

export default function App() {
  // 1. Persistent fuel prices (persisted in 'gas_prices_v1' localStorage per requirement)
  const [prices, setPrices] = useState<FuelPrices>(() => {
    try {
      const saved = localStorage.getItem('gas_prices_v1');
      if (saved) {
        return { ...DEFAULT_PRICES, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error cargando precios de localStorage:', e);
    }
    return DEFAULT_PRICES;
  });

  // 2. Pumps state
  const [pumps, setPumps] = useState<Pump[]>(() => {
    try {
      const saved = localStorage.getItem('gas_data_offline_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pumps && Array.isArray(parsed.pumps) && parsed.pumps.length > 0) {
          return parsed.pumps;
        }
      }
    } catch (e) {}
    return DEFAULT_PUMPS;
  });

  // 3. Shift metadata
  const [emp, setEmp] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gas_data_offline_v1');
      if (saved) return JSON.parse(saved).emp || '';
    } catch {}
    return '';
  });

  const [shift, setShift] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gas_data_offline_v1');
      if (saved) return JSON.parse(saved).shift || 'Mañana';
    } catch {}
    return 'Mañana';
  });

  const [stationName, setStationName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gas_data_offline_v1');
      if (saved) return JSON.parse(saved).stationName || '';
    } catch {}
    return '';
  });

  const [dateStr] = useState<string>(() => {
    return new Date().toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  // 4. Money & Payments
  const [payments, setPayments] = useState<PaymentsData>(() => {
    try {
      const saved = localStorage.getItem('gas_data_offline_v1');
      if (saved) {
        const d = JSON.parse(saved);
        return {
          cash: parseFloat(d.cash) || 0,
          coins: parseFloat(d.coins) || 0,
          vouchers: parseFloat(d.vouchers) || 0,
          cards: parseFloat(d.cards) || 0,
          expenses: parseFloat(d.expenses) || 0,
          denominations: d.denominations,
        };
      }
    } catch {}
    return { cash: 0, coins: 0, vouchers: 0, cards: 0, expenses: 0 };
  });

  // 5. History of cuts
  const [history, setHistory] = useState<ShiftCutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gas_cuts_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // 6. UI Modals and notifications
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBillCalculator, setShowBillCalculator] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasSharedData, setHasSharedData] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check URL on mount for shared dynamic link (#corte=...)
  useEffect(() => {
    const shared = decodeCutFromUrl();
    if (shared) {
      if (shared.emp) setEmp(shared.emp);
      if (shared.shift) setShift(shared.shift);
      if (shared.station) setStationName(shared.station);
      if (shared.prices) {
        setPrices((prev) => ({ ...prev, ...shared.prices }));
        localStorage.setItem('gas_prices_v1', JSON.stringify({ ...prices, ...shared.prices }));
      }
      if (shared.pumps && Array.isArray(shared.pumps) && shared.pumps.length > 0) {
        setPumps(
          shared.pumps.map((p, idx) => ({
            id: idx + 1,
            name: p.name,
            fuel: p.fuel,
            init: p.init,
            final: p.final,
          }))
        );
      }
      if (shared.payments) {
        setPayments((prev) => ({
          ...prev,
          cash: shared.payments.cash || 0,
          coins: shared.payments.coins || 0,
          vouchers: shared.payments.vouchers || 0,
          cards: shared.payments.cards || 0,
          expenses: shared.payments.expenses || 0,
        }));
      }
      setHasSharedData(true);
      showToast('¡Corte dinámico cargado exitosamente desde el enlace!');
    }
  }, []);

  // Save draft automatically into localStorage
  useEffect(() => {
    const draft = {
      pumps,
      emp,
      shift,
      stationName,
      cash: payments.cash,
      coins: payments.coins,
      vouchers: payments.vouchers,
      cards: payments.cards,
      expenses: payments.expenses,
      denominations: payments.denominations,
    };
    try {
      localStorage.setItem('gas_data_offline_v1', JSON.stringify(draft));
    } catch (e) {
      console.error('Error al autoguardar borrador:', e);
    }
  }, [pumps, emp, shift, stationName, payments]);

  // Update prices and persist into localStorage
  const handlePriceChange = (fuel: string, value: number) => {
    setPrices((prev) => {
      const next = { ...prev, [fuel]: value };
      try {
        localStorage.setItem('gas_prices_v1', JSON.stringify(next));
      } catch (e) {
        console.error('Error guardando precios:', e);
      }
      return next;
    });
  };

  // Pump modifications
  const handlePumpChange = (index: number, field: 'init' | 'final' | 'name' | 'fuel', value: any) => {
    setPumps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddPump = (newPump: Pump) => {
    setPumps((prev) => [...prev, newPump]);
    showToast(`Bomba "${newPump.name}" agregada.`);
  };

  const handleRemovePump = (index: number) => {
    setPumps((prev) => prev.filter((_, i) => i !== index));
    showToast('Bomba eliminada.');
  };

  // Copy initial readings from last cut's final counters
  const handleSetInitFromLastFinal = () => {
    if (history.length === 0) {
      showToast('No hay cortes previos en el historial.');
      return;
    }
    const lastCut = history[0];
    let matched = 0;
    setPumps((prev) =>
      prev.map((p) => {
        const found = lastCut.pumps.find((lp) => lp.name === p.name && lp.fuel === p.fuel);
        if (found && found.final > 0) {
          matched++;
          return { ...p, init: found.final, final: found.final };
        }
        return p;
      })
    );
    showToast(`Lecturas iniciales fijadas de ${matched} bombas.`);
  };

  // Payment field updates
  const handlePaymentChange = (field: keyof PaymentsData, val: number) => {
    setPayments((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleApplyCashFromCalculator = (totalAmount: number, breakdown: BillDenominations) => {
    setPayments((prev) => ({
      ...prev,
      cash: totalAmount,
      denominations: breakdown,
    }));
    showToast(`Efectivo actualizado: $${totalAmount.toLocaleString('es-MX')}`);
  };

  // Real-time totals and difference
  const calculations = useMemo(() => {
    let totalExpected = 0;
    let totalLiters = 0;

    pumps.forEach((p) => {
      const liters = Math.max(0, p.final - p.init);
      const unitPrice = prices[p.fuel] || 0;
      totalLiters += liters;
      totalExpected += liters * unitPrice;
    });

    const totalReceived =
      (payments.cash || 0) +
      (payments.coins || 0) +
      (payments.vouchers || 0) +
      (payments.cards || 0) +
      (payments.expenses || 0);

    const diff = totalReceived - totalExpected;
    let status: 'exact' | 'surplus' | 'short' = 'exact';
    if (diff > 0.05) status = 'surplus';
    else if (diff < -0.05) status = 'short';

    return {
      totalExpected,
      totalLiters,
      totalReceived,
      diff,
      status,
    };
  }, [pumps, prices, payments]);

  // Current full cut record object
  const currentCutRecord: ShiftCutRecord = useMemo(() => {
    return {
      id: String(Date.now()),
      createdAt: Date.now(),
      dateStr: new Date().toLocaleString('es-MX'),
      emp: emp || 'Sin nombre',
      shift: shift || 'General',
      stationName,
      prices,
      pumps,
      payments,
      totalLiters: calculations.totalLiters,
      totalExpected: calculations.totalExpected,
      totalReceived: calculations.totalReceived,
      diff: calculations.diff,
      status: calculations.status,
    };
  }, [emp, shift, stationName, prices, pumps, payments, calculations]);

  // Save current cut to history
  const handleSaveCut = () => {
    const updated = [currentCutRecord, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('gas_cuts_history_v1', JSON.stringify(updated));
      showToast('✓ ¡Corte guardado exitosamente en el historial!');
    } catch (e) {
      console.error('Error guardando historial:', e);
      showToast('Error al guardar en memoria.');
    }
  };

  // Download standalone offline HTML (user's explicit feature request)
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(prices, pumps);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `control-cortes-gasolinera-offline.html`;
    a.click();
    showToast('✓ Archivo HTML independiente descargado.');
  };

  // Download Text Report
  const handleDownloadTxtReport = () => {
    let totL = 0;
    let totA = 0;
    let details = '';
    pumps.forEach((p) => {
      const l = Math.max(0, p.final - p.init);
      const pr = prices[p.fuel] || 0;
      const amt = l * pr;
      totL += l;
      totA += amt;
      details += `  ${p.name.padEnd(20)} [${p.fuel} @ $${pr.toFixed(2)}]: ${l.toFixed(3)} L = $${amt.toFixed(2)}\n`;
    });

    const totRec = calculations.totalReceived;
    const diff = calculations.diff;
    const estado =
      Math.abs(diff) < 0.05
        ? 'CUADRADO EXACTO'
        : diff > 0
        ? `SOBRANTE (+${diff.toFixed(2)})`
        : `FALTANTE (-$${Math.abs(diff).toFixed(2)})`;

    const txt = `===========================================
REPORTE DE CORTE DE VENTAS - GASOLINERA
===========================================
Fecha y Hora:  ${new Date().toLocaleString('es-MX')}
Despachador:   ${emp || 'General'}
Turno:         ${shift || 'General'}
${stationName ? `Estación:      ${stationName}\n` : ''}-------------------------------------------
PRECIOS VIGENTES:
  Magna:   $${(prices.Magna || 0).toFixed(2)} / L
  Premium: $${(prices.Premium || 0).toFixed(2)} / L
  Diesel:  $${(prices.Diesel || 0).toFixed(2)} / L
-------------------------------------------
LECTURA DE BOMBAS:
${details}-------------------------------------------
TOTAL VENDIDO:     ${totL.toFixed(3)} Litros
TOTAL ESPERADO:    $${totA.toFixed(2)} MXN
-------------------------------------------
DINERO EN ARQUEO:
  Efectivo:        $${(payments.cash || 0).toFixed(2)}
  Monedas:         $${(payments.coins || 0).toFixed(2)}
  Vales:           $${(payments.vouchers || 0).toFixed(2)}
  Tarjetas/TPV:    $${(payments.cards || 0).toFixed(2)}
  ${payments.expenses ? `Retiros/Gastos:  $${payments.expenses.toFixed(2)}\n` : ''}  TOTAL RECIBIDO:  $${totRec.toFixed(2)} MXN
-------------------------------------------
RESULTADO DE ARQUEO:
  ESTADO: ${estado}
  DIFERENCIA: $${diff.toFixed(2)} MXN
===========================================`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const safeEmp = (emp || 'Turno').replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `Corte_${safeEmp}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    showToast('✓ Reporte .TXT descargado.');
  };

  // Reset shift data
  const handleReset = () => {
    if (window.confirm('¿Limpiar los contadores y montos del turno actual? Los precios se conservarán intactos.')) {
      setPumps((prev) => prev.map((p) => ({ ...p, init: 0, final: 0 })));
      setPayments({ cash: 0, coins: 0, vouchers: 0, cards: 0, expenses: 0 });
      showToast('Turno reiniciado.');
    }
  };

  // Load a cut from history
  const handleLoadCutFromHistory = (cut: ShiftCutRecord) => {
    if (cut.emp) setEmp(cut.emp);
    if (cut.shift) setShift(cut.shift);
    if (cut.stationName) setStationName(cut.stationName);
    if (cut.prices) setPrices(cut.prices);
    if (cut.pumps) setPumps(cut.pumps);
    if (cut.payments) setPayments(cut.payments);
    setShowHistoryModal(false);
    showToast(`Corte de ${cut.emp} cargado.`);
  };

  const handleDeleteCutFromHistory = (id: string) => {
    const next = history.filter((c) => c.id !== id);
    setHistory(next);
    localStorage.setItem('gas_cuts_history_v1', JSON.stringify(next));
    showToast('Registro eliminado del historial.');
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de eliminar todo el historial de cortes guardados?')) {
      setHistory([]);
      localStorage.removeItem('gas_cuts_history_v1');
      showToast('Historial vaciado.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-3 sm:py-6 px-3 sm:px-6 flex justify-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 left-1/2 -translate-x-1/2 bg-sky-500 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Responsive layout */}
      <div className="w-full max-w-4xl mx-auto">
        <Header
          onOpenShare={() => setShowShareModal(true)}
          onOpenHistory={() => setShowHistoryModal(true)}
          onDownloadHtml={handleDownloadStandaloneHtml}
          onReset={handleReset}
          historyCount={history.length}
          hasSharedData={hasSharedData}
          onClearSharedBanner={() => setHasSharedData(false)}
        />

        {/* 1. Prices Bar (Persisting in localStorage: 'gas_prices_v1') */}
        <PricesBar
          prices={prices}
          onChangePrice={handlePriceChange}
        />

        {/* 2. Shift & Dispatcher Metadata */}
        <ShiftMeta
          emp={emp}
          shift={shift}
          stationName={stationName}
          dateStr={dateStr}
          onChangeEmp={setEmp}
          onChangeShift={setShift}
          onChangeStation={setStationName}
        />

        {/* 3. Pump Counters */}
        <PumpList
          pumps={pumps}
          prices={prices}
          onChangePump={handlePumpChange}
          onAddPump={handleAddPump}
          onRemovePump={handleRemovePump}
          onSetInitFromLastFinal={handleSetInitFromLastFinal}
          hasPreviousCut={history.length > 0}
        />

        {/* 4. Cash, Coins, Vouchers, Cards, Expenses */}
        <PaymentSection
          payments={payments}
          onChangePayment={handlePaymentChange}
          onOpenBillCalculator={() => setShowBillCalculator(true)}
          totalExpected={calculations.totalExpected}
          totalReceived={calculations.totalReceived}
        />

        {/* 5. Dynamic Banner Result (Cuadrado, Sobrante, Faltante) */}
        <BannerResult
          totalExpected={calculations.totalExpected}
          totalReceived={calculations.totalReceived}
          totalLiters={calculations.totalLiters}
          diff={calculations.diff}
          onSaveCut={handleSaveCut}
          onDownloadTxt={handleDownloadTxtReport}
          onOpenShare={() => setShowShareModal(true)}
        />

        {/* Modals */}
        {showShareModal && (
          <ShareModal
            cut={currentCutRecord}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {showBillCalculator && (
          <BillCalculatorModal
            initialDenominations={payments.denominations}
            onApplyCash={handleApplyCashFromCalculator}
            onClose={() => setShowBillCalculator(false)}
          />
        )}

        {showHistoryModal && (
          <HistoryModal
            history={history}
            onLoadCut={handleLoadCutFromHistory}
            onDeleteCut={handleDeleteCutFromHistory}
            onClearHistory={handleClearHistory}
            onClose={() => setShowHistoryModal(false)}
          />
        )}

        {/* Footer info */}
        <footer className="mt-8 text-center text-xs text-slate-500 pb-8 no-print">
          <p>Control de Cortes de Turno para Gasolineras · 100% Funcional Offline</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Los precios y cortes se almacenan de forma segura en la memoria de este navegador.
          </p>
        </footer>
      </div>
    </div>
  );
}
