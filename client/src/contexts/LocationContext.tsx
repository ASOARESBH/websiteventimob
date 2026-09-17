import React, { createContext, useContext, useEffect, useState } from "react";

export type CountryCode = "BR" | "PY" | "PA" | "CR" | "ALL";
export type Language = "pt-BR" | "es-PY" | "en-US";

interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  phoneCode: string;
  currency: string;
  symbol: string;
  whatsapp: string;
  defaultLang: Language;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  BR: {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    phoneCode: "+55",
    currency: "BRL",
    symbol: "R$",
    whatsapp: "+5511999998888",
    defaultLang: "pt-BR",
  },
  PY: {
    code: "PY",
    name: "Paraguay",
    flag: "🇵🇾",
    phoneCode: "+595",
    currency: "PYG",
    symbol: "₲",
    whatsapp: "+595981234567",
    defaultLang: "es-PY",
  },
  PA: {
    code: "PA",
    name: "Panamá",
    flag: "🇵🇦",
    phoneCode: "+507",
    currency: "USD",
    symbol: "$",
    whatsapp: "+50760000000",
    defaultLang: "es-PY",
  },
  CR: {
    code: "CR",
    name: "Costa Rica",
    flag: "🇨🇷",
    phoneCode: "+506",
    currency: "USD",
    symbol: "$",
    whatsapp: "+50680000000",
    defaultLang: "es-PY",
  },
  ALL: {
    code: "ALL",
    name: "Internacional",
    flag: "🌎",
    phoneCode: "+",
    currency: "BRL",
    symbol: "R$",
    whatsapp: "+5511999998888",
    defaultLang: "pt-BR",
  },
};

interface LocationContextType {
  country: CountryConfig;
  setCountryCode: (code: CountryCode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  formatPrice: (amount: number | string, itemCurrency?: string) => string;
  getWhatsappLink: (text: string, customNumber?: string) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCodeState] = useState<CountryCode>(() => {
    const saved = localStorage.getItem("vtm_country");
    return (saved as CountryCode) || "BR";
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("vtm_lang");
    if (saved) return saved as Language;
    // Detecção automática suave baseada no navegador
    const nav = typeof navigator !== "undefined" ? navigator.language : "pt-BR";
    if (nav.toLowerCase().startsWith("es")) return "es-PY";
    return "pt-BR";
  });

  const country = COUNTRIES[countryCode] || COUNTRIES.BR;

  const setCountryCode = (code: CountryCode) => {
    setCountryCodeState(code);
    localStorage.setItem("vtm_country", code);
    if (code === "PY" || code === "PA" || code === "CR") {
      setLanguageState("es-PY");
      localStorage.setItem("vtm_lang", "es-PY");
    } else if (code === "BR") {
      setLanguageState("pt-BR");
      localStorage.setItem("vtm_lang", "pt-BR");
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("vtm_lang", lang);
  };

  const formatPrice = (amount: number | string, itemCurrency?: string) => {
    const val = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(val)) return "-";

    const curr = itemCurrency || country.currency;
    if (curr === "PYG") {
      return `₲ ${val.toLocaleString("es-PY", { maximumFractionDigits: 0 })}`;
    }
    if (curr === "USD") {
      return `$ ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getWhatsappLink = (text: string, customNumber?: string) => {
    const targetNumber = (customNumber || country.whatsapp || "+5511999998888").replace(/\D/g, "");
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <LocationContext.Provider
      value={{
        country,
        setCountryCode,
        language,
        setLanguage,
        formatPrice,
        getWhatsappLink,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
