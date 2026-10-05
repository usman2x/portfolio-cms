# OCI VM deployment

This runbook deploys Payload CMS directly on Ubuntu 22.04 using Node.js 22 through NVM, a serverless PostgreSQL database, systemd, and Caddy.

## Production layout

- Repository: `/srv/portfolio/portfolio-cms`
- CMS process: `http://127.0.0.1:3001`
- Public CMS and admin: `https://cms.themuhammadusman.com`
- Public UI (allowed CORS origin): `https://www.themuhammadusman.com`
- Process manager: `portfolio-cms.service`
- Reverse proxy and TLS: Caddy, configured in the UI repository's OCI runbook
- Database: external PostgreSQL; port 5432 is not opened on OCI

The hostnames are configuration only: they live in `.env` here, in the UI `.env.production`, in DNS, and in the Caddyfile.

The CMS is not reachable on the bare IP: `http://<PUBLIC_IP>:8080` now serves only the rem-labs deployment that shares this VM, and returns `404` for portfolio paths. See "Shared VM", "Caddy", and "Backups and rollback" in the UI repository's OCI runbook before changing Caddy, the firewall, or environment files.

## First deployment

```bash
cd /srv/portfolio
git clone https://github.com/usman2x/portfolio-cms.git portfolio-cms
cd portfolio-cms
nvm install 22
nvm use 22
cp .env.example .env
chmod 600 .env
nano .env
npm ci
npm run db:check
npm run migrate
npm run migrate:status
set -a
source .env
set +a
npm run build
```

Minimum production environment:

```dotenv
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=verify-full&channel_binding=require"
DB_SCHEMA=cms
PAYLOAD_SECRET="<openssl-rand-hex-32-output>"
NEXT_PUBLIC_SERVER_URL=https://cms.themuhammadusman.com
CMS_API_URL=http://127.0.0.1:3001
UI_PUBLIC_URL=https://www.themuhammadusman.com
QUOTE_ALLOWED_ORIGINS=https://www.themuhammadusman.com,https://themuhammadusman.com
LOG_DIR=/srv/portfolio/portfolio-cms/logs
```

Generate `PAYLOAD_SECRET` with `openssl rand -hex 32`. Never commit `.env`.

`NEXT_PUBLIC_SERVER_URL` is compiled into the admin build, so rebuild after changing it. It is also Payload's `serverURL`: it is the only origin allowed to use admin cookie auth (plus optional `CSRF_ALLOWED_ORIGINS`), and an `https://` value makes the `portfolio-token` auth cookie `Secure`. Five failed logins lock an account for 15 minutes; an administrator can unlock it. The CMS listens on `127.0.0.1:3001` only. The quote endpoint accepts browser requests only from `UI_PUBLIC_URL` and the comma-separated `QUOTE_ALLOWED_ORIGINS`; each value must match the browser origin exactly (scheme and host, no trailing slash). `http://localhost:3000` is allowed only when `NODE_ENV` is not `production`.

## systemd

Create `/etc/systemd/system/portfolio-cms.service`:

```ini
[Unit]
Description=Portfolio Payload CMS
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/srv/portfolio/portfolio-cms
Environment=NODE_ENV=production
Environment=NVM_DIR=/home/ubuntu/.nvm
EnvironmentFile=/srv/portfolio/portfolio-cms/.env
ExecStart=/bin/bash -lc 'source /home/ubuntu/.nvm/nvm.sh && exec npm run start'
Restart=on-failure
RestartSec=5
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-cms
sudo systemctl status portfolio-cms --no-pager
curl -I http://127.0.0.1:3001/admin
```

Caddy publishes the service on `https://cms.themuhammadusman.com`; see the UI repository's OCI runbook for the Caddyfile, DNS, and firewall rules.

## Updates

Production normally updates through the UI repository's `npm run deploy:oci`, which runs the steps
below for the CMS and then rebuilds the UI. It deploys `main`; see "Release flow" in the UI
repository's runbook. The manual CMS-only equivalent:

```bash
cd /srv/portfolio/portfolio-cms
git pull --ff-only origin main
nvm use 22
npm ci
npm run db:check
npm run migrate
set -a
source .env
set +a
npm run build
sudo systemctl restart portfolio-cms
curl -I http://127.0.0.1:3001/admin
```

Run migrations before restarting into the new build. Rebuild the UI after publishing content because the UI is statically exported.

The OCI deployment uses the UI repository's loopback-only deployment listener to automate that rebuild. Configure:

```dotenv
UI_DEPLOY_WEBHOOK_URL=http://127.0.0.1:9010/deploy
UI_DEPLOY_WEBHOOK_TOKEN=<shared-random-token>
```

Restart `portfolio-cms` after changing `.env`. Publishing posts, testimonials, work experience, or globals then sends an authenticated rebuild request. The listener debounces batches and rebuilds the static UI without restarting Caddy. See the UI repository's OCI runbook for its systemd service.

## Optional canonical seed

`npm run seed:core` idempotently loads permanent site content: case studies, project media, required tags, services, testimonials, work experience, and site globals. `npm run seed:dev` loads the same content plus test writings and should not be used in production.

Seeding is intentionally deferred in the initial OCI deployment. The schema migration and service deployment are complete without it. When content initialization is approved, run the seed against `http://127.0.0.1:3001`, then rebuild the static UI.

The seed updates records by slug, name, or company and replaces every global it defines. Once content has been edited in Payload Admin, do not run it against production: it would overwrite those edits. Change production content in the admin instead.

Use temporary shell variables so administrator credentials are not saved in `.env` or shell history:

```bash
read -r -p "Admin email: " SEED_ADMIN_EMAIL
read -r -s -p "Admin password: " SEED_ADMIN_PASSWORD
echo
export SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD
export CMS_API_URL=http://127.0.0.1:3001
npm run seed:core
unset SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD CMS_API_URL
```

## Remaining production steps

1. Enter the content added by the 2026-10-05 release in Payload Admin (sections stay hidden until
   filled): Services records and Home Page `servicesTitle`/`servicesDescription`; `projectOutcome`
   on featured projects; Home Page `primaryCtaNote`; About Page `featuredTestimonial`; remove the
   third About summary paragraph; order each Work Experience role's measurable highlights first.
2. Confirm each save triggers a successful UI rebuild (see the UI runbook's rebuild tests).

Administer Payload only over `https://cms.themuhammadusman.com/admin`, never over plain HTTP. If HTTPS is unavailable, use an SSH tunnel instead:

```bash
ssh -L 3001:127.0.0.1:3001 -i <private-key> ubuntu@<PUBLIC_IP>
```

Then open `http://localhost:3001/admin` on the local machine. Admin cookie auth only accepts the `NEXT_PUBLIC_SERVER_URL` origin, so temporarily add `CSRF_ALLOWED_ORIGINS=http://localhost:3001` to `.env` and restart `portfolio-cms` while using the tunnel; remove it afterwards.

## Admin sessions

The auth cookie is `portfolio-token`. Changing its name or the CMS hostname ends existing admin
sessions, so every administrator must log in again.

## FAQ

**Why is port 3001 not public?** Caddy is the public entry point. Payload should remain behind the reverse proxy.

**Why is the CMS on its own subdomain?** It gives Payload Admin a separate origin, so its `/_next/*` assets never collide with the UI's, and CORS can allow exactly the UI origin.

**Do migrations seed content?** No. They only change the database schema.

**Why does publishing not immediately change the UI?** The UI uses static generation. On OCI, the configured local deployment webhook automatically starts a debounced rebuild; content becomes visible after that build succeeds.

## Troubleshooting

- Service logs: `sudo journalctl -u portfolio-cms -n 100 --no-pager`
- Application logs: `tail -n 100 logs/current.log`
- Database: `npm run db:check`
- Migration state: `npm run migrate:status`; every expected migration should show `Ran: Yes`.
- Port listener: `sudo ss -ltnp | grep ':3001'`
- External timeout while the local endpoint works: verify OCI NSG/security-list ingress and inspect host counters with `sudo iptables -L INPUT -n -v --line-numbers`.
- `npm ci` lock mismatch: fix and commit `package-lock.json` from a development checkout. For an immediate diagnostic deployment, `npm install --package-lock-only && npm ci` regenerates it locally.
- Neon SSL warning: use `sslmode=verify-full` to preserve strict certificate verification explicitly.
- CORS failures: ensure `UI_PUBLIC_URL` or `QUOTE_ALLOWED_ORIGINS` exactly matches the browser-visible UI origin, including `https://` and the `www` prefix if used. Restart `portfolio-cms` after changing them.
- Admin loads but assets or API calls point at the old host: `NEXT_PUBLIC_SERVER_URL` changed without a rebuild.
- External timeout on `https://cms.themuhammadusman.com`: check DNS, TCP `443` ingress, and Caddy certificate logs as described in the UI runbook.
- After changing `.env`, rebuild when public Next.js variables changed and restart `portfolio-cms`.
