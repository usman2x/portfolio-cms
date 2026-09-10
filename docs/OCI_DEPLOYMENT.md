# OCI VM deployment

This runbook deploys Payload CMS directly on Ubuntu 22.04 using Node.js 22 through NVM, a serverless PostgreSQL database, systemd, and Caddy.

## Production layout

- Repository: `/srv/portfolio/portfolio-cms`
- CMS process: `http://127.0.0.1:3001`
- Temporary public CMS address: `http://<PUBLIC_IP>:8080`
- Process manager: `portfolio-cms.service`
- Database: external PostgreSQL; port 5432 is not opened on OCI

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
NEXT_PUBLIC_SERVER_URL=http://<PUBLIC_IP>:8080
CMS_API_URL=http://127.0.0.1:3001
UI_PUBLIC_URL=http://<PUBLIC_IP>
QUOTE_ALLOWED_ORIGINS=http://<PUBLIC_IP>
LOG_DIR=/srv/portfolio/portfolio-cms/logs
```

Generate `PAYLOAD_SECRET` with `openssl rand -hex 32`. Never commit `.env`.

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

## Updates

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

## Optional canonical seed

`npm run seed:core` idempotently loads canonical case studies, project media, tags, and testimonials. It does not load global page content or work experience. `seed:dev` contains development fixtures and should not be used unintentionally in production.

Seeding is intentionally deferred in the initial OCI deployment. The schema migration and service deployment are complete without it. When content initialization is approved, run the seed against `http://127.0.0.1:3001`, then rebuild the static UI.

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

1. Confirm OCI ingress permits TCP `80` and temporary TCP `8080` for this VM.
2. Confirm `curl -I http://127.0.0.1:3001/admin` succeeds on the VM.
3. Confirm `curl -I http://<PUBLIC_IP>:8080/admin` succeeds from a different machine.
4. Create the initial administrator through Payload Admin or the approved core seed.
5. Populate required globals and editorial content in Payload Admin.
6. Rebuild the UI after content changes.
7. Add a domain and move both public services to Caddy-managed HTTPS.
8. Remove temporary public port `8080` after the CMS has an HTTPS hostname or an approved same-origin routing design.

Do not enter administrator credentials over public HTTP. Until HTTPS is configured, administer Payload through an SSH tunnel:

```bash
ssh -L 3001:127.0.0.1:3001 -i <private-key> ubuntu@<PUBLIC_IP>
```

Then open `http://127.0.0.1:3001/admin` on the local machine.

## FAQ

**Why is port 3001 not public?** Caddy is the public entry point. Payload should remain behind the reverse proxy.

**Why is CMS on port 8080?** It provides a separate origin while no domain is available. With a domain, replace it with a CMS subdomain on HTTPS.

**Do migrations seed content?** No. They only change the database schema.

**Why does publishing not immediately change the UI?** The UI uses static generation and must be rebuilt after CMS content changes.

## Troubleshooting

- Service logs: `sudo journalctl -u portfolio-cms -n 100 --no-pager`
- Application logs: `tail -n 100 logs/current.log`
- Database: `npm run db:check`
- Migration state: `npm run migrate:status`; every expected migration should show `Ran: Yes`.
- Port listener: `sudo ss -ltnp | grep ':3001'`
- External timeout while the local endpoint works: verify OCI NSG/security-list ingress and inspect host counters with `sudo iptables -L INPUT -n -v --line-numbers`.
- `npm ci` lock mismatch: fix and commit `package-lock.json` from a development checkout. For an immediate diagnostic deployment, `npm install --package-lock-only && npm ci` regenerates it locally.
- Neon SSL warning: use `sslmode=verify-full` to preserve strict certificate verification explicitly.
- CORS failures: ensure `UI_PUBLIC_URL` or `QUOTE_ALLOWED_ORIGINS` exactly matches the browser-visible UI origin.
- After changing `.env`, rebuild when public Next.js variables changed and restart `portfolio-cms`.
