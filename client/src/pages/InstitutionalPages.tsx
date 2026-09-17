import React from "react";
import { Link } from "wouter";
import { Building2, Users, ShieldCheck, BarChart3, Globe, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";

export function ForAgenciesPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#087FF5] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> Soluções Corporativas
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#062B5C] leading-tight">
            Sua imobiliária conectada a um ecossistema internacional.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Unifique a gestão da sua equipe, distribuição automática de leads e divulgação no portal público e no ERP Ventimob.
          </p>
        </div>

        {/* Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#087FF5] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gestão de Equipe & Corretores</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vincule corretores autônomos à imobiliária, acompanhe a esteira de atendimento e defina metas comerciais unificadas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#12B8F2] flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Página Institucional & SEO</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sua imobiliária ganha endereço público exclusivo indexado no Google, exibindo todo o catálogo com fotos de alta resolução.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Integração com ERP/APP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cadastre no ERP e veja o anúncio aparecer no buscador imediatamente com controle de status (Publicado, Vendido, Alugado).
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#062B5C] to-[#087FF5] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black">Quer cadastrar sua imobiliária?</h3>
            <p className="text-blue-100 text-sm mt-1">
              Fale com nossos consultores corporativos e conheça os planos para equipes.
            </p>
          </div>
          <Link href="/para-corretores">
            <a className="px-6 py-3.5 rounded-xl bg-white text-[#062B5C] font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-50 transition-colors shrink-0 shadow-md">
              Cadastrar Imobiliária
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PÁGINA DE POLÍTICA DE PRIVACIDADE E LGPD
// ==========================================
export function PrivacyLgpdPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 text-slate-700">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#087FF5] block mb-1">
            Transparência & Segurança
          </span>
          <h1 className="text-3xl font-black text-[#062B5C]">
            Política de Privacidade e Conformidade LGPD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Coleta e Finalidade dos Dados</h2>
          <p>
            A Ventimob coleta exclusivamente os dados necessários para proporcionar a conexão transparente entre clientes e corretores de imóveis credenciados. As informações fornecidas em formulários de contato de imóveis são repassadas ao corretor responsável para fins estritos de atendimento comercial e agendamento de visitas.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">2. Exposição e Privacidade do Endereço</h2>
          <p>
            Em conformidade com as boas práticas de segurança patrimonial, o portal público da Ventimob exibe a localização aproximada e dados do bairro do imóvel. O endereço exato e número predial são reservados ao anunciante e compartilhados apenas mediante consentimento nas etapas de visitação formal.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">3. Direitos do Titular de Dados</h2>
          <p>
            O titular dos dados pessoais pode solicitar a qualquer momento a confirmação da existência de tratamento, acesso, correção de dados incompletos ou eliminação definitiva entrando em contato através do e-mail <strong>contato@ventimob.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
