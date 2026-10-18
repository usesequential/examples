import { getSequentialConfig, SEQUENTIAL_SDK_SRC } from './sequential-config';

// The stub from the Sequential install snippet, unchanged. It creates
// window.sequential, so calls made before the SDK loads are queued and then
// replayed in order by the SDK.
const SEQUENTIAL_STUB =
  "(function(w){if(w.sequential)return;var q=[],s=w.sequential={_q:q}," +
  "m=['capture','identify','account','register','unregister','reset','optOut','optIn','captureException'];" +
  "for(var i=0;i<m.length;i++)(function(n){s[n]=function(){q.push([n,arguments])}})(m[i]);" +
  "s.flush=function(){q.push(['flush',arguments]);return typeof Promise=='function'?Promise.resolve():{then:function(f){if(f)f()}}}})(window);";

/**
 * Loads Sequential (analytics and session replay) on every page.
 * Render it once, inside <head> in the root layout.
 *
 * It is the install snippet as two plain <script> tags, so they are in the
 * server HTML exactly as in the snippet:
 * 1. The inline stub. It runs while the HTML is parsed, before React hydrates,
 *    so window.sequential exists in every useEffect and event handler.
 * 2. The SDK, async from the CDN. The SDK has no init() call: it finds its own
 *    <script> tag and reads data-key, data-api and data-release from it.
 *
 * Plain tags are used instead of next/script: in the App Router, next/script
 * adds an afterInteractive <script> only in the browser, after hydration, so
 * the SDK would start later and the tag would not be in the server HTML.
 */
export function SequentialAnalytics() {
  const { key, api, release } = getSequentialConfig();

  if (!key) {
    console.warn(
      '[sequential] NEXT_PUBLIC_SEQUENTIAL_KEY is not set, so the SDK is not loaded. ' +
        'Copy .env.example to .env.local and add your sq_sequential_ key.',
    );
  } else if (!key.startsWith('sq_sequential_')) {
    console.warn(
      '[sequential] NEXT_PUBLIC_SEQUENTIAL_KEY does not start with sq_sequential_. ' +
        'Use the data-key value from Settings > Projects > your project > Setup.',
    );
  }

  return (
    <>
      {/* Sequential · analytics and session replay */}
      <script id="sequential-stub" dangerouslySetInnerHTML={{ __html: SEQUENTIAL_STUB }} />
      {key ? (
        <script
          id="sequential-sdk"
          async
          src={SEQUENTIAL_SDK_SRC}
          data-key={key}
          data-api={api}
          {...(release ? { 'data-release': release } : {})}
        />
      ) : null}
    </>
  );
}
