import Link from 'next/link';
import { CaptureButton } from './capture-button';
import { getSequentialConfig } from './sequential-config';

export default function HomePage() {
  const { key } = getSequentialConfig();

  return (
    <>
      <h1>Sequential + Next.js</h1>
      <p>
        This app loads the Sequential browser SDK from its root layout. Sequential records
        page views, clicks and sessions.
      </p>

      {key ? null : (
        <p className="notice" role="status">
          <strong>No key set.</strong> Add <code>NEXT_PUBLIC_SEQUENTIAL_KEY</code> to{' '}
          <code>.env.local</code> (or to your Vercel project) and build again. Until then, no events
          are sent.
        </p>
      )}

      <h2>Try it</h2>
      <ol>
        <li>
          Click the button. It calls{' '}
          <code>window.sequential.capture(&apos;demo_clicked&apos;, {'{'} source: &apos;example&apos; {'}'})</code>.
        </li>
        <li>
          Go to the <Link href="/about">About page</Link> and back. Each navigation is a page view.
        </li>
        <li>Open your project in Sequential to see the events and the session.</li>
      </ol>

      <CaptureButton />
    </>
  );
}
