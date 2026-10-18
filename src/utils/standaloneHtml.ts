import { FuelPrices, Pump } from '../types';

export function generateStandaloneHtml(currentPrices: FuelPrices, pumps: Pump[]): string {
  const pricesJson = JSON.stringify(currentPrices, null, 2);
  const pumpsJson = JSON.stringify(pumps, null, 2);

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Control de Cortes - Gasolinera (Offline 100%)</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
        body { background-color: #0b1120; color: #f8fafc; padding: 12px; padding-bottom: 50px; max-width: 680px; margin: 0 auto; }
        .header { background: #1e293b; padding: 14px 16px; border-bottom: 2px solid #334155; margin-bottom: 14px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .title { font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; justify-content: space-between; }
        .badge { background: #059669; color: white; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 14px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .card-title { font-size: 0.9rem; font-weight: 800; color: #38bdf8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .grid-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        label { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
        input, select { width: 100%; background: #0b1120; border: 1px solid #475569; color: white; padding: 9px 10px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; }
        input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); }
        input.num-in { text-align: center; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 1.1rem; color: #38bdf8; }
        
        /* Precios editables y persistentes */
        .prices-box { background: #131c31; border: 1px solid #293548; padding: 12px; border-radius: 12px; margin-bottom: 14px; }
        .prices-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .prices-tag { font-size: 0.7rem; color: #10b981; font-weight: 700; }
        .price-input-col { text-align: center; }
        .price-input-col label { font-size: 0.75rem; font-weight: 800; }
        .price-input-col input { font-size: 1.05rem; padding: 6px 4px; font-weight: 800; text-align: center; }
        .p-magna { color: #34d399; } 
        .p-prem { color: #f87171; } 
        .p-diesel { color: #fbbf24; }
        
        .pump-box { background: #0b1120; border: 1px solid #334155; border-radius: 10px; padding: 10px; margin-bottom: 10px; }
        .pump-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 800; font-size: 0.85rem; }
        .res-row { display: flex; justify-content: space-between; background: #1e293b; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; margin-top: 8px; font-family: ui-monospace, monospace; }
        
        .btn { background: #2563eb; color: white; border: none; padding: 12px 14px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; width: 100%; cursor: pointer; margin-top: 8px; transition: background 0.15s; }
        .btn:active { transform: scale(0.99); }
        .btn-green { background: #059669; } 
        .btn-green:hover { background: #047857; }
        .btn-red { background: #dc2626; margin-top: 10px; }
        .btn-red:hover { background: #b91c1c; }
        
        .banner { padding: 16px; border-radius: 14px; text-align: center; margin-top: 16px; font-weight: 800; transition: all 0.2s ease; }
        .banner-exact { background: #064e3b; border: 2px solid #10b981; color: #a7f3d0; }
        .banner-surplus { background: #1e3a8a; border: 2px solid #3b82f6; color: #bfdbfe; }
        .banner-short { background: #7f1d1d; border: 2px solid #ef4444; color: #fecaca; }
        .diff-val { font-size: 2.2rem; font-family: ui-monospace, monospace; margin-top: 4px; letter-spacing: -0.5px; }
        .diff-detail { font-size: 0.8rem; margin-top: 6px; opacity: 0.9; }

        .summary-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; text-align: center; }
        .summary-card { background: #0b1120; border: 1px solid #334155; padding: 8px; border-radius: 8px; }
        .summary-label { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .summary-val { font-size: 1.1rem; font-weight: 800; font-family: ui-monospace, monospace; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">
        <span>CORTES DE BOMBA</span>
        <span class="badge">OFFLINE 100%</span>
    </div>
</div>

<!-- PRECIOS EDITABLES CON PERSISTENCIA EN LOCALSTORAGE -->
<div class="prices-box">
    <div class="prices-header">
        <label style="margin:0; font-size:0.8rem; color:#38bdf8; text-transform:uppercase;">Precios por Litro ($ MXN)</label>
        <span class="prices-tag" id="price-saved-badge">✓ Guardado en memoria</span>
    </div>
    <div class="grid-3">
        <div class="price-input-col">
            <label class="p-magna">Magna</label>
            <input type="number" step="0.01" id="price-magna" class="num-in" oninput="updatePrices()">
        </div>
        <div class="price-input-col">
            <label class="p-prem">Premium</label>
            <input type="number" step="0.01" id="price-prem" class="num-in" oninput="updatePrices()">
        </div>
        <div class="price-input-col">
            <label class="p-diesel">Diesel</label>
            <input type="number" step="0.01" id="price-diesel" class="num-in" oninput="updatePrices()">
        </div>
    </div>
</div>

<!-- METADATOS DEL TURNO -->
<div class="card">
    <div class="grid-meta">
        <div>
            <label>Despachador</label>
            <input type="text" id="emp" placeholder="Nombre despachador" oninput="save()">
        </div>
        <div>
            <label>Turno</label>
            <input type="text" id="shift" placeholder="Ej: Mañana / Tarde" oninput="save()">
        </div>
    </div>
</div>

<!-- CONTADORES POR BOMBA -->
<div class="card">
    <div class="card-title">
        <span>Lectura de Contadores</span>
        <span style="font-size:0.75rem; color:#94a3b8; font-weight: normal;" id="pumps-count">8 bombas</span>
    </div>
    <div id="pumps-list"></div>
</div>

<!-- RESUMEN Y EFECTIVO -->
<div class="card">
    <div class="card-title">Dinero Entregado / Recolectado</div>
    <div class="grid-2">
        <div>
            <label>Efectivo ($)</label>
            <input type="number" step="0.01" id="pay-cash" class="num-in" oninput="calc()" placeholder="0.00">
        </div>
        <div>
            <label>Monedas ($)</label>
            <input type="number" step="0.01" id="pay-coins" class="num-in" oninput="calc()" placeholder="0.00">
        </div>
        <div>
            <label>Vales ($)</label>
            <input type="number" step="0.01" id="pay-vouchers" class="num-in" oninput="calc()" placeholder="0.00">
        </div>
        <div>
            <label>Tarjetas ($)</label>
            <input type="number" step="0.01" id="pay-cards" class="num-in" oninput="calc()" placeholder="0.00">
        </div>
    </div>

    <div class="summary-strip">
        <div class="summary-card">
            <div class="summary-label">Total Vendido Bombas</div>
            <div class="summary-val" style="color: #38bdf8;" id="sum-expected">$0.00</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Entregado</div>
            <div class="summary-val" style="color: #34d399;" id="sum-received">$0.00</div>
        </div>
    </div>
</div>

<!-- BANNER RESULTADO -->
<div id="banner" class="banner banner-exact">
    <div id="ban-title">CORTE CUADRADO EXACTO</div>
    <div id="ban-diff" class="diff-val">$0.00</div>
    <div id="ban-detail" class="diff-detail">Sin diferencias de efectivo</div>
</div>

<button class="btn btn-green" onclick="downloadReport()" style="margin-top: 16px;">Descargar Reporte (.TXT)</button>
<button class="btn btn-red" onclick="resetData()">Reiniciar Datos del Turno</button>

<script>
    // PRECIOS: Se cargan de localStorage ('gas_prices_v1') para persistir de corte a corte
    const defaultPrices = ${pricesJson};
    let prices = { ...defaultPrices };

    let pumps = ${pumpsJson};

    function loadPrices() {
        const savedPrices = localStorage.getItem('gas_prices_v1');
        if (savedPrices) {
            try {
                const parsed = JSON.parse(savedPrices);
                prices = { ...defaultPrices, ...parsed };
            } catch(e) {}
        }
        document.getElementById('price-magna').value = prices.Magna || 23.55;
        document.getElementById('price-prem').value = prices.Premium || 27.70;
        document.getElementById('price-diesel').value = prices.Diesel || 27.00;
    }

    function updatePrices() {
        prices.Magna = parseFloat(document.getElementById('price-magna').value) || 0;
        prices.Premium = parseFloat(document.getElementById('price-prem').value) || 0;
        prices.Diesel = parseFloat(document.getElementById('price-diesel').value) || 0;
        
        // Guardar persistente en localStorage campo 'gas_prices_v1'
        localStorage.setItem('gas_prices_v1', JSON.stringify(prices));

        const badge = document.getElementById('price-saved-badge');
        badge.innerText = '✓ Guardado en memoria';
        badge.style.color = '#10b981';

        render();
        calc();
    }

    function render() {
        const container = document.getElementById('pumps-list');
        container.innerHTML = '';
        pumps.forEach((p, i) => {
            let colorClass = p.fuel === 'Magna' ? 'p-magna' : p.fuel === 'Premium' ? 'p-prem' : 'p-diesel';
            const price = prices[p.fuel] || 0;
            container.innerHTML += \`
                <div class="pump-box">
                    <div class="pump-header">
                        <span>\${p.name}</span>
                        <span class="\${colorClass}">\${p.fuel} ($\${price.toFixed(2)})</span>
                    </div>
                    <div class="grid-2">
                        <div>
                            <label>Inicial</label>
                            <input type="number" step="0.001" id="init-\${i}" value="\${p.init}" oninput="updateVal(\${i})" class="num-in">
                        </div>
                        <div>
                            <label>Final</label>
                            <input type="number" step="0.001" id="final-\${i}" value="\${p.final}" oninput="updateVal(\${i})" class="num-in">
                        </div>
                    </div>
                    <div class="res-row">
                        <span>Litros: <b id="liters-\${i}">0.000</b> L</span>
                        <span>Total: $<b id="amt-\${i}">0.00</b></span>
                    </div>
                </div>
            \`;
        });
    }

    function updateVal(i) {
        pumps[i].init = parseFloat(document.getElementById(\`init-\${i}\`).value) || 0;
        pumps[i].final = parseFloat(document.getElementById(\`final-\${i}\`).value) || 0;
        calc();
    }

    function calc() {
        let totalExpected = 0;
        let totalLiters = 0;

        pumps.forEach((p, i) => {
            let liters = Math.max(0, p.final - p.init);
            let unitPrice = prices[p.fuel] || 0;
            let amt = liters * unitPrice;
            totalLiters += liters;
            totalExpected += amt;

            let lElem = document.getElementById(\`liters-\${i}\`);
            let aElem = document.getElementById(\`amt-\${i}\`);
            if (lElem) lElem.innerText = liters.toFixed(3);
            if (aElem) aElem.innerText = amt.toFixed(2);
        });

        let cash = parseFloat(document.getElementById('pay-cash').value) || 0;
        let coins = parseFloat(document.getElementById('pay-coins').value) || 0;
        let vouchers = parseFloat(document.getElementById('pay-vouchers').value) || 0;
        let cards = parseFloat(document.getElementById('pay-cards').value) || 0;

        let totalRec = cash + coins + vouchers + cards;
        let diff = totalRec - totalExpected;

        document.getElementById('sum-expected').innerText = '$' + totalExpected.toFixed(2);
        document.getElementById('sum-received').innerText = '$' + totalRec.toFixed(2);

        const ban = document.getElementById('banner');
        const title = document.getElementById('ban-title');
        const diffElem = document.getElementById('ban-diff');
        const detailElem = document.getElementById('ban-detail');

        diffElem.innerText = '$' + Math.abs(diff).toFixed(2);

        if (Math.abs(diff) < 0.05) {
            ban.className = 'banner banner-exact';
            title.innerText = 'CORTE CUADRADO EXACTO';
            detailElem.innerText = 'Efectivo recibido coincide exactamente con contadores';
        } else if (diff > 0) {
            ban.className = 'banner banner-surplus';
            title.innerText = 'SOBRANTE EN CAJA';
            detailElem.innerText = 'Hay $' + diff.toFixed(2) + ' adicionales respecto a contadores';
        } else {
            ban.className = 'banner banner-short';
            title.innerText = 'FALTANTE EN CAJA';
            detailElem.innerText = 'Faltan $' + Math.abs(diff).toFixed(2) + ' para cubrir las ventas registradas';
        }

        save();
    }

    function save() {
        const data = {
            pumps,
            emp: document.getElementById('emp').value,
            shift: document.getElementById('shift').value,
            cash: document.getElementById('pay-cash').value,
            coins: document.getElementById('pay-coins').value,
            vouchers: document.getElementById('pay-vouchers').value,
            cards: document.getElementById('pay-cards').value
        };
        localStorage.setItem('gas_data_offline_v1', JSON.stringify(data));
    }

    function load() {
        loadPrices();
        const saved = localStorage.getItem('gas_data_offline_v1');
        if (saved) {
            try {
                const d = JSON.parse(saved);
                if (d.pumps && Array.isArray(d.pumps) && d.pumps.length > 0) pumps = d.pumps;
                if (d.emp) document.getElementById('emp').value = d.emp;
                if (d.shift) document.getElementById('shift').value = d.shift;
                if (d.cash) document.getElementById('pay-cash').value = d.cash;
                if (d.coins) document.getElementById('pay-coins').value = d.coins;
                if (d.vouchers) document.getElementById('pay-vouchers').value = d.vouchers;
                if (d.cards) document.getElementById('pay-cards').value = d.cards;
            } catch(e) {}
        }
    }

    function downloadReport() {
        let emp = document.getElementById('emp').value || 'Sin nombre';
        let shift = document.getElementById('shift').value || 'General';
        let now = new Date().toLocaleString('es-MX');

        let totL = 0, totA = 0;
        let details = '';
        pumps.forEach(p => {
            let l = Math.max(0, p.final - p.init);
            let unitP = prices[p.fuel] || 0;
            let a = l * unitP;
            totL += l; totA += a;
            details += \`  \${p.name.padEnd(20)} [\${p.fuel} @ $\${unitP.toFixed(2)}]: \${l.toFixed(3)} L = $\${a.toFixed(2)}\\n\`;
        });

        let cash = parseFloat(document.getElementById('pay-cash').value) || 0;
        let coins = parseFloat(document.getElementById('pay-coins').value) || 0;
        let vouchers = parseFloat(document.getElementById('pay-vouchers').value) || 0;
        let cards = parseFloat(document.getElementById('pay-cards').value) || 0;
        let totRec = cash + coins + vouchers + cards;
        let diff = totRec - totA;

        let estado = Math.abs(diff) < 0.05 ? 'CUADRADO EXACTO' : diff > 0 ? \`SOBRANTE (+$\${diff.toFixed(2)})\` : \`FALTANTE (-$\${Math.abs(diff).toFixed(2)})\`;

        let txt = \`===========================================
REPORTE DE CORTE DE VENTAS - GASOLINERA
===========================================
Fecha y Hora:  \${now}
Despachador:   \${emp}
Turno:         \${shift}
-------------------------------------------
PRECIOS VIGENTES:
  Magna:   $\${(prices.Magna||0).toFixed(2)} / L
  Premium: $\${(prices.Premium||0).toFixed(2)} / L
  Diesel:  $\${(prices.Diesel||0).toFixed(2)} / L
-------------------------------------------
LECTURA DE BOMBAS:
\${details}-------------------------------------------
TOTAL VENDIDO:     \${totL.toFixed(3)} Litros
TOTAL ESPERADO:    $\${totA.toFixed(2)} MXN
-------------------------------------------
DINERO ENTREGADO:
  Efectivo:        $\${cash.toFixed(2)}
  Monedas:         $\${coins.toFixed(2)}
  Vales:           $\${vouchers.toFixed(2)}
  Tarjetas:        $\${cards.toFixed(2)}
  TOTAL RECIBIDO:  $\${totRec.toFixed(2)} MXN
-------------------------------------------
RESULTADO DE ARQUEO:
  ESTADO: \${estado}
  DIFERENCIA: $\${diff.toFixed(2)} MXN
===========================================\`;

        let blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        let safeEmp = emp.replace(/[^a-zA-Z0-9]/g, '_');
        a.download = \`Corte_Gasolinera_\${safeEmp}_\${new Date().toISOString().slice(0,10)}.txt\`;
        a.click();
    }

    function resetData() {
        if (confirm("¿Limpiar las lecturas y montos del turno actual? (Los precios se conservarán)")) {
            pumps.forEach(p => { p.init = 0; p.final = 0; });
            document.getElementById('pay-cash').value = '';
            document.getElementById('pay-coins').value = '';
            document.getElementById('pay-vouchers').value = '';
            document.getElementById('pay-cards').value = '';
            save();
            render();
            calc();
        }
    }

    window.onload = function() {
        load();
        render();
        calc();
    };
</script>

</body>
</html>`;
}
