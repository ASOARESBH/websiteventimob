import React from "react";
import { Link } from "wouter";
import { VentimobLogo } from "./VentimobLogo";
import { useLocation, COUNTRIES, CountryCode } from "../contexts/LocationContext";
import {
  Smartphone,
  ShieldCheck,
  MessageCircle,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { country, setCountryCode, getWhatsappLink } = useLocation();

  return (
    <footer className="bg-[#062B5C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Coluna 1: Branding & Proposta */}
          <div className="lg:col-span-2 space-y-4">
            <VentimobLogo variant="white" size="lg" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              A plataforma imobiliária híbrida que conecta quem busca imóveis aos melhores corretores e imobiliárias do Brasil e América Latina, impulsionada pelo ERP/APP Ventimob.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Operação ativa:
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 text-xs text-white">
                  🇧🇷 Brasil
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 text-xs text-white">
                  🇵🇾 Paraguay
                </span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Navegação Pública */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Buscador de Imóveis
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/busca?purpose=comprar">
                  <a className="hover:text-cyan-400 transition-colors">Comprar Imóvel</a>
                </Link>
              </li>
              <li>
                <Link href="/busca?purpose=alugar">
                  <a className="hover:text-cyan-400 transition-colors">Alugar Imóvel</a>
                </Link>
              </li>
              <li>
                <Link href="/busca?type=apartamento">
                  <a className="hover:text-cyan-400 transition-colors">Apartamentos</a>
                </Link>
              </li>
              <li>
                <Link href="/busca?type=casa">
                  <a className="hover:text-cyan-400 transition-colors">Casas em Condomínio</a>
                </Link>
              </li>
              <li>
                <Link href="/busca?type=terreno">
                  <a className="hover:text-cyan-400 transition-colors">Terrenos e Lotes</a>
                </Link>
              </li>
              <li>
                <Link href="/busca?type=comercial">
                  <a className="hover:text-cyan-400 transition-colors">Imóveis Comerciais</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Profissionais & Ecossistema */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Ecossistema Ventimob
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/corretores">
                  <a className="hover:text-cyan-400 transition-colors">Encontrar Corretor</a>
                </Link>
              </li>
              <li>
                <Link href="/imobiliarias">
                  <a className="hover:text-cyan-400 transition-colors">Encontrar Imobiliária</a>
                </Link>
              </li>
              <li>
                <Link href="/para-corretores">
                  <a className="hover:text-cyan-400 transition-colors">Para Corretores</a>
                </Link>
              </li>
              <li>
                <Link href="/para-imobiliarias">
                  <a className="hover:text-cyan-400 transition-colors">Para Imobiliárias</a>
                </Link>
              </li>
              <li>
                <a
                  href="https://erp.ventimob.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                >
                  ERP Ventimob
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/login-corretor">
                  <a className="hover:text-cyan-400 transition-colors">Área do Profissional</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Atendimento Multipaís */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atendimento ({country.name})
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={getWhatsappLink("Olá, gostaria de saber mais sobre a Ventimob.")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: {country.whatsapp}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contato@ventimob.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
                <Link href="/privacidade-lgpd">
                  <a className="hover:text-white">Conformidade LGPD</a>
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Alterar país de navegação:
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {Object.values(COUNTRIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCountryCode(c.code as CountryCode)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      country.code === c.code
                        ? "bg-[#087FF5] text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Linha inferior de direitos e termos */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Ventimob Plataforma Imobiliária. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-6">
            <Link href="/termos">
              <a className="hover:text-slate-300">Termos de Uso</a>
            </Link>
            <Link href="/privacidade-lgpd">
              <a className="hover:text-slate-300">Política de Privacidade & LGPD</a>
            </Link>
            <Link href="/admin">
              <a className="hover:text-slate-300 font-semibold text-slate-400">CMS / Admin</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
