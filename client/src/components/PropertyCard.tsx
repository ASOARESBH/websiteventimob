import React, { useState } from "react";
import { Link } from "wouter";
import { Bed, Bath, Car, Maximize, Heart, MessageCircle, MapPin, Sparkles } from "lucide-react";
import { useLocation } from "../contexts/LocationContext";

export interface PropertyCardProps {
  property: {
    id: number;
    code: string;
    slug: string;
    title: string;
    purpose: "comprar" | "alugar";
    type: string;
    price: string | number;
    currency: string;
    countryCode: string;
    state: string;
    city: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    parkingSpots: number;
    totalArea?: string | number | null;
    privateArea?: string | number | null;
    images?: any;
    featured?: boolean;
    broker?: {
      name: string;
      slug: string;
      avatarUrl?: string | null;
      phone?: string | null;
      whatsapp?: string | null;
    } | null;
    agency?: {
      name: string;
      slug: string;
    } | null;
  };
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { formatPrice, getWhatsappLink } = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Imagens seguras com fallback
  let imageList: string[] = [];
  if (Array.isArray(property.images)) {
    imageList = property.images;
  } else if (typeof property.images === "string") {
    try {
      imageList = JSON.parse(property.images);
    } catch {
      imageList = [property.images];
    }
  }
  const mainImage = imageList[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    const existing = JSON.parse(localStorage.getItem("vtm_favorites") || "[]");
    if (!isFavorite) {
      if (!existing.includes(property.code)) existing.push(property.code);
    } else {
      const idx = existing.indexOf(property.code);
      if (idx >= 0) existing.splice(idx, 1);
    }
    localStorage.setItem("vtm_favorites", JSON.stringify(existing));
  };

  const whatsappMessage = `Olá, encontrei este imóvel na Ventimob e gostaria de obter mais informações.\n\nCódigo: ${property.code}\nImóvel: ${property.title}\nLocalização: ${property.neighborhood}, ${property.city}/${property.state}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Imagem do Imóvel & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Link href={`/imovel/${property.slug}`}>
          <a className="block w-full h-full">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </a>
        </Link>

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#062B5C]/90 text-white backdrop-blur-xs">
            {property.purpose === "comprar" ? "Venda" : "Locação"}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" /> Destaque
            </span>
          )}
        </div>

        {/* Botão de Favoritar */}
        <button
          onClick={toggleFavorite}
          aria-label="Salvar favorito"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-md"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Código do Imóvel no rodapé da foto */}
        <div className="absolute bottom-2.5 left-3">
          <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono font-medium backdrop-blur-xs">
            {property.code}
          </span>
        </div>
      </div>

      {/* Conteúdo textual */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tipo e Localização */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[#087FF5]">
              {property.type}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[180px]" title={`${property.neighborhood}, ${property.city}`}>
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              {property.neighborhood}, {property.city}
            </span>
          </div>

          {/* Título */}
          <Link href={`/imovel/${property.slug}`}>
            <a className="block group-hover:text-[#087FF5] transition-colors">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                {property.title}
              </h3>
            </a>
          </Link>

          {/* Características principais: dormitórios, banheiros, vagas, área */}
          <div className="grid grid-cols-4 gap-2 my-4 py-2.5 border-y border-slate-100 text-slate-600 text-xs">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Bed className="w-3.5 h-3.5 text-[#087FF5]" />
                <span>{property.bedrooms}</span>
              </div>
              <span className="text-[10px] text-slate-400">Quartos</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Bath className="w-3.5 h-3.5 text-[#087FF5]" />
                <span>{property.bathrooms}</span>
              </div>
              <span className="text-[10px] text-slate-400">Banh.</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Car className="w-3.5 h-3.5 text-[#087FF5]" />
                <span>{property.parkingSpots}</span>
              </div>
              <span className="text-[10px] text-slate-400">Vagas</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Maximize className="w-3.5 h-3.5 text-[#087FF5]" />
                <span>{property.privateArea || property.totalArea || "-"}</span>
              </div>
              <span className="text-[10px] text-slate-400">m²</span>
            </div>
          </div>
        </div>

        {/* Preço e Botões de Ação */}
        <div>
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Valor {property.purpose === "alugar" ? "Mensal" : ""}
              </span>
              <span className="text-xl font-black text-[#062B5C]">
                {formatPrice(property.price, property.currency)}
              </span>
            </div>
            {property.broker && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Corretor</span>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px] block">
                  {property.broker.name}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/imovel/${property.slug}`}>
              <a className="w-full text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-[#062B5C] hover:bg-slate-50 transition-colors">
                Ver Imóvel
              </a>
            </Link>

            <a
              href={getWhatsappLink(whatsappMessage, property.broker?.whatsapp || undefined)}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
