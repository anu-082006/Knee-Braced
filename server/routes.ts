import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch"; // 👈 install with: npm install node-fetch
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // 🟢 Health check route
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "Server is running 🚀" });
  });

  // 🟢 Example route using your storage (you can modify later)
  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers?.();
      res.json(users || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // 🟢 Forward patient data to n8n (production)
  app.post("/api/n8n/patient-query", async (req: Request, res: Response) => {
    try {
      const response = await fetch("https://hackgroup.app.n8n.cloud/webhook/patient-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("❌ Error forwarding to n8n:", error);
      res.status(500).json({ error: "Failed to reach n8n webhook" });
    }
  });

  // 🧪 Forward to n8n test webhook
  app.post("/api/n8n/patient-query-test", async (req: Request, res: Response) => {
    try {
      const response = await fetch("https://hackgroup.app.n8n.cloud/webhook-test/patient-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("❌ Error contacting n8n test webhook:", error);
      res.status(500).json({ error: "Failed to reach n8n test webhook" });
    }
  });

  // 🔧 Create HTTP server
  const httpServer = createServer(app);
  console.log("✅ Routes registered successfully");
  return httpServer;
}
