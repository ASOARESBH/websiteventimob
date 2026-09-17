import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { searchProperties, getPropertyBySlugOrCode, listBrokers, listAgencies, createLead } from "../db";
import { seedInitialData } from "../seed";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Executar seed inicial para garantir dados fictícios ricos e consistentes
  try {
    await seedInitialData();
  } catch (err) {
    console.error("[Startup] Seed error:", err);
  }

  // ==========================================
  // REST API PARA ERP & INTEGRAÇÕES EXTERNAS
  // Conforme Seção 36 e 48 do documento de produto
  // ==========================================
  app.get("/api/v1/properties", async (req, res) => {
    try {
      const { purpose, type, countryCode, city, minPrice, maxPrice, limit, offset } = req.query;
      const data = await searchProperties({
        purpose: purpose as any,
        type: type as any,
        countryCode: countryCode as string,
        city: city as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
      });
      res.json({ success: true, count: data.items.length, data: data.items });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/v1/properties/:identifier", async (req, res) => {
    try {
      const property = await getPropertyBySlugOrCode(req.params.identifier);
      if (!property) {
        return res.status(404).json({ success: false, error: "Property not found" });
      }
      res.json({ success: true, data: property });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/v1/brokers", async (req, res) => {
    try {
      const data = await listBrokers({
        countryCode: req.query.countryCode as string,
        search: req.query.search as string,
      });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/v1/agencies", async (req, res) => {
    try {
      const data = await listAgencies({
        countryCode: req.query.countryCode as string,
        search: req.query.search as string,
      });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/leads", async (req, res) => {
    try {
      await createLead(req.body);
      res.status(201).json({ success: true, message: "Lead registrado com sucesso" });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // tRPC Setup
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Frontend & Vite setup
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
