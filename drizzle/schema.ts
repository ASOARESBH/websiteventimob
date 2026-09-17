import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "broker", "agency_admin", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // BR, PY, PA, CR
  name: varchar("name", { length: 100 }).notNull(),
  flagEmoji: varchar("flagEmoji", { length: 10 }).notNull(),
  phoneCode: varchar("phoneCode", { length: 10 }).notNull(), // +55, +595
  defaultCurrency: varchar("defaultCurrency", { length: 10 }).notNull(), // BRL, PYG, USD
  currencySymbol: varchar("currencySymbol", { length: 10 }).notNull(), // R$, ₲, $
  defaultLanguage: varchar("defaultLanguage", { length: 10 }).notNull(), // pt-BR, es-PY
  whatsappNumber: varchar("whatsappNumber", { length: 30 }).notNull().default(""),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const agencies = mysqlTable("agencies", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  logoUrl: text("logoUrl"),
  countryCode: varchar("countryCode", { length: 10 }).notNull().default("BR"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  address: text("address"),
  description: text("description"),
  phone: varchar("phone", { length: 30 }),
  whatsapp: varchar("whatsapp", { length: 30 }),
  email: varchar("email", { length: 150 }),
  website: varchar("website", { length: 255 }),
  creci: varchar("creci", { length: 50 }),
  teamSize: int("teamSize").default(1),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const brokers = mysqlTable("brokers", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  userId: int("userId"),
  agencyId: int("agencyId"),
  name: varchar("name", { length: 150 }).notNull(),
  avatarUrl: text("avatarUrl"),
  creci: varchar("creci", { length: 50 }).notNull(),
  countryCode: varchar("countryCode", { length: 10 }).notNull().default("BR"),
  state: varchar("state", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  whatsapp: varchar("whatsapp", { length: 30 }),
  email: varchar("email", { length: 150 }),
  specialty: varchar("specialty", { length: 120 }), // Alto padrão, Residencial, Comercial, Lançamentos
  bio: text("bio"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.90"),
  dealsCount: int("dealsCount").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(), // e.g. VTM-001021
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  purpose: mysqlEnum("purpose", ["comprar", "alugar"]).notNull(),
  type: mysqlEnum("type", ["casa", "apartamento", "terreno", "comercial", "cobertura", "lancamento"]).notNull(),
  status: mysqlEnum("status", [
    "rascunho",
    "pendente",
    "publicado",
    "pausado",
    "vendido",
    "alugado",
    "expirado",
    "cancelado"
  ]).default("publicado").notNull(),
  source: mysqlEnum("source", ["VENTIMOB", "ERP", "API", "IMPORTACAO"]).default("VENTIMOB").notNull(),
  price: decimal("price", { precision: 14, scale: 2 }).notNull(),
  condoFee: decimal("condoFee", { precision: 12, scale: 2 }),
  iptuFee: decimal("iptuFee", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("BRL").notNull(),
  countryCode: varchar("countryCode", { length: 10 }).default("BR").notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 120 }).notNull(),
  addressPublic: varchar("addressPublic", { length: 255 }), // approximate
  addressExact: text("addressExact"), // broker view / authorized only
  showExactAddress: boolean("showExactAddress").default(false).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  bedrooms: int("bedrooms").default(0).notNull(),
  bathrooms: int("bathrooms").default(0).notNull(),
  suites: int("suites").default(0).notNull(),
  parkingSpots: int("parkingSpots").default(0).notNull(),
  totalArea: decimal("totalArea", { precision: 10, scale: 2 }),
  privateArea: decimal("privateArea", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  features: json("features").$type<string[]>(), // ["Piscina", "Varanda Gourmet", "Academia"]
  images: json("images").$type<string[]>(),
  videoUrl: text("videoUrl"),
  virtualTourUrl: text("virtualTourUrl"),
  featured: boolean("featured").default(false).notNull(),
  brokerId: int("brokerId"),
  agencyId: int("agencyId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId"),
  brokerId: int("brokerId"),
  agencyId: int("agencyId"),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  message: text("message").notNull(),
  origin: varchar("origin", { length: 50 }).default("portal_web").notNull(),
  countryCode: varchar("countryCode", { length: 10 }).default("BR").notNull(),
  status: mysqlEnum("status", ["novo", "em_atendimento", "visita_agendada", "convertido", "arquivado"]).default("novo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const brokerRegistrations = mysqlTable("broker_registrations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 30 }).notNull(),
  countryCode: varchar("countryCode", { length: 10 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  creci: varchar("creci", { length: 50 }).notNull(),
  professionalType: mysqlEnum("professionalType", ["autonomo", "imobiliaria"]).notNull(),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado"]).default("pendente").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Country = typeof countries.$inferSelect;
export type Agency = typeof agencies.$inferSelect;
export type Broker = typeof brokers.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type BrokerRegistration = typeof brokerRegistrations.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
