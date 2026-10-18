// Reads the Sequential settings from the environment. NEXT_PUBLIC_ values are
// fixed at build time, so change them and build again.

export const DEFAULT_SEQUENTIAL_API = 'https://api.usesequential.com';
export const SEQUENTIAL_SDK_SRC = 'https://cdn.usesequential.com/sdk/sequential/v1/sequential.js';

export interface SequentialConfig {
  /** The project's "sequential" ingest key (sq_sequential_...). Null when it is not set. */
  key: string | null;
  /** The ingest host. */
  api: string;
  /** The app version put on every event. Null when there is none. */
  release: string | null;
}

function clean(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getSequentialConfig(): SequentialConfig {
  return {
    key: clean(process.env.NEXT_PUBLIC_SEQUENTIAL_KEY),
    api: clean(process.env.NEXT_PUBLIC_SEQUENTIAL_API) ?? DEFAULT_SEQUENTIAL_API,
    // VERCEL_GIT_COMMIT_SHA is set by Vercel during the build. It is read on the
    // server, so it does not need the NEXT_PUBLIC_ prefix.
    release:
      clean(process.env.NEXT_PUBLIC_SEQUENTIAL_RELEASE) ?? clean(process.env.VERCEL_GIT_COMMIT_SHA),
  };
}
