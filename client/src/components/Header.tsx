import React, { useState } from "react";
import { Link, useLocation as useWouterLocation } from "wouter";
import { VentimobLogo } from "./VentimobLogo";
import { useLocation, COUNTRIES, CountryCode } from "../contexts/LocationContext";
import {
  Globe,
  Menu,
  X,
  User,
  Building2,
  Briefcase,
  Smartphone,
  ChevronDown,
  Shield,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";

export const Header: React.FC = () => {
  const [locationPath] = useWouterLocation();
  const { country, setCountryCode, language, setLanguage } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Comprar", href: "/busca?purpose=comprar" },
    { label: "Alugar", href: "/busca?purpose=alugar" },
    { label: "Imóveis", href: "/busca" },
    { label: "Corretores", href: "/corretores" },
    { label: "Imobiliárias", href: "/imobiliarias" },
    { label: "Para Corretores", href: "/para-corretores" },
    { label: "Para Imobiliárias", href: "/para-imobiliarias" },
    { label: "Baixe o App", href: "/#app-download" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Ventimob */}
          <Link href="/">
            <a className="flex items-center focus:outline-hidden">
              <VentimobLogo size="md" />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-700">
            {navLinks.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`transition-colors hover:text-[#087FF5] ${
                    locationPath === item.href ? "text-[#087FF5] font-semibold" : ""
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}

            <div className="h-4 w-px bg-slate-200" />

            <Link href="/para-corretores">
              <a className="text-slate-600 hover:text-[#062B5C] font-semibold flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#087FF5]" />
                Para Corretores
              </a>
            </Link>
          </nav>

          {/* Actions: Country Selector + ERP Login */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Seletor de País / Idioma */}
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                title="Alterar país ou idioma"
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span>{country.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {countryDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setCountryDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Selecione o País
                  </div>
                  {Object.values(COUNTRIES).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountryCode(c.code as CountryCode);
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
                        country.code === c.code ? "text-[#087FF5] font-bold bg-blue-50/50" : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.currency} ({c.symbol})
                      </span>
                    </button>
                  ))}

                  <div className="px-3.5 pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Idioma:</span>
                    <button
                      onClick={() => setLanguage(language === "pt-BR" ? "es-PY" : "pt-BR")}
                      className="text-[#087FF5] font-bold hover:underline"
                    >
                      {language === "pt-BR" ? "🇧🇷 Português" : "🇵🇾 Español"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Painel Central / CMS rápido */}
            <Link href="/admin">
              <a
                title="Painel de Administração e Conteúdo Centralizado"
                className="p-2 text-slate-400 hover:text-[#062B5C] rounded-lg transition-colors hover:bg-slate-100"
              >
                <Shield className="w-4 h-4" />
              </a>
            </Link>

            {/* Login / Acesso Corretor */}
            <Link href="/login-corretor">
              <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#062B5C] bg-slate-100 hover:bg-slate-200/80 transition-all">
                <User className="w-3.5 h-3.5 text-[#087FF5]" />
                Área do Corretor
              </a>
            </Link>

            {/* Acesso ao ERP */}
            <a
              href="https://erp.ventimob.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#062B5C] to-[#087FF5] hover:opacity-95 shadow-xs transition-all"
            >
              <span>Entrar no ERP</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <span className="text-sm">{country.flag}</span>
              <span>{country.code}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#087FF5]"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#087FF5]"
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login-corretor">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#062B5C] bg-slate-100"
              >
                <User className="w-4 h-4 text-[#087FF5]" />
                Área do Corretor
              </a>
            </Link>

            <a
              href="https://erp.ventimob.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#062B5C] to-[#087FF5]"
            >
              Acessar ERP / APP
            </a>

            <Link href="/admin">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-slate-400 py-1"
              >
                Painel Administrativo & CMS
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
