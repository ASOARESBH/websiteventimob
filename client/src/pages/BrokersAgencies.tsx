import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation } from "../contexts/LocationContext";
import { PropertyCard } from "../components/PropertyCard";
import {
  User,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Star,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ==========================================
// LISTA DE TODOS OS CORRETORES
// ==========================================
export function BrokersListPage() {
  const { country } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const brokersQuery = trpc.brokers.list.useQuery({
    countryCode: country.code === "ALL" ? undefined : country.code,
    search: searchTerm || undefined,
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-1">
            Rede de Especialistas
          </span>
          <h1 className="text-3xl font-extrabold text-[#062B5C]">
            Buscar um Corretor de Imóveis
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Profissionais credenciados e prontos para assessorar sua compra ou venda no {country.name}.
          </p>
        </div>

        {/* Barra de Busca de Corretor */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs max-w-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, cidade, CRECI ou especialidade..."
            className="w-full text-sm bg-transparent focus:outline-hidden"
          />
        </div>

        {/* Grid de Corretores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokersQuery.data?.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
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

                <div className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-[#087FF5] text-[11px] font-semibold mb-3">
                  {broker.specialty}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {broker.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{broker.rating}</span>
                </div>
                <Link href={`/corretor/${broker.slug}`}>
                  <a className="px-4 py-2 rounded-xl bg-[#062B5C] hover:bg-[#087FF5] text-white text-xs font-bold transition-colors">
                    Ver Perfil & Imóveis
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PÁGINA PÚBLICA INDIVIDUAL DO CORRETOR
// ==========================================
export function BrokerDetailPage() {
  const [, params] = useRoute("/corretor/:slug");
  const slug = params?.slug || "";
  const { getWhatsappLink } = useLocation();

  const brokerQuery = trpc.brokers.getBySlug.useQuery({ slug }, { enabled: !!slug });
  const data = brokerQuery.data;

  if (brokerQuery.isLoading) {
    return <div className="max-w-6xl mx-auto p-12 text-center">Carregando perfil do corretor...</div>;
  }

  if (!data?.broker) {
    return <div className="max-w-xl mx-auto p-12 text-center font-bold">Corretor não encontrado.</div>;
  }

  const { broker, properties } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header do Corretor */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={broker.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=350&q=80"}
            alt={broker.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#087FF5] shadow-md"
          />

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087FF5] text-xs font-bold">
                {broker.creci}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {broker.city} - {broker.state}
              </span>
            </div>

            <h1 className="text-3xl font-black text-[#062B5C]">{broker.name}</h1>
            <p className="text-sm font-semibold text-[#087FF5]">{broker.specialty}</p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {broker.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={getWhatsappLink(
                  `Olá ${broker.name}, vi seu perfil na Ventimob e gostaria de atendimento.`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>

              <a
                href={`mailto:${broker.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{broker.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Carteira de Imóveis do Corretor */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#062B5C]">
              Imóveis de {broker.name} ({properties.length})
            </h2>
            <span className="text-xs text-slate-500">
              Imóveis sincronizados diretamente pelo ERP Ventimob
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// LISTA DE IMOBILIÁRIAS
// ==========================================
export function AgenciesListPage() {
  const { country } = useLocation();
  const agenciesQuery = trpc.agencies.list.useQuery({
    countryCode: country.code === "ALL" ? undefined : country.code,
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-1">
            Empresas Credenciadas
          </span>
          <h1 className="text-3xl font-extrabold text-[#062B5C]">
            Imobiliárias Parceiras
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Empresas com infraestrutura corporativa e carteiras consolidadas no {country.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agenciesQuery.data?.map((agency) => (
            <div
              key={agency.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-6 items-start"
            >
              <img
                src={agency.logoUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80"}
                alt={agency.name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xl">{agency.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{agency.creci}</span>
                </div>
                <p className="text-xs text-slate-500">{agency.city} - {agency.state}</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {agency.description}
                </p>
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Equipe de {agency.teamSize} corretores
                  </span>
                  <Link href={`/imobiliaria/${agency.slug}`}>
                    <a className="px-4 py-2 rounded-xl bg-[#087FF5] hover:bg-[#062B5C] text-white text-xs font-bold transition-colors">
                      Ver Imóveis & Equipe
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PÁGINA PÚBLICA DA IMOBILIÁRIA
// ==========================================
export function AgencyDetailPage() {
  const [, params] = useRoute("/imobiliaria/:slug");
  const slug = params?.slug || "";
  const agencyQuery = trpc.agencies.getBySlug.useQuery({ slug }, { enabled: !!slug });
  const data = agencyQuery.data;

  if (agencyQuery.isLoading) {
    return <div className="max-w-6xl mx-auto p-12 text-center">Carregando imobiliária...</div>;
  }

  if (!data?.agency) {
    return <div className="max-w-xl mx-auto p-12 text-center font-bold">Imobiliária não encontrada.</div>;
  }

  const { agency, properties, brokers } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={agency.logoUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80"}
            alt={agency.name}
            className="w-28 h-28 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-bold">
                {agency.creci}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {agency.city} - {agency.state}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#062B5C]">{agency.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {agency.description}
            </p>
            <div className="pt-2 text-xs text-slate-500 space-x-4">
              <span>{agency.address}</span>
              <span>•</span>
              <span>{agency.phone}</span>
            </div>
          </div>
        </div>

        {/* Imóveis da Imobiliária */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-[#062B5C]">
            Catálogo de Imóveis da Imobiliária ({properties.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
