import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About · Sequential + Next.js',
};

export default function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>
        This is a second page, so that you can see page views. Next.js changes pages in the browser
        with <code>history.pushState</code>, and the Sequential SDK records those navigations too. You
        do not need router code for page views.
      </p>
      <p>
        Read the <a href="https://www.usesequential.com/docs/install">install guide</a> and the{' '}
        <a href="https://www.usesequential.com/docs/session-replay">session replay docs</a> for more.
      </p>
      <p>
        <Link href="/">Back to the home page</Link>
      </p>
    </>
  );
}
