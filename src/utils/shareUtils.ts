import QRCode from 'qrcode';
import { ShiftCutRecord } from '../types';

export interface CompactSharePayload {
  emp: string;
  shift: string;
  station?: string;
  prices: Record<string, number>;
  pumps: Array<{ name: string; fuel: string; init: number; final: number }>;
  payments: { cash: number; coins: number; vouchers: number; cards: number; expenses?: number };
  date?: string;
}

export function encodeCutToUrl(cut: ShiftCutRecord): string {
  const payload: CompactSharePayload = {
    emp: cut.emp,
    shift: cut.shift,
    station: cut.stationName,
    prices: cut.prices,
    pumps: cut.pumps.map(p => ({
      name: p.name,
      fuel: p.fuel,
      init: p.init,
      final: p.final,
    })),
    payments: {
      cash: cut.payments.cash,
      coins: cut.payments.coins,
      vouchers: cut.payments.vouchers,
      cards: cut.payments.cards,
      expenses: cut.payments.expenses,
    },
    date: cut.dateStr,
  };

  try {
    const jsonStr = JSON.stringify(payload);
    // Base64 encoding safe for URLs
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `corte=${base64}`;
    return url.toString();
  } catch {
    const url = new URL(window.location.href);
    url.hash = `corte=${encodeURIComponent(JSON.stringify(payload))}`;
    return url.toString();
  }
}

export function decodeCutFromUrl(): CompactSharePayload | null {
  try {
    let hash = window.location.hash;
    let query = window.location.search;
    let raw = '';

    if (hash.startsWith('#')) hash = hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(query);

    raw = hashParams.get('corte') || queryParams.get('corte') || '';

    if (!raw) return null;

    let jsonStr = '';
    try {
      jsonStr = decodeURIComponent(atob(raw));
    } catch {
      jsonStr = decodeURIComponent(raw);
    }

    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed === 'object') {
      return parsed as CompactSharePayload;
    }
  } catch (err) {
    console.error('Error al decodificar corte compartido:', err);
  }
  return null;
}

export async function generateQrCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generando QR code:', err);
    return '';
  }
}

export function formatWhatsAppMessage(cut: ShiftCutRecord): string {
  const diffSign = cut.diff >= 0 ? '+' : '-';
  const diffFormatted = `$${Math.abs(cut.diff).toFixed(2)}`;
  const statusEmoji = Math.abs(cut.diff) < 0.05 ? '✅ CORTE CUADRADO EXACTO' : cut.diff > 0 ? `🔵 SOBRANTE EN CAJA (${diffSign}${diffFormatted})` : `🔴 FALTANTE EN CAJA (${diffSign}${diffFormatted})`;

  let pumpLines = cut.pumps
    .map(p => {
      const l = Math.max(0, p.final - p.init);
      const pr = cut.prices[p.fuel] || 0;
      const t = l * pr;
      return `• ${p.name} [${p.fuel}]: ${l.toFixed(3)}L ➔ $${t.toFixed(2)}`;
    })
    .join('\n');

  return `⛽ *CORTE DE CAJA - GASOLINERA*
📅 *Fecha:* ${cut.dateStr}
👤 *Despachador:* ${cut.emp || 'General'}
⏱ *Turno:* ${cut.shift || 'General'}
${cut.stationName ? `🏢 *Estación:* ${cut.stationName}\n` : ''}
-----------------------------------
🏷 *Precios por Litro:*
Magna: $${(cut.prices.Magna || 0).toFixed(2)} | Prem: $${(cut.prices.Premium || 0).toFixed(2)} | Diesel: $${(cut.prices.Diesel || 0).toFixed(2)}

📊 *Lectura de Bombas:*
${pumpLines}

-----------------------------------
💧 *Litros Totales:* ${cut.totalLiters.toFixed(3)} L
💰 *Total Esperado:* $${cut.totalExpected.toFixed(2)} MXN

💵 *Dinero Entregado:*
• Efectivo: $${(cut.payments.cash || 0).toFixed(2)}
• Monedas: $${(cut.payments.coins || 0).toFixed(2)}
• Vales: $${(cut.payments.vouchers || 0).toFixed(2)}
• Tarjetas: $${(cut.payments.cards || 0).toFixed(2)}
${cut.payments.expenses ? `• Retiros/Gastos: -$${(cut.payments.expenses).toFixed(2)}\n` : ''}➔ *TOTAL RECIBIDO: $${cut.totalReceived.toFixed(2)} MXN*

-----------------------------------
⚖️ *RESULTADO:*
${statusEmoji}
Diferencia: ${diffSign}${diffFormatted} MXN
`;
}
