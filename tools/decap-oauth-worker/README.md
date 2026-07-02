# Decap CMS GitHub OAuth Worker

Cloudflare Worker for `/admin/` Decap CMS authentication on `https://joestarzhx.github.io`.

## Required secrets

Do not commit these values. Configure them with Wrangler:

```bash
npm install
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

`wrangler.toml` already sets:

```text
ALLOWED_GITHUB_LOGIN=joestarzhx
ALLOWED_ORIGIN=https://joestarzhx.github.io
```

## GitHub OAuth App

Create a GitHub OAuth App with:

```text
Homepage URL: https://joestarzhx.github.io
Authorization callback URL: https://<your-worker-domain>/callback
```

Then replace `backend.base_url` in `public/admin/config.yml` with the deployed Worker origin, for example:

```yaml
base_url: https://joestarzhx-decap-oauth.<account>.workers.dev
```

## Commands

```bash
npm run dev
npm run deploy
```

The Worker only allows the GitHub login `joestarzhx`, validates OAuth state with a Secure HttpOnly SameSite cookie, and only posts the Decap authorization message back to `https://joestarzhx.github.io`.
