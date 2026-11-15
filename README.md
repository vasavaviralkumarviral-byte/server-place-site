# Server Place SMP — website starter

A responsive public Minecraft server hub with Java + Bedrock connection details, a live-status endpoint, and protected start/stop/restart controls.

## Important hosting reality

- This website does **not** host Minecraft by itself.
- Aternos says its free servers automatically stop when the last player leaves; it does not offer 24/7 hosting. Do not use bots to bypass that rule.
- To keep a server online continuously, you need a machine or host that permits an always-running process. A genuinely free option may have limits, eligibility rules, capacity constraints, or reclaim policies.
- Java + Bedrock crossplay uses a Java server (for example Paper) plus GeyserMC and usually Floodgate. Bedrock needs a reachable Bedrock port (normally 19132 over UDP; follow the current Geyser instructions for your version/host).

## Run the website locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

The site can be previewed before hosting is connected. It will show `Awaiting Hosting` until valid panel details are supplied.

## Connect a compatible hosting panel

This starter's admin API is designed for a Pterodactyl-compatible **Client API** panel:

1. Create a server in a compatible panel.
2. Create a client API key with only the permissions required for power actions and reading server resources.
3. Set `PTERODACTYL_URL`, `PTERODACTYL_SERVER_ID`, and `PTERODACTYL_API_KEY` in `.env`.
4. Set a long random `ADMIN_TOKEN`.
5. Set the public Java and Bedrock addresses/ports.
6. Restart the website process.

Never put the Pterodactyl API key in browser JavaScript, public source code, screenshots, or a public Git repository. Keep `.env` private. Put the website behind HTTPS before exposing admin controls to the internet. Consider adding login rate-limits and an IP allowlist for a public deployment.

Not every free Minecraft host provides a Pterodactyl API or permits external power controls. Aternos is not compatible with this control panel approach.

## Crossplay setup

Use a Paper server and follow the official GeyserMC setup guide for the exact current Minecraft version. Install Geyser-Spigot in `plugins`; install Floodgate if you want Bedrock players to authenticate without owning a Java Edition account. Configure the Bedrock listener and make its port reachable on the required protocols. Do not assume every host supports the extra UDP/TCP port allocation.

Official guide: https://geysermc.org/wiki/geyser/setup/

## Current status

This is a starter website, not a deployed public website. No real server address, host account, API key, or live server is configured yet.
