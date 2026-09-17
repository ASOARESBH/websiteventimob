import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation } from "../contexts/LocationContext";
import {
  Bed,
  Bath,
  Car,
  Maximize,
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Building,
  User,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function PropertyDetailPage() {
  const [, params] = useRoute("/imovel/:slug");
  const slug = params?.slug || "";
  const { formatPrice, getWhatsappLink } = useLocation();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadSent, setLeadSent] = useState(false);

  const propertyQuery = trpc.properties.getBySlugOrCode.useQuery(
    { identifier: slug },
    { enabled: !!slug }
  );

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      setLeadSent(true);
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadMessage("");
    },
  });

  const property = propertyQuery.data;

  if (propertyQuery.isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Imóvel não encontrado</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          O código ou endereço solicitado não está mais disponível ou expirou.
        </p>
        <Link href="/busca">
          <a className="px-5 py-2.5 rounded-xl bg-[#087FF5] text-white text-sm font-bold">
            Ver outros imóveis
          </a>
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  if (Array.isArray(property.images)) {
    images = property.images;
  } else if (typeof property.images === "string") {
    try {
      images = JSON.parse(property.images);
    } catch {
      images = [property.images];
    }
  }
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
  }

  let features: string[] = [];
  if (Array.isArray(property.features)) {
    features = property.features;
  } else if (typeof property.features === "string") {
    try {
      features = JSON.parse(property.features);
    } catch {
      features = [];
    }
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone) return;
    createLeadMutation.mutate({
      propertyId: property.id,
      brokerId: property.brokerId || undefined,
      agencyId: property.agencyId || undefined,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      message: leadMessage || `Tenho interesse no imóvel ${property.code} - ${property.title}`,
      countryCode: property.countryCode,
    });
  };

  const whatsappText = `Olá, encontrei este imóvel na Ventimob e gostaria de agendar uma visita.\n\nCódigo: ${property.code}\nImóvel: ${property.title}\nValor: ${formatPrice(property.price, property.currency)}\nLocalização: ${property.neighborhood}, ${property.city}/${property.state}`;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navegação e Código */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <Link href="/busca">
            <a className="inline-flex items-center gap-1.5 font-bold text-[#062B5C] hover:text-[#087FF5]">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a busca</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-slate-700">
              Código: {property.code}
            </span>
            <span className="bg-[#087FF5]/10 text-[#087FF5] font-bold px-2.5 py-1 rounded-md uppercase">
              {property.purpose === "comprar" ? "Venda" : "Locação"}
            </span>
          </div>
        </div>

        {/* Título & Cabeçalho do Imóvel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="text-[#087FF5] uppercase font-bold">{property.type}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {property.neighborhood}, {property.city} - {property.state}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062B5C] leading-snug">
              {property.title}
            </h1>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Valor {property.purpose === "alugar" ? "Mensal" : ""}
            </span>
            <span className="text-3xl font-black text-[#062B5C]">
              {formatPrice(property.price, property.currency)}
            </span>
            {(property.condoFee || property.iptuFee) && (
              <div className="text-[11px] text-slate-500 space-x-2 mt-0.5">
                {property.condoFee && (
                  <span>Condomínio: {formatPrice(property.condoFee, property.currency)}</span>
                )}
                {property.iptuFee && (
                  <span>IPTU: {formatPrice(property.iptuFee, property.currency)}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Fotos Moderna */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Foto Principal */}
          <div className="lg:col-span-8 aspect-16/10 rounded-3xl overflow-hidden shadow-md bg-slate-900 relative">
            <img
              src={images[activePhotoIdx]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
              Foto {activePhotoIdx + 1} de {images.length}
            </div>
          </div>

          {/* Miniaturas laterais */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative rounded-2xl overflow-hidden aspect-4/3 border-2 transition-all ${
                  activePhotoIdx === idx ? "border-[#087FF5] scale-98" : "border-transparent opacity-85 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Bloco de Atributos Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#087FF5] flex items-center justify-center shrink-0">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 block">{property.bedrooms}</span>
              <span className="text-xs text-slate-500">Dormitórios ({property.suites} suítes)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#087FF5] flex items-center justify-center shrink-0">
              <Bath className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 block">{property.bathrooms}</span>
              <span className="text-xs text-slate-500">Banheiros</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#087FF5] flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 block">{property.parkingSpots}</span>
              <span className="text-xs text-slate-500">Vagas de garagem</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#087FF5] flex items-center justify-center shrink-0">
              <Maximize className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 block">
                {property.privateArea || property.totalArea || "-"} m²
              </span>
              <span className="text-xs text-slate-500">Área privativa</span>
            </div>
          </div>
        </div>

        {/* Grid de 2 Colunas: Descrição/Características vs Formulário/Corretor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Descrição, Características e Localização Aproximada */}
          <div className="lg:col-span-8 space-y-8">
            {/* Descrição */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-lg font-extrabold text-[#062B5C]">Sobre o Imóvel</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Características e Comodidades */}
            {features.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-lg font-extrabold text-[#062B5C]">Comodidades e Diferenciais</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localização e Segurança */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#062B5C]">Localização</h3>
                <span className="text-xs text-slate-400">Localização aproximada para sua privacidade</span>
              </div>
              <p className="text-xs text-slate-600">
                {property.addressPublic || `${property.neighborhood}, ${property.city} - ${property.state}`}
              </p>
              <div className="h-64 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#087FF5] mx-auto mb-1 animate-bounce" />
                  <span>Raio de localização seguro • Bairro {property.neighborhood}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Box do Corretor e Formulário de Lead Direto */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            {/* Box do Corretor */}
            {property.broker && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src={property.broker.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"}
                    alt={property.broker.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#087FF5]"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{property.broker.name}</h4>
                    <p className="text-xs text-[#087FF5] font-semibold">{property.broker.creci}</p>
                    <Link href={`/corretor/${property.broker.slug}`}>
                      <a className="text-[11px] text-slate-400 hover:underline">
                        Ver todos os imóveis do corretor
                      </a>
                    </Link>
                  </div>
                </div>

                {property.agency && (
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Imobiliária:</span>
                    <Link href={`/imobiliaria/${property.agency.slug}`}>
                      <a className="font-semibold text-slate-800 hover:text-[#087FF5]">
                        {property.agency.name}
                      </a>
                    </Link>
                  </div>
                )}

                {/* Botão de WhatsApp Imediato com código pré-preenchido */}
                <a
                  href={getWhatsappLink(whatsappText, property.broker.whatsapp || undefined)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>
            )}

            {/* Formulário de Envio de Mensagem / Agendamento */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Falar com o anunciante</h4>
              <p className="text-xs text-slate-500 mb-4">
                Envie seus dados para agendar uma visita ou tirar dúvidas técnicas.
              </p>

              {leadSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Mensagem enviada com sucesso!</span>
                  </div>
                  <p>O corretor responsável entrará em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="joao@exemplo.com"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+55 (11) 99999-9999"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Mensagem
                    </label>
                    <textarea
                      rows={3}
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      placeholder="Gostaria de agendar uma visita ou receber mais informações..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createLeadMutation.isPending}
                    className="w-full py-3 rounded-xl bg-[#062B5C] hover:bg-[#087FF5] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    {createLeadMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
