import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation } from "../contexts/LocationContext";
import {
  Briefcase,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  User,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// ==========================================
// PÁGINA "PARA CORRETORES" / CAPTAÇÃO
// ==========================================
export function ForBrokersPage() {
  const { country } = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState<string>(country.code === "ALL" ? "BR" : country.code);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [creci, setCreci] = useState("");
  const [professionalType, setProfessionalType] = useState<"autonomo" | "imobiliaria">("autonomo");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const registerMutation = trpc.leads.registerBroker.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      name,
      email,
      phone,
      whatsapp,
      countryCode,
      state,
      city,
      creci,
      professionalType,
      notes,
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#087FF5] text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> Ecossistema para Profissionais
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#062B5C] leading-tight">
            É corretor? Seja parte da maior inovação PropTech do mercado.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Administre seus imóveis, atenda leads quentes e expanda sua atuação com o ERP e aplicativo oficial da Ventimob.
          </p>
        </div>

        {/* Formulário de Cadastro do Corretor */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Cadastro recebido com sucesso!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Nossa equipe de credenciamento entrará em contato via WhatsApp para ativar seu acesso ao ERP e aplicativo Ventimob.
              </p>
              <Link href="/">
                <a className="inline-block px-6 py-2.5 rounded-xl bg-[#062B5C] text-white text-xs font-bold uppercase tracking-wider">
                  Voltar para a página inicial
                </a>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#062B5C]">Cadastre-se na Ventimob</h3>
                <p className="text-xs text-slate-500">
                  Preencha seus dados para receber o credenciamento e começar a anunciar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Alberto"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    E-mail profissional *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@seunome.com.br"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+55 11 98765-4321"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    País de atuação
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="BR">🇧🇷 Brasil</option>
                    <option value="PY">🇵🇾 Paraguai</option>
                    <option value="PA">🇵🇦 Panamá</option>
                    <option value="CR">🇨🇷 Costa Rica</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    CRECI ou Registro Profissional *
                  </label>
                  <input
                    type="text"
                    required
                    value={creci}
                    onChange={(e) => setCreci(e.target.value)}
                    placeholder="Ex: CRECI 12345-F"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Estado / Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex: São Paulo ou Distrito Capital"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Curitiba ou Asunción"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Tipo de Profissional
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="profType"
                      checked={professionalType === "autonomo"}
                      onChange={() => setProfessionalType("autonomo")}
                      className="text-[#087FF5]"
                    />
                    <span>Corretor Autônomo</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="profType"
                      checked={professionalType === "imobiliaria"}
                      onChange={() => setProfessionalType("imobiliaria")}
                      className="text-[#087FF5]"
                    />
                    <span>Imobiliária / Equipe</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Observações ou Especialidade (opcional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Conte um pouco sobre sua carteira e principais bairros atendidos..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#062B5C] to-[#087FF5] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity"
              >
                {registerMutation.isPending ? "Cadastrando..." : "Enviar Solicitação de Credenciamento"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PÁGINA "LOGIN DO CORRETOR" (Área de Acesso)
// ==========================================
export function BrokerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de autenticação com redirecionamento para o ambiente ERP
    window.location.href = "https://erp.ventimob.com";
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#087FF5] flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#062B5C]">Área do Corretor</h2>
          <p className="text-xs text-slate-500">
            Acesse o ecossistema ERP / APP Ventimob para gerenciar seus imóveis e clientes.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Senha
              </label>
              <a href="#" className="text-[11px] text-[#087FF5] hover:underline">
                Esqueci minha senha
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#062B5C] hover:bg-[#087FF5] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Entrar no ERP / APP
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">Ainda não possui credencial de corretor?</p>
          <Link href="/para-corretores">
            <a className="text-xs font-bold text-[#087FF5] hover:underline">
              Quero me cadastrar como corretor
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
