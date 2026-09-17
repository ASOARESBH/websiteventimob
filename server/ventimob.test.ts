import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Ventimob Core Backend Test Suite", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  it("deve carregar as configurações de CMS e textos globais", async () => {
    const settings = await caller.config.getSettings();
    expect(settings).toBeDefined();
    expect(settings["site_name"]).toBe("Ventimob");
    expect(settings["site_tagline"]).toContain("movimento");
  });

  it("deve listar os países ativos com moedas e códigos de telefone (Brasil e Paraguai)", async () => {
    const countries = await caller.config.getCountries();
    expect(countries.length).toBeGreaterThanOrEqual(2);
    const br = countries.find((c) => c.code === "BR");
    const py = countries.find((c) => c.code === "PY");

    expect(br).toBeDefined();
    expect(br?.defaultCurrency).toBe("BRL");
    expect(br?.phoneCode).toBe("+55");

    expect(py).toBeDefined();
    expect(py?.defaultCurrency).toBe("PYG");
    expect(py?.phoneCode).toBe("+595");
  });

  it("deve realizar busca universal de imóveis e retornar itens publicados", async () => {
    const result = await caller.properties.search({
      purpose: "comprar",
      limit: 10,
    });
    expect(result).toBeDefined();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]).toHaveProperty("code");
    expect(result.items[0]).toHaveProperty("title");
    expect(result.items[0]).toHaveProperty("price");
  });

  it("deve buscar imóvel por código ou slug com sucesso", async () => {
    const property = await caller.properties.getBySlugOrCode({
      identifier: "VTM-001021",
    });
    expect(property).toBeDefined();
    expect(property?.code).toBe("VTM-001021");
    expect(property?.city).toBe("São Paulo");
  });

  it("deve listar corretores ativos com CRECI e avaliação", async () => {
    const brokers = await caller.brokers.list();
    expect(brokers.length).toBeGreaterThan(0);
    expect(brokers[0].creci).toBeDefined();
    expect(Number(brokers[0].rating)).toBeGreaterThan(4.0);
  });

  it("deve registrar um novo lead com código de imóvel e mensagem", async () => {
    const res = await caller.leads.create({
      name: "Cliente Teste Vitest",
      email: "cliente.teste@exemplo.com",
      phone: "+55 11 98888-7777",
      message: "Gostaria de agendar visita para o imóvel VTM-001021.",
      origin: "test_suite",
      countryCode: "BR",
    });
    expect(res).toEqual({ success: true });
  });
});
