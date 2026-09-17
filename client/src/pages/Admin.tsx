import React, { useState } from "react";
import { trpc } from "../lib/trpc";
import {
  Shield,
  Settings,
  Home,
  Users,
  MessageSquare,
  Save,
  CheckCircle,
  Building2,
  Phone,
  RefreshCw,
  Globe,
  Sliders,
} from "lucide-react";

export default function AdminPage() {
  const summaryQuery = trpc.admin.getSummary.useQuery();
  const settingsQuery = trpc.config.getSettings.useQuery();

  const [activeTab, setActiveTab] = useState<"settings" | "properties" | "leads" | "registrations">("settings");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Estados locais para edição dos textos e configurações centralizadas
  const [siteName, setSiteName] = useState("");
  const [siteTagline, setSiteTagline] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [whatsappBr, setWhatsappBr] = useState("");
  const [whatsappPy, setWhatsappPy] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Carregar dados nos estados quando a query retornar
  React.useEffect(() => {
    if (settingsQuery.data) {
      setSiteName(settingsQuery.data["site_name"] || "Ventimob");
      setSiteTagline(settingsQuery.data["site_tagline"] || "Imóveis em movimento.");
      setHeroTitle(settingsQuery.data["hero_title"] || "Encontre seu próximo imóvel.");
      setHeroSubtitle(settingsQuery.data["hero_subtitle"] || "");
      setWhatsappBr(settingsQuery.data["whatsapp_br"] || "+55 11 99999-8888");
      setWhatsappPy(settingsQuery.data["whatsapp_py"] || "+595 981 234 567");
      setContactEmail(settingsQuery.data["contact_email"] || "contato@ventimob.com");
    }
  }, [settingsQuery.data]);

  const updateSettingMutation = trpc.admin.updateSetting.useMutation();
  const updateStatusMutation = trpc.admin.updatePropertyStatus.useMutation({
    onSuccess: () => {
      summaryQuery.refetch();
    },
  });

  const handleSaveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Salvando configurações...");
    try {
      await updateSettingMutation.mutateAsync({ key: "site_name", value: siteName });
      await updateSettingMutation.mutateAsync({ key: "site_tagline", value: siteTagline });
      await updateSettingMutation.mutateAsync({ key: "hero_title", value: heroTitle });
      await updateSettingMutation.mutateAsync({ key: "hero_subtitle", value: heroSubtitle });
      await updateSettingMutation.mutateAsync({ key: "whatsapp_br", value: whatsappBr });
      await updateSettingMutation.mutateAsync({ key: "whatsapp_py", value: whatsappPy });
      await updateSettingMutation.mutateAsync({ key: "contact_email", value: contactEmail });
      setSaveStatus("Configurações atualizadas com sucesso!");
      settingsQuery.refetch();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus("Erro ao salvar configurações.");
    }
  };

  const data = summaryQuery.data;

  return (
    <div className="bg-slate-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header do Painel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#062B5C] text-white flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#062B5C]">
                Painel Central de Administração & CMS
              </h1>
              <p className="text-xs text-slate-500">
                Gerencie textos globais, WhatsApp multipaís, status de imóveis e leads (admin.php).
              </p>
            </div>
          </div>

          {/* Abas */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "settings" ? "bg-white text-[#087FF5] shadow-xs" : ""
              }`}
            >
              CMS & Textos
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "properties" ? "bg-white text-[#087FF5] shadow-xs" : ""
              }`}
            >
              Imóveis ({data?.propertiesCount || 0})
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "leads" ? "bg-white text-[#087FF5] shadow-xs" : ""
              }`}
            >
              Leads ({data?.leadsCount || 0})
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "registrations" ? "bg-white text-[#087FF5] shadow-xs" : ""
              }`}
            >
              Credenciamento ({data?.registrationsCount || 0})
            </button>
          </div>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Imóveis Cadastrados</span>
            <span className="text-2xl font-black text-[#062B5C]">{data?.propertiesCount || 0}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Corretores Ativos</span>
            <span className="text-2xl font-black text-[#087FF5]">{data?.brokersCount || 0}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Imobiliárias Parceiras</span>
            <span className="text-2xl font-black text-indigo-600">{data?.agenciesCount || 0}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Leads Recebidos</span>
            <span className="text-2xl font-black text-emerald-600">{data?.leadsCount || 0}</span>
          </div>
        </div>

        {/* CONTEÚDO DA ABA 1: CONFIGURAÇÃO CENTRALIZADA (TEXTOS E WHATSAPP) */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#062B5C]">
                  Centralização de Textos e WhatsApp (admin.php)
                </h3>
                <p className="text-xs text-slate-500">
                  Edite os títulos do site, slogan e números de WhatsApp por país sem modificar código-fonte.
                </p>
              </div>
              {saveStatus && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  {saveStatus}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveAllSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Nome da Plataforma
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Título Principal do Hero (Home)
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Subtítulo do Hero (Home)
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    WhatsApp Brasil (+55)
                  </label>
                  <input
                    type="text"
                    value={whatsappBr}
                    onChange={(e) => setWhatsappBr(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    WhatsApp Paraguai (+595)
                  </label>
                  <input
                    type="text"
                    value={whatsappPy}
                    onChange={(e) => setWhatsappPy(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    E-mail de Contato Geral
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updateSettingMutation.isPending}
                className="px-6 py-3 rounded-xl bg-[#062B5C] hover:bg-[#087FF5] text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Configurações</span>
              </button>
            </form>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: GERENCIAMENTO DE IMÓVEIS & STATUS */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-[#062B5C]">Gerenciar Status dos Imóveis</h3>
            <p className="text-xs text-slate-500">
              Conforme Seção 39 do produto, apenas imóveis com status <strong>PUBLICADO</strong> aparecem no portal público.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Código</th>
                    <th className="py-3 px-2">Título</th>
                    <th className="py-3 px-2">Tipo / Finalidade</th>
                    <th className="py-3 px-2">País / Cidade</th>
                    <th className="py-3 px-2">Preço</th>
                    <th className="py-3 px-2">Origem</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.allProperties.map((prop: any) => (
                    <tr key={prop.id} className="hover:bg-slate-50">
                      <td className="py-3 px-2 font-mono font-bold text-slate-700">{prop.code}</td>
                      <td className="py-3 px-2 font-semibold text-slate-900 max-w-xs truncate">{prop.title}</td>
                      <td className="py-3 px-2 capitalize">{prop.type} ({prop.purpose})</td>
                      <td className="py-3 px-2">{prop.countryCode} - {prop.city}</td>
                      <td className="py-3 px-2 font-bold text-[#062B5C]">
                        {prop.currency} {Number(prop.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px]">
                          {prop.source}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={prop.status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({ id: prop.id, status: e.target.value as any })
                          }
                          className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-1 font-semibold"
                        >
                          <option value="publicado">Publicado</option>
                          <option value="pendente">Pendente</option>
                          <option value="rascunho">Rascunho</option>
                          <option value="pausado">Pausado</option>
                          <option value="vendido">Vendido</option>
                          <option value="alugado">Alugado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 3: LEADS RECEBIDOS */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-[#062B5C]">Leads Recebidos pelo Portal</h3>
            <div className="space-y-3">
              {data?.recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({lead.countryCode})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">E-mail: {lead.email} | Telefone: {lead.phone}</p>
                    <p className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 mt-2">
                      "{lead.message}"
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-400">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase text-[10px]">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 4: SOLICITAÇÕES DE CORRETORES */}
        {activeTab === "registrations" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-[#062B5C]">Solicitações de Credenciamento</h3>
            <div className="space-y-3">
              {data?.recentRegistrations.map((reg: any) => (
                <div key={reg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{reg.name}</h4>
                    <p className="text-xs text-[#087FF5] font-semibold">
                      {reg.creci} • {reg.city} - {reg.state} ({reg.countryCode})
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      WhatsApp: {reg.whatsapp} | Tipo: {reg.professionalType}
                    </p>
                    {reg.notes && <p className="text-xs text-slate-500 mt-1 italic">"{reg.notes}"</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#087FF5] text-[10px] font-bold uppercase">
                      {reg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
