import React, { useState, useEffect } from "react";
import { MessageCircle, X, Shield } from "lucide-react";
import { useLocation } from "../contexts/LocationContext";

export const FloatingWhatsapp: React.FC = () => {
  const { country, getWhatsappLink } = useLocation();

  return (
    <a
      href={getWhatsappLink("Olá, estou no portal da Ventimob e gostaria de atendimento.")}
      target="_blank"
      rel="noreferrer"
      aria-label={`Falar no WhatsApp (${country.name})`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-700" />
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        Fale conosco ({country.code})
      </span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
};

export const CookieBanner: React.FC = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const hasConsent = localStorage.getItem("vtm_cookie_consent");
    if (!hasConsent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vtm_cookie_consent", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#087FF5] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            A <strong>Ventimob</strong> valoriza sua privacidade e utiliza cookies estritamente necessários e métricas de navegação para aprimorar sua experiência e recomendar imóveis pertinentes de acordo com as diretrizes da <strong>LGPD</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-xl bg-[#062B5C] text-white text-xs font-bold hover:bg-[#087FF5] transition-colors"
          >
            Aceitar e Continuar
          </button>
          <button
            onClick={() => setAccepted(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
