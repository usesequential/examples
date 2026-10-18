# Sequential + Next.js

A small Next.js (App Router, TypeScript) app that loads [Sequential](https://www.usesequential.com) from the root layout. Sequential gives you session replay and product analytics, and it ranks what went wrong for your users.

The app has two pages, so you can see page views, and a button that sends a custom event.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusesequential%2Fexamples%2Ftree%2Fmain%2Fnextjs&project-name=sequential-nextjs&repository-name=sequential-nextjs&env=NEXT_PUBLIC_SEQUENTIAL_KEY&envDescription=Your%20project%27s%20sequential%20ingest%20key%20%28it%20starts%20with%20sq_sequential_%29&envLink=https%3A%2F%2Fwww.usesequential.com%2Fdocs%2Finstall)

Vercel asks for `NEXT_PUBLIC_SEQUENTIAL_KEY` when you deploy.

**Where the key comes from:** sign in to Sequential and open **Settings → Projects → your project → Setup**. Copy the `data-key` value from the install snippet. It is your project's `sequential` ingest key, and it starts with `sq_sequential_`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SEQUENTIAL_KEY
npm run dev
```

Open http://localhost:3000, click the button, and go to the About page and back. Then open your project in Sequential to see the events and the session.

If your project limits the websites that can send events, add `http://localhost:3000` (and your Vercel domain) under **Settings → Projects → your project → Sources & keys → Allowed websites**.

## Environment variables

| Name | Required | Default | What it does |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SEQUENTIAL_KEY` | Yes | none | Your project's `sequential` ingest key. It starts with `sq_sequential_`. Without it, the SDK is not loaded and no events are sent. |
| `NEXT_PUBLIC_SEQUENTIAL_API` | No | `https://api.usesequential.com` | The ingest host. Keep the default for hosted Sequential. |
| `NEXT_PUBLIC_SEQUENTIAL_RELEASE` | No | `VERCEL_GIT_COMMIT_SHA`, if it is set | Your app version. It goes on every event as the release. Vercel sets `VERCEL_GIT_COMMIT_SHA` during the build, so each deploy is its own release. |

These values are read at build time. After you change one, build or deploy again.

## How it works

All of the Sequential code is in [`app/sequential.tsx`](app/sequential.tsx). The root layout renders `<SequentialAnalytics />` once, and every page gets it.

The component is the [install snippet](https://www.usesequential.com/docs/install) as two plain `<script>` tags. The layout renders it inside `<head>`, so both tags are in the server HTML:

1. **The stub** (`id="sequential-stub"`, inline). It creates `window.sequential`. Calls made before the SDK loads are queued, and the SDK replays them in order.
2. **The SDK** (`id="sequential-sdk"`, `async`), from `https://cdn.usesequential.com/sdk/sequential/v1/sequential.js`, with `data-key`, `data-api` and, when there is one, `data-release`.

The SDK has no `init()` call. It finds its own `<script>` tag (`document.currentScript`, or else the last `script[data-key]` on the page) and reads its settings from the `data-*` attributes.

React moves `async` scripts to the top of `<head>`, so in the HTML the SDK tag comes before the stub. That is safe. The stub runs while the browser parses `<head>`, before the page body and before React hydrates, so your code always finds `window.sequential`. If the stub runs first, the SDK replays its queue. If the SDK runs first, the stub sees `window.sequential` and does nothing.

The tag does not use `next/script`. In the App Router, `next/script` with `afterInteractive` adds the tag only in the browser, after hydration. The SDK would start later, and the tag would not be in the server HTML.

Page views need no router code. Next.js changes pages with `history.pushState`, and the SDK records those navigations.

## Use the SDK in your own code

`types/sequential.d.ts` types `window.sequential`. Call it from client components and event handlers:

```tsx
'use client';

export function SignUpButton() {
  return (
    <button onClick={() => window.sequential?.capture('signup_started', { plan: 'team' })}>
      Sign up
    </button>
  );
}
```

| Method | Use it to |
| --- | --- |
| `capture(event, properties?)` | Send a custom event. Names that start with `$` are reserved for Sequential. |
| `identify(userId, traits?)` | Link the visitor to your own user id, after sign-in. |
| `account(accountId, traits?)` | Link the visitor to a company, team or workspace. |
| `register(properties)` / `unregister(key)` | Add or remove properties on every later event, until the page is reloaded. |
| `reset()` | Forget the user and start a new anonymous visitor. Call it on sign-out. |
| `optOut()` / `optIn()` | Stop or start sending events for this visitor. The browser keeps the choice, and an opted-out visitor is not recorded on later page loads. |
| `captureException(error, properties?)` | Send an error as an event. |
| `flush()` | Send the queued events now. Returns a promise. |

Call it only in the browser: in event handlers and in `useEffect`. `window` does not exist while the server renders a page. The optional call (`window.sequential?.`) keeps your code safe when the stub is missing, for example in tests.

## Learn more

- [Install guide](https://www.usesequential.com/docs/install)
- [Session replay](https://www.usesequential.com/docs/session-replay)
- [Privacy features](https://www.usesequential.com/privacy-features)
- [All docs](https://www.usesequential.com/docs)

Questions: hello@usesequential.com

## License

MIT. See [LICENSE](../LICENSE).
