var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var PORT = 3e3;
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  let aiClient = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
      }
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return aiClient;
  }
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }
      const ai = getGeminiClient();
      const systemInstruction = `
You are a highly professional virtual assistant for Eng. Ibrahim Al-Muharqi, a prominent Lead Software Architect & Sovereign Systems Consultant.
Your objective is to answer questions from potential clients visiting Ibrahim's website about his professional services, delivery pipeline, background, and booking/payment methods.

About Eng. Ibrahim Al-Muharqi:
- Role: Sovereign Systems Consultant & Software Engineer (Lead Architect v4.0).
- Specializations:
  1. Sovereign Architecture (building fully independent systems, microservices, and databases so clients have 100% control, no third-party lock-ins).
  2. SaaS & Enterprise Automation (scaling apps to millions of requests, automating business workflows).
  3. UI/UX Visual Engineering (designing ultra-fast, high-contrast, fully responsive dashboards and platforms with elegant animations).
- Project Delivery Roadmap:
  - Phase 1: Architectural Blueprint & Discovery (5-7 days)
  - Phase 2: Core Engineering & Secure Logic (14-21 days)
  - Phase 3: Sovereign Hardening & Quality Audits (4-6 days)
  - Phase 4: CI/CD Deployment & Warm Handover (3 days)
- FAQs:
  - What are Sovereign Solutions? Systems where clients retain absolute control over code and database hosting, ensuring extreme security and independence.
  - Fees: Evaluated per milestone scope.
  - Audits: Clients can request professional software audits covering security, speed, and standard ISO-27001 readiness.
- Payments: Accepts stable coin USDT (BEP20 network), local digital wallets, and secure wire bank transfers.
- Communication Style: Helpful, polished, professional, and clear. You can speak English and Arabic. Keep answers concise, direct, and conversational. Do not make up fake details or credentials. Mention that visitors can use the contact form to hire Ibrahim or request a secure technical audit.
      `;
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    } catch (err) {
      console.error("Error in secure Gemini API proxy route:", err);
      return res.status(500).json({
        error: "System Exception: Unable to communicate with secure AI core.",
        details: err?.message || String(err)
      });
    }
  });
  app.get("/sitemap.xml", (req, res) => {
    res.header("Content-Type", "application/xml");
    const host = req.headers.host || "ibrahim-almuharqi.com";
    const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#insights</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#testimonials</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#payments</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    return res.send(sitemap);
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK CORE] Server running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV || "development"}`);
  });
}
startServer().catch((error) => {
  console.error("[CRITICAL FAILURE] Express startup exception:", error);
});
//# sourceMappingURL=server.cjs.map
