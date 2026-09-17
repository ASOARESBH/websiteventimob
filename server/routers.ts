import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createLead,
  getAdminSummary,
  getAllSiteSettings,
  getAgencyBySlug,
  getBrokerBySlug,
  getFeaturedProperties,
  getPropertyBySlugOrCode,
  listActiveCountries,
  listAgencies,
  listBrokers,
  registerBrokerInterest,
  searchProperties,
  updatePropertyStatus,
  updateSiteSetting,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ==========================================
  // CONFIGURAÇÕES GLOBAIS & LOCALIZAÇÃO
  // ==========================================
  config: router({
    getSettings: publicProcedure.query(async () => {
      return getAllSiteSettings();
    }),
    getCountries: publicProcedure.query(async () => {
      return listActiveCountries();
    }),
  }),

  // ==========================================
  // BUSCA & IMÓVEIS
  // ==========================================
  properties: router({
    search: publicProcedure
      .input(
        z.object({
          query: z.string().optional(),
          purpose: z.enum(["comprar", "alugar"]).optional(),
          type: z.enum(["casa", "apartamento", "terreno", "comercial", "cobertura", "lancamento"]).optional(),
          countryCode: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          bedrooms: z.number().optional(),
          bathrooms: z.number().optional(),
          parkingSpots: z.number().optional(),
          featuredOnly: z.boolean().optional(),
          brokerId: z.number().optional(),
          agencyId: z.number().optional(),
          sortBy: z.enum(["relevance", "recent", "price_asc", "price_desc"]).optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        })
      )
      .query(async ({ input }) => {
        return searchProperties(input);
      }),

    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getFeaturedProperties(input?.limit ?? 6);
      }),

    getBySlugOrCode: publicProcedure
      .input(z.object({ identifier: z.string() }))
      .query(async ({ input }) => {
        return getPropertyBySlugOrCode(input.identifier);
      }),
  }),

  // ==========================================
  // CORRETORES & IMOBILIÁRIAS
  // ==========================================
  brokers: router({
    list: publicProcedure
      .input(
        z.object({
          countryCode: z.string().optional(),
          search: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return listBrokers(input ?? {});
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBrokerBySlug(input.slug);
      }),
  }),

  agencies: router({
    list: publicProcedure
      .input(
        z.object({
          countryCode: z.string().optional(),
          search: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return listAgencies(input ?? {});
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getAgencyBySlug(input.slug);
      }),
  }),

  // ==========================================
  // LEADS & CADASTROS
  // ==========================================
  leads: router({
    create: publicProcedure
      .input(
        z.object({
          propertyId: z.number().optional(),
          brokerId: z.number().optional(),
          agencyId: z.number().optional(),
          name: z.string().min(2, "Nome é obrigatório"),
          email: z.string().email("E-mail inválido"),
          phone: z.string().min(6, "Telefone é obrigatório"),
          message: z.string().min(4, "Mensagem é obrigatória"),
          origin: z.string().optional(),
          countryCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createLead(input);
      }),

    registerBroker: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          phone: z.string().min(6),
          whatsapp: z.string().min(6),
          countryCode: z.string(),
          state: z.string(),
          city: z.string(),
          creci: z.string(),
          professionalType: z.enum(["autonomo", "imobiliaria"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return registerBrokerInterest(input);
      }),
  }),

  // ==========================================
  // PAINEL ADMINISTRATIVO & CMS (admin.php equivalente)
  // ==========================================
  admin: router({
    getSummary: publicProcedure.query(async () => {
      return getAdminSummary();
    }),

    updateSetting: publicProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return updateSiteSetting(input.key, input.value, input.description);
      }),

    updatePropertyStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "rascunho",
            "pendente",
            "publicado",
            "pausado",
            "vendido",
            "alugado",
            "expirado",
            "cancelado",
          ]),
        })
      )
      .mutation(async ({ input }) => {
        return updatePropertyStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
