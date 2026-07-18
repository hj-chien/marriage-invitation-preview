# Guestbook deployment

1. Create a Google Sheet and copy its ID from the URL.
2. Create a standalone Google Apps Script project, then copy in `Code.gs`.
3. In **Project Settings → Script properties**, set `SHEET_ID`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_HOSTNAME`.
4. Create a Cloudflare Turnstile widget for the production hostname. Its action must be `guestbook`.
5. Deploy the script as a web app that runs as you and is accessible to visitors, then replace `GUESTBOOK_API.url` and `turnstileSiteKey` in `script.js`.

The form intentionally remains disabled until a Turnstile site key is configured. This avoids restoring the old unauthenticated public-write behaviour.
