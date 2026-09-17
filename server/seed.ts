import { getDb } from "./db";
import { agencies, brokerRegistrations, brokers, countries, leads, properties, siteSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedInitialData() {
  const db = await getDb();
  if (!db) {
    console.warn("[Seed] Database not available, skipping seed");
    return;
  }

  try {
    // 1. Países
    const existingCountries = await db.select().from(countries);
    if (existingCountries.length === 0) {
      await db.insert(countries).values([
        {
          code: "BR",
          name: "Brasil",
          flagEmoji: "🇧🇷",
          phoneCode: "+55",
          defaultCurrency: "BRL",
          currencySymbol: "R$",
          defaultLanguage: "pt-BR",
          whatsappNumber: "+5511999998888",
          active: true,
        },
        {
          code: "PY",
          name: "Paraguai",
          flagEmoji: "🇵🇾",
          phoneCode: "+595",
          defaultCurrency: "PYG",
          currencySymbol: "₲",
          defaultLanguage: "es-PY",
          whatsappNumber: "+595981234567",
          active: true,
        },
        {
          code: "PA",
          name: "Panamá",
          flagEmoji: "🇵🇦",
          phoneCode: "+507",
          defaultCurrency: "USD",
          currencySymbol: "$",
          defaultLanguage: "es-PA",
          whatsappNumber: "+50760000000",
          active: true,
        },
        {
          code: "CR",
          name: "Costa Rica",
          flagEmoji: "🇨🇷",
          phoneCode: "+506",
          defaultCurrency: "USD",
          currencySymbol: "$",
          defaultLanguage: "es-CR",
          whatsappNumber: "+50680000000",
          active: true,
        },
      ]);
      console.log("[Seed] Países cadastrados com sucesso.");
    }

    // 2. Configurações centralizadas do site (admin.php / CMS central)
    const existingSettings = await db.select().from(siteSettings);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values([
        {
          key: "site_name",
          value: "Ventimob",
          description: "Nome oficial da plataforma",
        },
        {
          key: "site_tagline",
          value: "Imóveis em movimento.",
          description: "Slogan principal de branding",
        },
        {
          key: "hero_title",
          value: "Encontre seu próximo imóvel.",
          description: "Título de destaque na Home",
        },
        {
          key: "hero_subtitle",
          value: "Casas, apartamentos, terrenos e empreendimentos selecionados pelos melhores corretores e imobiliárias.",
          description: "Subtítulo do Hero da Home",
        },
        {
          key: "contact_email",
          value: "contato@ventimob.com",
          description: "E-mail geral de contato e suporte",
        },
        {
          key: "whatsapp_br",
          value: "+55 11 99999-8888",
          description: "Número do WhatsApp de atendimento Brasil",
        },
        {
          key: "whatsapp_py",
          value: "+595 981 234 567",
          description: "Número do WhatsApp de atendimento Paraguai",
        },
        {
          key: "erp_portal_url",
          value: "https://erp.ventimob.com",
          description: "URL de acesso ao ecossistema ERP/APP",
        },
        {
          key: "app_store_url",
          value: "https://apps.apple.com/app/ventimob",
          description: "Link da App Store oficial",
        },
        {
          key: "google_play_url",
          value: "https://play.google.com/store/apps/details?id=com.ventimob.app",
          description: "Link do Google Play oficial",
        },
        {
          key: "cookie_banner_text",
          value: "Utilizamos cookies e dados de navegação para proporcionar uma experiência personalizada e conforme a LGPD. Ao continuar, você concorda com nossos termos.",
          description: "Mensagem do banner de cookies LGPD",
        },
      ]);
      console.log("[Seed] Configurações de CMS cadastradas.");
    }

    // 3. Imobiliárias
    const existingAgencies = await db.select().from(agencies);
    let agencyBrId = 1;
    let agencyPyId = 2;
    if (existingAgencies.length === 0) {
      const res = await db.insert(agencies).values([
        {
          slug: "ventimob-prime-properties",
          name: "Ventimob Prime Imóveis",
          logoUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
          countryCode: "BR",
          city: "São Paulo",
          state: "SP",
          address: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi",
          description: "Especializada em imóveis residenciais de alto padrão e oportunidades de investimento corporativo nos principais eixos de São Paulo e capitais brasileiras.",
          phone: "+55 11 3030-4040",
          whatsapp: "+55 11 98888-1111",
          email: "prime@ventimob.com",
          website: "https://ventimob.com/imobiliaria/ventimob-prime-properties",
          creci: "12345-J",
          teamSize: 18,
          active: true,
        },
        {
          slug: "rio-parana-bienes-raices",
          name: "Río Paraná Bienes Raíces",
          logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
          countryCode: "PY",
          city: "Asunción",
          state: "Distrito Capital",
          address: "Av. Santa Teresa 2240, Barrio Ykua Sati",
          description: "Referencia en desarrollos residenciales y corporativos en Asunción y Ciudad del Este, facilitando compras transfronterizas e inversiones seguras.",
          phone: "+595 21 600-789",
          whatsapp: "+595 981 112 233",
          email: "contacto@rioparanabienesraices.com",
          website: "https://ventimob.com/imobiliaria/rio-parana-bienes-raices",
          creci: "PY-REG-882",
          teamSize: 12,
          active: true,
        },
      ]);
      console.log("[Seed] Imobiliárias cadastradas.");
    }

    // 4. Corretores
    const existingBrokers = await db.select().from(brokers);
    let broker1Id = 1;
    let broker2Id = 2;
    let broker3Id = 3;
    if (existingBrokers.length === 0) {
      await db.insert(brokers).values([
        {
          slug: "rodrigo-macedo",
          name: "Rodrigo Macedo",
          avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=350&q=80",
          creci: "CRECI 198.442-F",
          countryCode: "BR",
          state: "SP",
          city: "São Paulo",
          phone: "+55 11 99123-4567",
          whatsapp: "+55 11 99123-4567",
          email: "rodrigo.macedo@ventimob.com",
          specialty: "Apartamentos de Alto Padrão e Coberturas",
          bio: "Mais de 12 anos atuando no mercado de luxo e alto padrão nos bairros Jardins, Itaim Bibi e Moema. Consultoria completa desde a prospecção até a assinatura da escritura.",
          rating: "4.95",
          dealsCount: 84,
          agencyId: 1,
          active: true,
        },
        {
          slug: "mariana-castro",
          name: "Mariana Castro",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80",
          creci: "CRECI 214.889-F",
          countryCode: "BR",
          state: "PR",
          city: "Curitiba",
          phone: "+55 41 98877-6655",
          whatsapp: "+55 41 98877-6655",
          email: "mariana.castro@ventimob.com",
          specialty: "Casas em Condomínio e Lançamentos",
          bio: "Especialista em condomínios fechados em Curitiba e Região Metropolitana. Foco no atendimento humanizado, segurança jurídica e busca personalizada.",
          rating: "4.98",
          dealsCount: 62,
          agencyId: 1,
          active: true,
        },
        {
          slug: "carlos-alberto-benitez",
          name: "Carlos Alberto Benítez",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80",
          creci: "CAPACO 741",
          countryCode: "PY",
          state: "Distrito Capital",
          city: "Asunción",
          phone: "+595 981 777 888",
          whatsapp: "+595 981 777 888",
          email: "carlos.benitez@ventimob.com",
          specialty: "Desarrollos Corporativos y Viviendas Premium",
          bio: "Experto en asesoramiento patrimonial para compradores paraguayos e inversores de Brasil y Cono Sur en zonas residenciales y comerciales de Asunción.",
          rating: "4.92",
          dealsCount: 47,
          agencyId: 2,
          active: true,
        },
      ]);
      console.log("[Seed] Corretores cadastrados.");
    }

    // 5. Imóveis
    const existingProperties = await db.select().from(properties);
    if (existingProperties.length === 0) {
      await db.insert(properties).values([
        {
          code: "VTM-001021",
          slug: "apartamento-alto-padrao-itaim-bibi-sao-paulo-vtm001021",
          title: "Apartamento Contemporâneo com Vista Panorâmica no Itaim Bibi",
          purpose: "comprar",
          type: "apartamento",
          status: "publicado",
          source: "VENTIMOB",
          price: "2450000.00",
          condoFee: "1850.00",
          iptuFee: "650.00",
          currency: "BRL",
          countryCode: "BR",
          state: "SP",
          city: "São Paulo",
          neighborhood: "Itaim Bibi",
          addressPublic: "Próximo ao Parque do Povo e Av. Horácio Lafer",
          addressExact: "Rua Tabapuã, 1120, Apto 142",
          showExactAddress: false,
          latitude: "-23.5855000",
          longitude: "-46.6812000",
          bedrooms: 3,
          bathrooms: 4,
          suites: 3,
          parkingSpots: 3,
          totalArea: "210.00",
          privateArea: "184.00",
          description: "Apartamento primoroso com acabamentos nobres, varanda integrada ao living espaçoso, climatização em todos os ambientes e iluminação automatizada. O condomínio oferece lazer completo de clube com piscina aquecida com raia, academia com equipamentos profissionais, quadra de tênis e segurança patrimonial 24h.",
          features: [
            "Piscina aquecida",
            "Varanda gourmet",
            "Academia equipada",
            "Portaria 24 horas",
            "3 Suítes",
            "Ar-condicionado",
            "Depósito privativo",
            "Vista livre"
          ],
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          virtualTourUrl: "",
          featured: true,
          brokerId: 1,
          agencyId: 1,
        },
        {
          code: "VTM-001022",
          slug: "casa-em-condominio-ecoville-curitiba-vtm001022",
          title: "Residência de Arquitetura Moderna em Condomínio Fechado no Ecoville",
          purpose: "comprar",
          type: "casa",
          status: "publicado",
          source: "ERP",
          price: "3890000.00",
          condoFee: "1400.00",
          iptuFee: "920.00",
          currency: "BRL",
          countryCode: "BR",
          state: "PR",
          city: "Curitiba",
          neighborhood: "Ecoville",
          addressPublic: "Condomínio Reserva do Bosque - Ecoville",
          addressExact: "Rua Monsenhor Ivo Zanlorenzi, 4300, Casa 18",
          showExactAddress: false,
          latitude: "-25.4431000",
          longitude: "-49.3402000",
          bedrooms: 4,
          bathrooms: 5,
          suites: 4,
          parkingSpots: 4,
          totalArea: "540.00",
          privateArea: "420.00",
          description: "Belíssima residência contemporânea assinada por arquiteto renomado. Sala de estar com pé-direito duplo, integração fluida com espaço gourmet e piscina privativa com borda infinita. Conta com piso aquecido, energia solar fotovoltaica e paisagismo exuberante com bosque nativo preservado.",
          features: [
            "Piscina privativa",
            "Espaço gourmet",
            "Energia solar",
            "Piso aquecido",
            "4 Suítes",
            "Condomínio clube fechado",
            "Bosque privativo",
            "Garagem coberta para 4 carros"
          ],
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "",
          virtualTourUrl: "",
          featured: true,
          brokerId: 2,
          agencyId: 1,
        },
        {
          code: "VTM-001023",
          slug: "departamento-premium-ykua-sati-asuncion-vtm001023",
          title: "Departamento de Lujo a Pasos de Shopping del Sol e Ykua Satí",
          purpose: "comprar",
          type: "apartamento",
          status: "publicado",
          source: "VENTIMOB",
          price: "1980000000.00", // ~265k USD em Guaraníes
          condoFee: "1200000.00",
          iptuFee: "450000.00",
          currency: "PYG",
          countryCode: "PY",
          state: "Distrito Capital",
          city: "Asunción",
          neighborhood: "Ykua Satí",
          addressPublic: "Cerca de Av. Aviadores del Chaco y Santa Teresa",
          addressExact: "Calle Mayor Bullo 1450, Piso 9",
          showExactAddress: false,
          latitude: "-25.2858000",
          longitude: "-57.5684000",
          bedrooms: 3,
          bathrooms: 3,
          suites: 2,
          parkingSpots: 2,
          totalArea: "175.00",
          privateArea: "152.00",
          description: "Exclusivo departamento en la zona corporativa más cotizada de Asunción. Amplio balcón con parrilla tradicional, cocina equipada con artefactos de última generación y vistas abiertas a la ciudad. El edificio cuenta con rooftop con piscina sinfín, quincho climatizado y gimnasio.",
          features: [
            "Balcón con parrilla",
            "Rooftop con piscina",
            "Quincho climatizado",
            "Gimnasio",
            "Seguridad 24/7",
            "Cochera techada doble",
            "Zona corporativa premium"
          ],
          images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "",
          virtualTourUrl: "",
          featured: true,
          brokerId: 3,
          agencyId: 2,
        },
        {
          code: "VTM-001024",
          slug: "studio-mobiliado-vila-madalena-locacao-vtm001024",
          title: "Studio Design Totalmente Mobiliado a 300m do Metrô Vila Madalena",
          purpose: "alugar",
          type: "apartamento",
          status: "publicado",
          source: "VENTIMOB",
          price: "4200.00",
          condoFee: "580.00",
          iptuFee: "120.00",
          currency: "BRL",
          countryCode: "BR",
          state: "SP",
          city: "São Paulo",
          neighborhood: "Vila Madalena",
          addressPublic: "Próximo à Rua Harmonia e Praça dos Cavalos",
          addressExact: "Rua Girassol, 850, Studio 54",
          showExactAddress: false,
          latitude: "-23.5539000",
          longitude: "-46.6908000",
          bedrooms: 1,
          bathrooms: 1,
          suites: 1,
          parkingSpots: 1,
          totalArea: "38.00",
          privateArea: "38.00",
          description: "Studio moderno pensado para quem busca mobilidade, estilo e praticidade. Mobiliado com marcenaria planejada sob medida, eletrodomésticos embutidos, ar-condicionado inverter e fechadura eletrônica. Edifício com coworking, lavanderia compartilhada OMO e terraço mirante.",
          features: [
            "Totalmente mobiliado",
            "Fechadura digital",
            "Coworking no prédio",
            "Lavanderia coletiva",
            "Próximo ao metrô",
            "Varanda ensolarada",
            "Pet friendly"
          ],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "",
          virtualTourUrl: "",
          featured: true,
          brokerId: 1,
          agencyId: 1,
        },
        {
          code: "VTM-001025",
          slug: "lote-residencial-alphaville-graciosa-curitiba-vtm001025",
          title: "Terreno Plano em Localização Privilegiada no Alphaville Graciosa",
          purpose: "comprar",
          type: "terreno",
          status: "publicado",
          source: "VENTIMOB",
          price: "890000.00",
          condoFee: "980.00",
          iptuFee: "310.00",
          currency: "BRL",
          countryCode: "BR",
          state: "PR",
          city: "Pinhais",
          neighborhood: "Alphaville Graciosa",
          addressPublic: "Alameda das Araucárias - Alphaville Graciosa",
          addressExact: "Alameda das Araucárias, Lote 14 Quadra B",
          showExactAddress: false,
          latitude: "-25.4050000",
          longitude: "-49.1620000",
          bedrooms: 0,
          bathrooms: 0,
          suites: 0,
          parkingSpots: 0,
          totalArea: "720.00",
          privateArea: "720.00",
          description: "Excelente lote de esquina com topografia plana, vista para o campo de golfe e infraestrutura subterrânea completa. O Alphaville Graciosa é referência máxima em segurança, contato com a natureza e qualidade de vida com clube social completo.",
          features: [
            "Topografia plana",
            "Lote de esquina",
            "Campo de golfe",
            "Segurança armada 24h",
            "Pronto para construir",
            "Clube social completo"
          ],
          images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "",
          virtualTourUrl: "",
          featured: false,
          brokerId: 2,
          agencyId: 1,
        },
        {
          code: "VTM-001026",
          slug: "conjunto-comercial-av-paulista-sao-paulo-vtm001026",
          title: "Conjunto Comercial Corporativo com Vista na Avenida Paulista",
          purpose: "alugar",
          type: "comercial",
          status: "publicado",
          source: "API",
          price: "16500.00",
          condoFee: "3200.00",
          iptuFee: "1400.00",
          currency: "BRL",
          countryCode: "BR",
          state: "SP",
          city: "São Paulo",
          neighborhood: "Bela Vista",
          addressPublic: "Avenida Paulista, altura do MASP",
          addressExact: "Avenida Paulista, 1578, Conjunto 121",
          showExactAddress: false,
          latitude: "-23.5614000",
          longitude: "-46.6559000",
          bedrooms: 0,
          bathrooms: 3,
          suites: 0,
          parkingSpots: 3,
          totalArea: "195.00",
          privateArea: "170.00",
          description: "Conjunto corporativo pronto para ocupação imediata em edifício Triple A. Piso elevado, forro acústico modular com luminárias em LED, ar-condicionado central VRF e 3 vagas de garagem com manobrista. A poucos passos das estações Trianon-Masp e Consolação.",
          features: [
            "Piso elevado",
            "Ar-condicionado VRF",
            "Edifício Triple A",
            "3 Vagas de garagem",
            "Controle de acesso por biometria",
            "Gerador para áreas privativas"
          ],
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
          ],
          videoUrl: "",
          virtualTourUrl: "",
          featured: false,
          brokerId: 1,
          agencyId: 1,
        },
      ]);
      console.log("[Seed] Imóveis cadastrados com sucesso.");
    }
  } catch (error) {
    console.error("[Seed] Erro ao popular dados iniciais:", error);
  }
}
