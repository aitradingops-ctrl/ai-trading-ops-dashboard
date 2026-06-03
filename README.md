# AI Trading Ops

Internal Next.js App Router dashboard for watchlists, trade signals, TradingView alert ingestion, sentiment notes, risk status, trade journal, PayPal subscription access, manual admin grants, user-specific settings, a project Google Drive, and a shared Trading Calendar.

Production domain: `https://aitradingops.pro`

This app is for tracking, analysis, journaling, access control, subscriptions, and risk visibility only. It does not perform autonomous trade execution.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- NextAuth/Auth.js with Google OAuth
- Google Sheets API via service account
- PayPal subscriptions and webhook status sync
- TradingView embedded widgets and alert webhook ingestion
- Google Drive and Google Calendar links through public client-side config
- Vercel environment variables for secrets and project config

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill every required environment variable.
3. Install dependencies with `npm install`.
4. Seed the Google Sheet with `npm run seed`.
5. Start locally with `npm run dev`.

## Environment Variables

Public values that are safe to expose client-side:

- `NEXT_PUBLIC_APP_DOMAIN=aitradingops.pro`
- `NEXT_PUBLIC_APP_NAME="AI Trading Ops"`
- `NEXT_PUBLIC_PROJECT_DRIVE_URL="https://drive.google.com/drive/folders/1H__9S7AdYV5d4XYw6hSqN-QDXInXEF2Q?usp=sharing"`
- `NEXT_PUBLIC_TRADING_CALENDAR_URL="https://calendar.google.com/calendar/u/2?cid=YjFjNmU3N2VhYjI3Yjk0OTA2NDRjMWQ0MWI1NDI4M2Q2NzhmY2FjZmZjZTQyZGIyNTVjYmUxMzJmZmY3NTBmYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"`
- `NEXT_PUBLIC_TRADING_CALENDAR_ID="b1c6e77eab27b9490644c1d41b54283d678fcacffce42db255cbe132fff750fa@group.calendar.google.com"`
- `NEXT_PUBLIC_GOOGLE_CHAT_URL="https://chat.google.com/room/AAQA_c_Zwls?cls=7"`

Server-only secrets and access-control values:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `APP_ADMIN_EMAIL=aitradingops@gmail.com`
- `ALLOWED_LOGIN_EMAIL=aitradingops@gmail.com`
- `ALLOWED_LOGIN_EMAILS=aitradingops@gmail.com`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_PLAN_ID`

Do not prefix Google service account credentials, PayPal secrets, or OAuth secrets with `NEXT_PUBLIC_`.

## Google Cloud Service Account

1. Create a Google Cloud project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.
5. Put `client_email` into `GOOGLE_CLIENT_EMAIL`.
6. Put `private_key` into `GOOGLE_PRIVATE_KEY`, preserving newlines as `\n`.

## Google OAuth Credentials

1. In Google Cloud, create OAuth client credentials for a web application.
2. Add local redirect URI: `http://localhost:3000/api/auth/callback/google`.
3. Add production redirect URI: `https://aitradingops.pro/api/auth/callback/google`.
4. During Vercel preview testing, also add the active Vercel preview callback URL if needed.
5. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
6. Set local `NEXTAUTH_URL=http://localhost:3000`.
7. Set production `NEXTAUTH_URL=https://aitradingops.pro` only after the custom domain is attached and verified.
8. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

Admin Google account: `aitradingops@gmail.com`.

## Google Sheet Setup

Create a Google Sheet and share it with the service account email using Editor access. Set the sheet ID in `GOOGLE_SHEET_ID`.

Required tabs are created by `npm run seed`:

- `Config`
- `Users`
- `User_Settings`
- `Watchlist`
- `Signals`
- `Trades`
- `Risk_Log`
- `Alerts_Log`
- `Journal`
- `Dashboard`

The app uses `userEmail` columns on user-scoped tabs so each signed-in user only sees their own rows. If the `Users` tab is empty, the app auto-seeds `aitradingops@gmail.com` as the first admin.

## Project Drive

The Project Drive link appears in the sidebar navigation, `/dashboard` quick actions, and `/admin/users` admin resources.

Drive folder:

```text
https://drive.google.com/drive/folders/1H__9S7AdYV5d4XYw6hSqN-QDXInXEF2Q?usp=sharing
```

## Trading Calendar

The `/calendar` page embeds the shared Google Calendar in month view and includes an “Open in Google Calendar” button.

Calendar ID:

```text
b1c6e77eab27b9490644c1d41b54283d678fcacffce42db255cbe132fff750fa@group.calendar.google.com
```

Calendar sharing link:

```text
https://calendar.google.com/calendar/u/2?cid=YjFjNmU3N2VhYjI3Yjk0OTA2NDRjMWQ0MWI1NDI4M2Q2NzhmY2FjZmZjZTQyZGIyNTVjYmUxMzJmZmY3NTBmYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
```

## Google Chat

The `/chat` page, sidebar navigation, and `/dashboard` quick actions open the shared Chat space in a new browser tab.

Chat link:

```text
https://chat.google.com/room/AAQA_c_Zwls?cls=7
```

## PayPal Subscription Setup

1. Create a PayPal REST app.
2. Create a subscription product and plan for AI Trading Ops.
3. Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_PLAN_ID`.
4. For sandbox testing, set optional `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`.
5. In PayPal, create a webhook pointing to `https://aitradingops.pro/api/paypal/webhook` after production domain setup.
6. For preview testing, use the active Vercel preview URL webhook endpoint first.
7. Subscribe to events for subscription activated, cancelled, suspended, payment failed, and payment completed.
8. Set the webhook ID in `PAYPAL_WEBHOOK_ID`.

## Vercel Deployment

1. Keep this project separate from all other Vercel sites.
2. Push this repo to its own GitHub repository.
3. Import it into a dedicated Vercel project.
4. Add all environment variables above.
5. Deploy to a Vercel preview URL.
6. Test login, admin access, Google Sheets reads/writes, PayPal sandbox flow, TradingView webhook ingestion, `/calendar`, and Project Drive links on the preview URL.
7. Add the custom domain `aitradingops.pro` only after the Vercel preview URL has been tested.
8. After attaching the domain, update `NEXTAUTH_URL=https://aitradingops.pro`, Google OAuth redirects, and PayPal webhook URLs.

## Manual User Access

Set `APP_ADMIN_EMAIL=aitradingops@gmail.com`. That user is bootstrapped as admin on first login, by `npm run seed`, or automatically if the `Users` tab is empty.

Admins can visit `/admin/users` to:

- Add users manually by email
- Grant access without PayPal
- Suspend users
- Change role
- Update notes
- Remove access
- Open the Project Drive admin resource

To add another admin directly in the `Users` sheet, add or update the row for their exact Google account email with:

```text
role = admin
accessStatus = active
accessType = admin
```

Suspended users are blocked. Inactive users are blocked. If PayPal is cancelled or payment fails, paid access is removed unless the user also has admin or manual-grant access.

## Login Access Control

Google login is allowed when the email matches one of the configured bootstrap emails or has access in the `Users` sheet. This is enforced in the NextAuth sign-in callback with:

- `TEMP_ALLOWED_LOGIN_EMAIL=aitradingops@gmail.com` in code
- `ALLOWED_LOGIN_EMAIL=aitradingops@gmail.com` as the legacy single-email override
- `ALLOWED_LOGIN_EMAILS=aitradingops@gmail.com,second-admin@example.com` as an optional comma-separated bootstrap list
- the `Users` sheet, where active manual users, active paid users, and admin rows can sign in

A Google account without a matching bootstrap email or eligible `Users` row is redirected back to `/login` and shown:

```text
Access is currently restricted. Please contact AI Trading Ops support.
```

PayPal subscribe buttons remain visible on `/` and `/pricing`, but subscription access can stay inactive until the admin enables broader access.

## TradingView Integration

Embedded TradingView charts are available on `/dashboard` and `/watchlist`. Defaults come from `/settings`:

- `defaultTradingViewSymbol`
- `preferredChartTheme`
- `preferredChartInterval`

TradingView alert ingestion endpoint:

```text
https://aitradingops.pro/api/tradingview/webhook
```

Create a TradingView alert and paste JSON like this into the alert message:

```json
{
  "ticker": "{{ticker}}",
  "exchange": "{{exchange}}",
  "price": "{{close}}",
  "time": "{{time}}",
  "strategy": "Momentum Breakout",
  "direction": "buy",
  "confidenceScore": 75,
  "notes": "TradingView alert triggered",
  "webhookToken": "PASTE_USER_TOKEN_FROM_SETTINGS"
}
```

Each user has a unique `tradingViewWebhookToken` in `/settings`. The webhook rejects missing or invalid tokens and does not rely on `userEmail` alone.

Test webhook ingestion locally:

```bash
curl -X POST http://localhost:3000/api/tradingview/webhook \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL","exchange":"NASDAQ","price":"225.40","time":"2026-05-22T12:00:00Z","strategy":"Momentum Breakout","direction":"buy","confidenceScore":75,"notes":"TradingView alert triggered","webhookToken":"PASTE_USER_TOKEN_FROM_SETTINGS"}'
```

Successful requests create a new `Signals` row and an `Alerts_Log` row.

## Security Notes

- Drive URL and Calendar ID are intentionally public client-side values.
- Secrets stay server-side in Route Handlers and server-only helpers.
- Private pages are gated by the Next.js proxy layer and rechecked in server components.
- API routes revalidate session/access server-side.
- Webhooks use PayPal signature verification or TradingView per-user tokens.
- Google Sheets access uses the service account, not browser credentials.
- PayPal secrets and Google service account credentials are never exposed to the browser.
