import React, { useState, useEffect } from "react";
import { useLocation as useWouterLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation, COUNTRIES } from "../contexts/LocationContext";
import { PropertyCard } from "../components/PropertyCard";
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  RotateCcw,
  Building,
  Bed,
  Bath,
  Car,
  ChevronDown,
  X,
  MapPin,
} from "lucide-react";

export default function SearchPage() {
  const [locationPath] = useWouterLocation();
  const { country, formatPrice } = useLocation();

  // Ler parâmetros da URL
  const queryParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

  const [purpose, setPurpose] = useState<"comprar" | "alugar">(
    (queryParams.get("purpose") as any) || "comprar"
  );
  const [propertyType, setPropertyType] = useState<string>(queryParams.get("type") || "todos");
  const [countryCode, setCountryCode] = useState<string>(queryParams.get("countryCode") || country.code);
  const [cityQuery, setCityQuery] = useState<string>(queryParams.get("query") || "");
  const [minPrice, setMinPrice] = useState<string>(queryParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(queryParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState<number>(Number(queryParams.get("bedrooms")) || 0);
  const [bathrooms, setBathrooms] = useState<number>(Number(queryParams.get("bathrooms")) || 0);
  const [parkingSpots, setParkingSpots] = useState<number>(Number(queryParams.get("parkingSpots")) || 0);
  const [sortBy, setSortBy] = useState<"relevance" | "recent" | "price_asc" | "price_desc">("relevance");

  // Modo de exibição: lista ou mapa
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Execução da busca com tRPC
  const searchQuery = trpc.properties.search.useQuery({
    purpose,
    type: propertyType === "todos" ? undefined : (propertyType as any),
    countryCode: countryCode === "ALL" ? undefined : countryCode,
    city: cityQuery.trim() || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms > 0 ? bedrooms : undefined,
    bathrooms: bathrooms > 0 ? bathrooms : undefined,
    parkingSpots: parkingSpots > 0 ? parkingSpots : undefined,
    sortBy,
    limit: 30,
  });

  const propertiesList = searchQuery.data?.items || [];

  const handleResetFilters = () => {
    setPurpose("comprar");
    setPropertyType("todos");
    setCityQuery("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms(0);
    setBathrooms(0);
    setParkingSpots(0);
    setSortBy("relevance");
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Barra superior de controles e filtros compactos */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Alternar Venda/Locação */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setPurpose("comprar")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  purpose === "comprar" ? "bg-[#062B5C] text-white shadow-xs" : "hover:text-[#087FF5]"
                }`}
              >
                Comprar
              </button>
              <button
                onClick={() => setPurpose("alugar")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  purpose === "alugar" ? "bg-[#062B5C] text-white shadow-xs" : "hover:text-[#087FF5]"
                }`}
              >
                Alugar
              </button>
            </div>

            {/* Campo Rápido de Cidade/Bairro */}
            <div className="relative">
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Filtrar por cidade ou bairro..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-[#087FF5] focus:outline-hidden w-48 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Seletor de Tipo */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="todos">Todos os tipos</option>
              <option value="apartamento">Apartamentos</option>
              <option value="casa">Casas</option>
              <option value="terreno">Terrenos</option>
              <option value="comercial">Comerciais</option>
              <option value="cobertura">Coberturas</option>
              <option value="lancamento">Lançamentos</option>
            </select>

            {/* Seletor de País de Busca */}
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="ALL">🌎 Todos os países</option>
              <option value="BR">🇧🇷 Brasil</option>
              <option value="PY">🇵🇾 Paraguai</option>
              <option value="PA">🇵🇦 Panamá</option>
              <option value="CR">🇨🇷 Costa Rica</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Ordenação */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 border-none cursor-pointer focus:outline-hidden"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="recent">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </div>

            {/* Alternar visualização (Mobile & Desktop) */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-slate-600">
              <button
                onClick={() => setViewMode("list")}
                title="Visualização em Lista"
                className={`p-1.5 rounded-lg text-xs ${viewMode === "list" ? "bg-white text-[#087FF5] shadow-xs" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("split")}
                title="Lista e Mapa lado a lado"
                className={`hidden md:block p-1.5 rounded-lg text-xs ${viewMode === "split" ? "bg-white text-[#087FF5] shadow-xs" : ""}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                title="Visualizar no Mapa"
                className={`p-1.5 rounded-lg text-xs ${viewMode === "map" ? "bg-white text-[#087FF5] shadow-xs" : ""}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

            {/* Botão Filtros Avançados Mobile */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#062B5C] text-white text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Container Principal: Filtros Esquerda + Lista Centro + Mapa Direita */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: FILTROS DETALHADOS (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 h-fit sticky top-36">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#087FF5]" />
              Filtros Avançados
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#087FF5] font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Limpar
            </button>
          </div>

          {/* Faixa de Preço */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Faixa de Preço
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quartos */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Quartos
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBedrooms(num)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    bedrooms === num
                      ? "bg-[#062B5C] border-[#062B5C] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {num === 0 ? "Todos" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Banheiros */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Banheiros
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBathrooms(num)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    bathrooms === num
                      ? "bg-[#062B5C] border-[#062B5C] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {num === 0 ? "Todos" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Vagas */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Vagas de Garagem
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setParkingSpots(num)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    parkingSpots === num
                      ? "bg-[#062B5C] border-[#062B5C] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {num === 0 ? "Todos" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Alerta de Imóveis */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
            <span className="font-bold text-[#062B5C] block mb-1">
              Não encontrou o que procura?
            </span>
            <p className="text-slate-600 leading-relaxed mb-3">
              Cadastre seu perfil de interesse e seja avisado assim que um novo imóvel for publicado.
            </p>
            <button
              onClick={() => alert("Alerta de imóveis ativado! Notificaremos via WhatsApp ou e-mail.")}
              className="w-full py-2 rounded-lg bg-[#087FF5] text-white font-bold hover:bg-[#062B5C] transition-colors"
            >
              Criar Alerta Grátis
            </button>
          </div>
        </aside>

        {/* COLUNA CENTRAL & DIREITA */}
        <main
          className={`${
            viewMode === "list"
              ? "lg:col-span-9"
              : viewMode === "map"
              ? "lg:col-span-9"
              : "lg:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-6"
          }`}
        >
          {/* LISTA DE CARDS */}
          {viewMode !== "map" && (
            <div className={viewMode === "split" ? "xl:col-span-7 space-y-4" : "space-y-6"}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Mostrando <strong>{propertiesList.length}</strong> imóveis encontrados
                </span>
                {countryCode !== "ALL" && (
                  <span className="font-medium text-slate-700">
                    Filtro regional ativo: {countryCode}
                  </span>
                )}
              </div>

              {searchQuery.isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : propertiesList.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">Nenhum imóvel encontrado</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Tente ajustar sua busca ou remover alguns filtros para ver mais resultados no {country.name}.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-[#087FF5] text-white text-xs font-bold"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-5 ${
                    viewMode === "split"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {propertiesList.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MAPA INTERATIVO PROPTECH */}
          {(viewMode === "split" || viewMode === "map") && (
            <div
              className={`${
                viewMode === "split"
                  ? "xl:col-span-5 h-[650px] sticky top-36"
                  : "col-span-12 h-[750px]"
              } rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-200 relative flex flex-col`}
            >
              {/* Top Bar do Mapa */}
              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#062B5C] shadow-md pointer-events-auto flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#087FF5]" />
                  <span>Imóveis geolocalizados</span>
                </span>
                <button
                  onClick={() => setViewMode(viewMode === "map" ? "split" : "map")}
                  className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-700 shadow-md hover:bg-white pointer-events-auto"
                >
                  {viewMode === "map" ? "Ver Lista" : "Expandir Mapa"}
                </button>
              </div>

              {/* Renderização de Mapa Geográfico estilizado com pins interativos */}
              <div className="w-full h-full bg-[#E5E9EE] relative flex items-center justify-center overflow-hidden">
                {/* Linhas de grade e visual de mapa cartográfico */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>

                {/* Pins interativos simulando a posição dos imóveis retornados */}
                <div className="relative w-full h-full p-8 flex flex-wrap items-center justify-around">
                  {propertiesList.map((p: any, idx: number) => (
                    <div
                      key={p.id}
                      className="group/pin relative cursor-pointer m-4 transition-transform hover:scale-110"
                    >
                      <div className="px-3 py-1 rounded-full bg-[#062B5C] text-white text-xs font-extrabold shadow-lg border-2 border-white flex items-center gap-1">
                        <span>{p.currency === "PYG" ? "₲" : "R$"}</span>
                        <span>
                          {p.currency === "PYG"
                            ? `${(Number(p.price) / 1000000).toFixed(0)}M`
                            : Number(p.price) >= 1000000
                            ? `${(Number(p.price) / 1000000).toFixed(1)}M`
                            : `${(Number(p.price) / 1000).toFixed(0)}k`}
                        </span>
                      </div>

                      {/* Tooltip do Pin ao passar o mouse */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-white rounded-xl shadow-2xl border border-slate-200 hidden group-hover/pin:block z-30 pointer-events-none animate-in fade-in">
                        <img
                          src={Array.isArray(p.images) ? p.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80"}
                          alt={p.title}
                          className="w-full h-20 object-cover rounded-lg mb-1.5"
                        />
                        <p className="font-bold text-[11px] text-slate-800 truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-500">{p.neighborhood}, {p.city}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rodapé do Mapa */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-slate-500 shadow-xs">
                  MapProvider: OpenStreetMap / Leaflet Service Ready
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE FILTROS MOBILE */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Filtros de Busca</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Finalidade */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Finalidade</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPurpose("comprar")}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      purpose === "comprar" ? "bg-[#062B5C] text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => setPurpose("alugar")}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      purpose === "alugar" ? "bg-[#062B5C] text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Alugar
                  </button>
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Tipo de Imóvel</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-100 rounded-xl"
                >
                  <option value="todos">Todos</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              {/* Dormitórios */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Quartos mínimos</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBedrooms(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                        bedrooms === n ? "bg-[#087FF5] text-white" : "bg-slate-100"
                      }`}
                    >
                      {n === 0 ? "Todos" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Limpar
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#087FF5] text-white text-xs font-bold"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
