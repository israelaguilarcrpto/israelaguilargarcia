import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, MessageCircle, ExternalLink, Share2 } from 'lucide-react';
import { ShiftCutRecord } from '../types';
import { encodeCutToUrl, generateQrCodeDataUrl, formatWhatsAppMessage } from '../utils/shareUtils';

interface ShareModalProps {
  cut: ShiftCutRecord;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ cut, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  useEffect(() => {
    const url = encodeCutToUrl(cut);
    setShareUrl(url);

    generateQrCodeDataUrl(url).then((dataUrl) => {
      setQrCodeUrl(dataUrl);
    });
  }, [cut]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Corte de Caja - ${cut.emp || 'Gasolinera'}`,
          text: `Corte de bomba de ${cut.emp || 'Turno'} (${cut.shift || 'General'}): $${cut.totalExpected.toFixed(2)} vendidos.`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendWhatsApp = () => {
    const text = formatWhatsAppMessage(cut) + `\n🔗 *Ver en app:* ${shareUrl}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyWhatsAppText = async () => {
    const text = formatWhatsAppMessage(cut) + `\n🔗 *Ver en app:* ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2500);
    } catch {
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-base text-white">
              Compartir Enlace Dinámico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          Cualquier persona (supervisor, relevo o cajero) puede abrir este enlace o escanear el código QR en su celular para ver este corte con todas las lecturas y cuadre.
        </p>

        {/* QR Code view */}
        <div className="my-4 flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-inner">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Código QR del corte de caja"
              className="w-48 h-48 object-contain rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-600 font-mono text-xs">
              Generando código QR...
            </div>
          )}
          <span className="text-[11px] font-bold text-slate-700 mt-2 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            Escanea con la cámara de cualquier móvil
          </span>
        </div>

        {/* Link input */}
        <div className="space-y-2 mb-4">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Enlace Dinámico Directo
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-sky-300 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Quick Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSendWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Abrir en WhatsApp</span>
          </button>

          <button
            onClick={handleCopyWhatsAppText}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition active:scale-95"
          >
            {whatsappCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{whatsappCopied ? 'Texto Copiado' : 'Copiar Texto'}</span>
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>Compartir por Menú del Teléfono (AirDrop / Mensajes / etc.)</span>
          </button>
        )}
      </div>
    </div>
  );
};
