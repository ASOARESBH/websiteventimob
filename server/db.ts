import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  agencies,
  brokerRegistrations,
  brokers,
  countries,
  InsertUser,
  leads,
  properties,
  siteSettings,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==========================================
// PORTAL & BUSCA DE IMÓVEIS
// ==========================================

export interface PropertySearchParams {
  query?: string;
  purpose?: "comprar" | "alugar";
  type?: "casa" | "apartamento" | "terreno" | "comercial" | "cobertura" | "lancamento";
  countryCode?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  featuredOnly?: boolean;
  brokerId?: number;
  agencyId?: number;
  sortBy?: "relevance" | "recent" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
}

export async function searchProperties(params: PropertySearchParams = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [eq(properties.status, "publicado")];

  if (params.purpose) {
    conditions.push(eq(properties.purpose, params.purpose));
  }

  if (params.type) {
    conditions.push(eq(properties.type, params.type));
  }

  if (params.countryCode && params.countryCode !== "ALL") {
    conditions.push(eq(properties.countryCode, params.countryCode));
  }

  if (params.city) {
    conditions.push(likeMatch(properties.city, params.city));
  }

  if (params.state) {
    conditions.push(likeMatch(properties.state, params.state));
  }

  if (params.minPrice !== undefined && params.minPrice > 0) {
    conditions.push(gte(properties.price, params.minPrice.toString()));
  }

  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    conditions.push(lte(properties.price, params.maxPrice.toString()));
  }

  if (params.bedrooms && params.bedrooms > 0) {
    conditions.push(gte(properties.bedrooms, params.bedrooms));
  }

  if (params.bathrooms && params.bathrooms > 0) {
    conditions.push(gte(properties.bathrooms, params.bathrooms));
  }

  if (params.parkingSpots && params.parkingSpots > 0) {
    conditions.push(gte(properties.parkingSpots, params.parkingSpots));
  }

  if (params.featuredOnly) {
    conditions.push(eq(properties.featured, true));
  }

  if (params.brokerId) {
    conditions.push(eq(properties.brokerId, params.brokerId));
  }

  if (params.agencyId) {
    conditions.push(eq(properties.agencyId, params.agencyId));
  }

  if (params.query && params.query.trim().length > 0) {
    const q = params.query.trim();
    conditions.push(
      or(
        likeMatch(properties.title, q),
        likeMatch(properties.city, q),
        likeMatch(properties.neighborhood, q),
        likeMatch(properties.code, q),
        likeMatch(properties.state, q),
        likeMatch(properties.description, q)
      )!
    );
  }

  const whereClause = and(...conditions);

  let queryBuilder = db
    .select({
      property: properties,
      broker: brokers,
      agency: agencies,
    })
    .from(properties)
    .leftJoin(brokers, eq(properties.brokerId, brokers.id))
    .leftJoin(agencies, eq(properties.agencyId, agencies.id))
    .where(whereClause);

  switch (params.sortBy) {
    case "price_asc":
      queryBuilder = queryBuilder.orderBy(properties.price) as any;
      break;
    case "price_desc":
      queryBuilder = queryBuilder.orderBy(desc(properties.price)) as any;
      break;
    case "recent":
      queryBuilder = queryBuilder.orderBy(desc(properties.createdAt)) as any;
      break;
    default:
      queryBuilder = queryBuilder.orderBy(desc(properties.featured), desc(properties.createdAt)) as any;
  }

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const results = await queryBuilder.limit(limit).offset(offset);

  return {
    items: results.map((row) => ({
      ...row.property,
      broker: row.broker,
      agency: row.agency,
    })),
    total: results.length,
  };
}

function likeMatch(column: any, term: string) {
  return sql`LOWER(${column}) LIKE ${`%${term.toLowerCase()}%`}`;
}

export async function getPropertyBySlugOrCode(identifier: string) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select({
      property: properties,
      broker: brokers,
      agency: agencies,
    })
    .from(properties)
    .leftJoin(brokers, eq(properties.brokerId, brokers.id))
    .leftJoin(agencies, eq(properties.agencyId, agencies.id))
    .where(or(eq(properties.slug, identifier), eq(properties.code, identifier)))
    .limit(1);

  if (results.length === 0) return null;
  const row = results[0];
  return {
    ...row.property,
    broker: row.broker,
    agency: row.agency,
  };
}

export async function getFeaturedProperties(limit = 6) {
  return searchProperties({ featuredOnly: true, limit });
}

// ==========================================
// CORRETORES & IMOBILIÁRIAS
// ==========================================

export async function listBrokers(params: { countryCode?: string; search?: string } = {}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(brokers.active, true)];
  if (params.countryCode && params.countryCode !== "ALL") {
    conditions.push(eq(brokers.countryCode, params.countryCode));
  }
  if (params.search) {
    conditions.push(
      or(
        likeMatch(brokers.name, params.search),
        likeMatch(brokers.city, params.search),
        likeMatch(brokers.creci, params.search),
        likeMatch(brokers.specialty, params.search)
      )!
    );
  }

  const results = await db
    .select({
      broker: brokers,
      agency: agencies,
    })
    .from(brokers)
    .leftJoin(agencies, eq(brokers.agencyId, agencies.id))
    .where(and(...conditions))
    .orderBy(desc(brokers.rating));

  return results.map((r) => ({
    ...r.broker,
    agency: r.agency,
  }));
}

export async function getBrokerBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select({
      broker: brokers,
      agency: agencies,
    })
    .from(brokers)
    .leftJoin(agencies, eq(brokers.agencyId, agencies.id))
    .where(eq(brokers.slug, slug))
    .limit(1);

  if (results.length === 0) return null;
  const brokerData = {
    ...results[0].broker,
    agency: results[0].agency,
  };

  const brokerProperties = await searchProperties({ brokerId: brokerData.id, limit: 12 });
  return {
    broker: brokerData,
    properties: brokerProperties.items,
  };
}

export async function listAgencies(params: { countryCode?: string; search?: string } = {}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(agencies.active, true)];
  if (params.countryCode && params.countryCode !== "ALL") {
    conditions.push(eq(agencies.countryCode, params.countryCode));
  }
  if (params.search) {
    conditions.push(
      or(
        likeMatch(agencies.name, params.search),
        likeMatch(agencies.city, params.search),
        likeMatch(agencies.creci, params.search)
      )!
    );
  }

  return db
    .select()
    .from(agencies)
    .where(and(...conditions))
    .orderBy(desc(agencies.teamSize));
}

export async function getAgencyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const agencyRows = await db.select().from(agencies).where(eq(agencies.slug, slug)).limit(1);
  if (agencyRows.length === 0) return null;

  const agency = agencyRows[0];
  const agencyProperties = await searchProperties({ agencyId: agency.id, limit: 12 });
  const agencyBrokers = await db.select().from(brokers).where(eq(brokers.agencyId, agency.id));

  return {
    agency,
    properties: agencyProperties.items,
    brokers: agencyBrokers,
  };
}

// ==========================================
// PAÍSES & LOCALIZAÇÃO
// ==========================================

export async function listActiveCountries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(countries).where(eq(countries.active, true)).orderBy(countries.id);
}

// ==========================================
// LEADS & CAPTAÇÃO DE CORRETORES
// ==========================================

export async function createLead(data: {
  propertyId?: number;
  brokerId?: number;
  agencyId?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  origin?: string;
  countryCode?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  await db.insert(leads).values({
    propertyId: data.propertyId ?? null,
    brokerId: data.brokerId ?? null,
    agencyId: data.agencyId ?? null,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    origin: data.origin || "portal_web",
    countryCode: data.countryCode || "BR",
    status: "novo",
  });

  return { success: true };
}

export async function registerBrokerInterest(data: {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  countryCode: string;
  state: string;
  city: string;
  creci: string;
  professionalType: "autonomo" | "imobiliaria";
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  await db.insert(brokerRegistrations).values(data);
  return { success: true };
}

// ==========================================
// CONFIGURAÇÃO CENTRALIZADA (admin.php / CMS)
// ==========================================

export async function getAllSiteSettings() {
  const db = await getDb();
  if (!db) return {};

  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function updateSiteSetting(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  await db
    .insert(siteSettings)
    .values({ key, value, description })
    .onDuplicateKeyUpdate({
      set: { value, updatedAt: new Date() },
    });

  return { success: true };
}

export async function getAdminSummary() {
  const db = await getDb();
  if (!db) {
    return {
      propertiesCount: 0,
      brokersCount: 0,
      agenciesCount: 0,
      leadsCount: 0,
      registrationsCount: 0,
      recentLeads: [],
      recentRegistrations: [],
      allProperties: [],
    };
  }

  const [props, brks, agcs, lds, regs] = await Promise.all([
    db.select().from(properties).orderBy(desc(properties.id)),
    db.select().from(brokers).orderBy(desc(brokers.id)),
    db.select().from(agencies).orderBy(desc(agencies.id)),
    db.select().from(leads).orderBy(desc(leads.id)).limit(10),
    db.select().from(brokerRegistrations).orderBy(desc(brokerRegistrations.id)).limit(10),
  ]);

  return {
    propertiesCount: props.length,
    brokersCount: brks.length,
    agenciesCount: agcs.length,
    leadsCount: lds.length,
    registrationsCount: regs.length,
    recentLeads: lds,
    recentRegistrations: regs,
    allProperties: props,
  };
}

export async function updatePropertyStatus(id: number, status: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  await db.update(properties).set({ status, updatedAt: new Date() }).where(eq(properties.id, id));
  return { success: true };
}
