# NERV AI

A GitHub Pages frontend + Cloudflare Worker backend + NVIDIA chat-completions API.

## 1. Publish the frontend on GitHub Pages

1. Copy `index.html` into the root of your existing GitHub Pages repository.
2. Edit `index.html` and replace `https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev` in `API_URL` after the Worker is deployed.
3. Commit and push. Wait for GitHub Pages to publish the change.

Your site origin is the origin only, not a path. For a project site like
`https://YOUR-USERNAME.github.io/my-project/`, the origin is
`https://YOUR-USERNAME.github.io`.

## 2. Create the Cloudflare Worker

Install a current Node.js LTS release, then in a terminal:

```bash
cd nerv-worker
npm create cloudflare@latest -- nerv-ai-worker
```

If the interactive setup creates another project folder, copy this package's
`worker.js` and `wrangler.toml` into that generated project's root, replacing
its files. Alternatively, use the Wrangler commands below from a folder that
contains `worker.js` and `wrangler.toml`:

```bash
npx wrangler login
npx wrangler deploy
```

When deployment completes, copy the `https://...workers.dev` URL.

## 3. Add your NVIDIA API key as a secret

Create an API key from https://build.nvidia.com/ and confirm that your selected
model is available to your account. Do not paste the key into `index.html`,
GitHub, `wrangler.toml`, or chat messages.

From the Worker project folder run:

```bash
npx wrangler secret put NVIDIA_API_KEY
```

Paste the key when prompted. Cloudflare stores it as a Worker secret.

## 4. Set the allowed website origin

Open `wrangler.toml` and replace:

```toml
ALLOWED_ORIGIN = "https://YOUR-USERNAME.github.io"
```

with the exact origin of your site. Examples:

- User/organization site: `https://YOUR-USERNAME.github.io`
- Project site: still `https://YOUR-USERNAME.github.io` (do not include `/repository-name/`)
- Custom domain: `https://your-domain.example`

For local testing you can temporarily set this to `http://127.0.0.1:5500`, but do not leave that as your only production origin. If you use more than one origin, separate them with commas and no wildcard, for example:
`ALLOWED_ORIGIN = "https://YOUR-USERNAME.github.io,https://your-domain.example"`

Deploy again after changing config:

```bash
npx wrangler deploy
```

## 5. Connect the frontend

In `index.html`, set:

```js
const API_URL = "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev";
```

to the Worker URL you copied. Commit and push the updated HTML.

## 6. Test

Open the Worker URL in a browser. It should return JSON indicating NERV is online.
Then open your GitHub Pages site and send a message.

If it fails:
- `Origin not allowed`: make `ALLOWED_ORIGIN` exactly match the website origin.
- NVIDIA rejected the key: check the secret and account access.
- Model request failed: check the current model identifier in the NVIDIA API catalog.
- Rate limit/quota: check the NVIDIA account's current limits.

## Security notes

- The NVIDIA API key remains on Cloudflare.
- CORS is configured for your site, but CORS is not authentication and does not stop non-browser scripts from calling a public Worker.
- Before sharing the site widely, add abuse protection/rate limiting (for example Cloudflare rate limiting or Turnstile), review NVIDIA usage costs/limits, and monitor Worker logs.
- Chat history is stored in this browser's localStorage. It is not encrypted, synced, or private from other people using the same browser profile. The Worker does not store chat history.
- This is a text chat. It does not currently support accounts, cloud-synced memory, file uploads, image input, or streaming output.
