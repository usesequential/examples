import type { Metadata } from 'next';
import Link from 'next/link';
import { SequentialAnalytics } from './sequential';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sequential + Next.js',
  description: 'Session replay and product analytics in a Next.js App Router app, with Sequential.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <SequentialAnalytics />
      </head>
      <body>
        <header className="site-header">
          <nav aria-label="Main">
            <Link href="/" className="brand">
              Sequential + Next.js
            </Link>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <a href="https://www.usesequential.com/docs">Sequential docs</a>
          <a href="https://www.usesequential.com/privacy-features">Privacy features</a>
        </footer>
      </body>
    </html>
  );
}
