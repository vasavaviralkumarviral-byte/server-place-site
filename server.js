import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const config = {
  panelUrl: (process.env.PTERODACTYL_URL || "").replace(/\/$/, ""),
  serverId: process.env.PTERODACTYL_SERVER_ID || "",
  apiKey: process.env.PTERODACTYL_API_KEY || "",
  adminToken: process.env.ADMIN_TOKEN || "",
};

const configured = Boolean(config.panelUrl && config.serverId && config.apiKey);

function requireAdmin(req, res, next) {
  if (!config.adminToken) return res.status(503).json({ error: "Admin access is not configured." });
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${config.adminToken}`) return res.status(401).json({ error: "Unauthorized" });
  next();
}

async function panelRequest(endpoint, options = {}) {
  const response = await fetch(`${config.panelUrl}/api/client/servers/${config.serverId}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "Application/vnd.pterodactyl.v1+json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.errors?.[0]?.detail || `Panel returned ${response.status}`);
  return body;
}

app.get("/api/config", (_req, res) => {
  res.json({
    serverName: process.env.SERVER_NAME || "Server Place SMP",
    javaAddress: process.env.JAVA_ADDRESS || "Not configured",
    javaPort: process.env.JAVA_PORT || "25565",
    bedrockAddress: process.env.BEDROCK_ADDRESS || process.env.JAVA_ADDRESS || "Not configured",
    bedrockPort: process.env.BEDROCK_PORT || "19132",
    connected: configured
  });
});

app.get("/api/status", async (_req, res) => {
  if (!configured) return res.json({ configured: false, state: "unconfigured", players: null, memory: null });
  try {
    const data = await panelRequest("/resources");
    const attr = data.attributes || {};
    const state = attr.current_state || "unknown";
    const players = attr.relationships?.allocations?.data?.length ?? null;
    res.json({
      configured: true,
      state,
      players,
      memory: attr.resources?.memory_bytes ?? null,
      cpu: attr.resources?.cpu_absolute ?? null
    });
  } catch (error) {
    res.status(502).json({ configured: true, state: "unknown", error: error.message });
  }
});

app.post("/api/power", requireAdmin, async (req, res) => {
  if (!configured) return res.status(503).json({ error: "Connect a compatible hosting panel first." });
  const signal = req.body?.signal;
  if (!["start", "stop", "restart"].includes(signal)) return res.status(400).json({ error: "Invalid power action." });
  try {
    await panelRequest("/power", { method: "POST", body: JSON.stringify({ signal }) });
    res.json({ ok: true, message: `${signal} command sent.` });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`Server Place hub listening on port ${PORT}`));
