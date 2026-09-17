import React, { useState } from "react";
import { Link, useLocation as useWouterLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation, COUNTRIES } from "../contexts/LocationContext";
import { PropertyCard } from "../components/PropertyCard";
import {
  Search,
  MapPin,
  Home,
  Building,
  Key,
  DollarSign,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  Building2,
  ShieldCheck,
  Star,
  QrCode,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const [, setLocation] = useWouterLocation();
  const { country, formatPrice } = useLocation();

  // Estados da barra de busca do Hero
  const [purpose, setPurpose] = useState<"comprar" | "alugar">("comprar");
  const [propertyType, setPropertyType] = useState<string>("todos");
  const [queryLocation, setQueryLocation] = useState<string>("");

  // Queries tRPC
  const featuredQuery = trpc.properties.getFeatured.useQuery({ limit: 6 });
  const brokersQuery = trpc.brokers.list.useQuery({ countryCode: country.code });
  const agenciesQuery = trpc.agencies.list.useQuery({ countryCode: country.code });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set("purpose", purpose);
    if (propertyType && propertyType !== "todos") params.set("type", propertyType);
    if (queryLocation.trim()) params.set("query", queryLocation.trim());
    if (country.code !== "ALL") params.set("countryCode", country.code);
    setLocation(`/busca?${params.toString()}`);
  };

  const quickFilter = (typeKey: string) => {
    const params = new URLSearchParams();
    params.set("purpose", purpose);
    if (typeKey !== "todos") params.set("type", typeKey);
    if (country.code !== "ALL") params.set("countryCode", country.code);
    setLocation(`/busca?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. HERO DE BUSCA */}
      <section className="relative bg-gradient-to-br from-[#062B5C] via-[#0A3D7C] to-[#087FF5] text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Elementos visuais de fundo em degradê e linhas de fluxo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-400 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-semibold mb-6">
            <span className="text-base">{country.flag}</span>
            <span>Plataforma Imobiliária Híbrida Internacional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Encontre seu próximo imóvel.
          </h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Casas, apartamentos, terrenos e empreendimentos comerciais conectados aos melhores corretores e imobiliárias.
          </p>

          {/* Card Principal da Busca Universal */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-800 text-left border border-white/30 max-w-4xl mx-auto">
            {/* Abas Comprar / Alugar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setPurpose("comprar")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  purpose === "comprar"
                    ? "bg-[#062B5C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setPurpose("alugar")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  purpose === "alugar"
                    ? "bg-[#062B5C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Alugar
              </button>
              <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
                Pesquise no <strong>{country.name}</strong> ou altere no menu superior
              </span>
            </div>

            {/* Formulário com os campos principais */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* O que você procura? */}
              <div className="md:col-span-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 hover:border-[#087FF5] transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  🔎 O que você procura?
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa / Sobrado</option>
                  <option value="terreno">Terreno / Lote</option>
                  <option value="comercial">Comercial / Sala</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="lancamento">Lançamento</option>
                </select>
              </div>

              {/* Onde? */}
              <div className="md:col-span-5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 hover:border-[#087FF5] transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  📍 Onde você quer morar ou investir?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={queryLocation}
                    onChange={(e) => setQueryLocation(e.target.value)}
                    placeholder="Cidade, bairro, código (ex: Curitiba, Itaim, Asunción)"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Botão de Busca */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-[#087FF5] to-[#12B8F2] hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>BUSCAR IMÓVEIS</span>
                </button>
              </div>
            </form>

            {/* 3. BUSCA RÁPIDA / TAGS */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Filtros rápidos:</span>
              <button
                type="button"
                onClick={() => quickFilter("apartamento")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#087FF5] text-xs font-semibold text-slate-600 transition-colors"
              >
                Apartamentos
              </button>
              <button
                type="button"
                onClick={() => quickFilter("casa")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#087FF5] text-xs font-semibold text-slate-600 transition-colors"
              >
                Casas
              </button>
              <button
                type="button"
                onClick={() => quickFilter("terreno")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#087FF5] text-xs font-semibold text-slate-600 transition-colors"
              >
                Terrenos
              </button>
              <button
                type="button"
                onClick={() => quickFilter("comercial")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#087FF5] text-xs font-semibold text-slate-600 transition-colors"
              >
                Comerciais
              </button>
              <button
                type="button"
                onClick={() => quickFilter("lancamento")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#087FF5] text-xs font-semibold text-slate-600 transition-colors"
              >
                Lançamentos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IMÓVEIS EM DESTAQUE */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087FF5] mb-2">
                <Sparkles className="w-4 h-4" />
                Seleção Exclusiva Ventimob
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
                Imóveis em Destaque
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Oportunidades verificadas e cadastradas diretamente pelos corretores parceiros.
              </p>
            </div>

            <Link href="/busca">
              <a className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087FF5] hover:text-[#062B5C] group">
                <span>Ver todos os imóveis</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </div>

          {featuredQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredQuery.data?.items.map((prop: any) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. EXPLORAR POR LOCALIZAÇÃO */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
              Explore Imóveis por Região
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Conexões estratégicas nos principais centros urbanos do Brasil e do Paraguai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: "São Paulo",
                country: "Brasil",
                flag: "🇧🇷",
                img: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=600&q=80",
                desc: "Itaim Bibi, Jardins, Vila Madalena",
                query: "São Paulo",
              },
              {
                city: "Curitiba",
                country: "Brasil",
                flag: "🇧🇷",
                img: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80",
                desc: "Ecoville, Batel, Graciosa",
                query: "Curitiba",
              },
              {
                city: "Asunción",
                country: "Paraguay",
                flag: "🇵🇾",
                img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
                desc: "Ykua Satí, Villa Morra, Santa Teresa",
                query: "Asunción",
              },
              {
                city: "Belo Horizonte",
                country: "Brasil",
                flag: "🇧🇷",
                img: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=600&q=80",
                desc: "Savassi, Lourdes, Belvedere",
                query: "Belo Horizonte",
              },
            ].map((loc) => (
              <Link key={loc.city} href={`/busca?query=${encodeURIComponent(loc.query)}`}>
                <a className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block">
                  <img
                    src={loc.img}
                    alt={loc.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062B5C] via-[#062B5C]/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 flex items-center gap-1 mb-1">
                      <span>{loc.flag}</span> {loc.country}
                    </span>
                    <h3 className="text-xl font-black">{loc.city}</h3>
                    <p className="text-xs text-blue-100/90 mt-0.5">{loc.desc}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ENCONTRE SEU CORRETOR & 7. ENCONTRE UMA IMOBILIÁRIA */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          {/* Corretores */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-1">
                  Canais Profissionais
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
                  Encontre seu Corretor de Confiança
                </h2>
                <p className="text-slate-500 text-sm">
                  Atendimento especializado para guiar sua decisão com segurança jurídica e precisão.
                </p>
              </div>

              <Link href="/corretores">
                <a className="text-sm font-bold text-[#087FF5] hover:underline flex items-center gap-1">
                  Ver todos os corretores <ChevronRight className="w-4 h-4" />
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {brokersQuery.data?.slice(0, 3).map((broker) => (
                <div
                  key={broker.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={broker.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"}
                      alt={broker.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#087FF5]"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{broker.name}</h3>
                      <p className="text-xs text-[#087FF5] font-semibold">{broker.creci}</p>
                      <p className="text-xs text-slate-500">{broker.city} - {broker.state}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {broker.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{broker.rating}</span>
                      <span className="text-slate-400 font-normal">({broker.dealsCount} negócios)</span>
                    </div>

                    <Link href={`/corretor/${broker.slug}`}>
                      <a className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#062B5C] hover:text-white text-xs font-bold text-[#062B5C] transition-colors">
                        Ver Perfil
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imobiliárias */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-1">
                  Empresas Credenciadas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
                  Imobiliárias em Destaque
                </h2>
                <p className="text-slate-500 text-sm">
                  Grandes carteiras de imóveis e equipes estruturadas conectadas ao ecossistema Ventimob.
                </p>
              </div>

              <Link href="/imobiliarias">
                <a className="text-sm font-bold text-[#087FF5] hover:underline flex items-center gap-1">
                  Ver todas as imobiliárias <ChevronRight className="w-4 h-4" />
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agenciesQuery.data?.slice(0, 2).map((agency) => (
                <div
                  key={agency.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <img
                    src={agency.logoUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80"}
                    alt={agency.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-lg">{agency.name}</h3>
                      <span className="text-xs text-slate-400 font-mono">{agency.creci}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{agency.city} - {agency.state}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {agency.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Equipe com {agency.teamSize} profissionais
                      </span>
                      <Link href={`/imobiliaria/${agency.slug}`}>
                        <a className="text-xs font-bold text-[#087FF5] hover:underline flex items-center gap-1">
                          Ver Imóveis <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO "VOCÊ É CORRETOR?" & 9. SEÇÃO PARA IMOBILIÁRIAS */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Card Corretor */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#062B5C] to-[#0A438A] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" /> Você é Corretor?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-3">
                Transforme seus imóveis em novas oportunidades.
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Gerencie sua carteira, receba leads qualificados com identificação de código e opere através do aplicativo e ERP oficial Ventimob.
              </p>
              <ul className="space-y-2.5 text-xs text-blue-100 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Página pública exclusiva para compartilhar com clientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Contatos diretos no WhatsApp com mensagem pré-formatada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sincronização imediata entre ERP e o buscador universal</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/para-corretores">
                <a className="text-center px-5 py-3 rounded-xl bg-[#087FF5] hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors">
                  Quero ser corretor Ventimob
                </a>
              </Link>
              <Link href="/login-corretor">
                <a className="text-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors">
                  Entrar na plataforma
                </a>
              </Link>
            </div>
          </div>

          {/* Card Imobiliária */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-[#062B5C] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" /> Imobiliárias
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-3">
                Sua imobiliária pode ir mais longe.
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Centralize toda a sua equipe de corretores, estoque de imóveis, esteira de leads e inteligência comercial em um só ecossistema moderno.
              </p>
              <ul className="space-y-2.5 text-xs text-blue-100 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Distribuição inteligente de leads por região e corretor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Página institucional da imobiliária com catálogo dinâmico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Preparado para múltiplos países (Brasil e Paraguai)</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/para-imobiliarias">
                <a className="text-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#087FF5] to-[#12B8F2] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity">
                  Conheça para Imobiliárias
                </a>
              </Link>
              <a
                href="https://erp.ventimob.com"
                target="_blank"
                rel="noreferrer"
                className="text-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors"
              >
                Conectar ERP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. DOWNLOAD DO APP VENTIMOB COM QR CODE */}
      <section id="app-download" className="py-20 bg-slate-100 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#062B5C] to-[#0A438A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Smartphone className="w-4 h-4" /> Mobilidade Total
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Tenha a Ventimob no seu celular.
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8">
              Encontre imóveis, salve seus favoritos, acompanhe oportunidades em tempo real e converse com corretores de onde estiver.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* Botão App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-2xl hover:bg-slate-900 transition-colors shadow-md border border-white/10"
              >
                <span className="text-2xl"></span>
                <div className="text-left">
                  <span className="text-[10px] uppercase text-slate-400 block leading-none">Disponível na</span>
                  <span className="text-sm font-bold leading-tight">App Store</span>
                </div>
              </a>

              {/* Botão Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-2xl hover:bg-slate-900 transition-colors shadow-md border border-white/10"
              >
                <span className="text-2xl">▶</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase text-slate-400 block leading-none">Disponível no</span>
                  <span className="text-sm font-bold leading-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-6 rounded-2xl text-slate-800 flex flex-col items-center text-center shadow-xl border border-white/20 shrink-0">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3">
              <QrCode className="w-32 h-32 text-[#062B5C]" />
            </div>
            <span className="text-xs font-bold text-[#062B5C] uppercase tracking-wider">
              Aponte a câmera
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Baixe o app oficial Ventimob
            </span>
          </div>
        </div>
      </section>

      {/* 11. BENEFÍCIOS VENTIMOB */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-2">
              Diferenciais da PropTech
            </span>
            <h2 className="text-3xl font-extrabold text-[#062B5C]">
              Por que escolher a Ventimob?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Não somos apenas mais um classificado. Somos uma plataforma digital integrada para o mercado imobiliário moderno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#087FF5] transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#087FF5] flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Busca Universal Rápida</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encontre o imóvel ideal em poucos segundos sem obrigatoriedade de cadastro inicial, com filtros precisos por dormitórios, vagas e faixas de preço.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#087FF5] transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-[#12B8F2] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Corretores Verificados</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada anúncio é gerido por profissionais com registro CRECI ou habilitação regional, garantindo transparência contratual e suporte do início ao fim.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#087FF5] transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ecossistema ERP & Multipaís</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integração técnica com ERP para sincronização de carteiras e expansão contínua entre Brasil, Paraguai e América Central.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ (PERGUNTAS FREQUENTES) */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Tire suas dúvidas sobre o funcionamento do portal e ecossistema Ventimob.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "A Ventimob é uma imobiliária tradicional?",
                a: "Não. A Ventimob é uma plataforma digital imobiliária híbrida. Nós conectamos compradores, locatários, corretores autônomos e imobiliárias através de tecnologia avançada, buscador universal e aplicativo próprio.",
              },
              {
                q: "Preciso pagar para buscar imóveis no portal?",
                a: "Não. O acesso para clientes que desejam pesquisar imóveis para compra ou locação é totalmente gratuito e não exige login imediato.",
              },
              {
                q: "Como o corretor anuncia seus imóveis na Ventimob?",
                a: "O corretor ou imobiliária administra seus anúncios pelo ERP/APP Ventimob. Os dados publicados no ERP sincronizam automaticamente via API com o portal público.",
              },
              {
                q: "Posso pesquisar imóveis no Brasil e no Paraguai?",
                a: "Sim. A arquitetura da Ventimob é internacional desde a concepção. Você pode alternar o país no topo da página ou navegar livremente entre imóveis brasileiros e paraguaios.",
              },
              {
                q: "Como entro em contato com o corretor responsável?",
                a: "Em cada página ou card de imóvel, há botões diretos para WhatsApp e formulário de mensagem com preenchimento automático do código do imóvel.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs open:shadow-md transition-all cursor-pointer"
              >
                <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#087FF5] font-mono text-xl group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
