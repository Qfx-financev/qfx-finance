import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QFX Admin Portal',
  description: 'QFX Finance Administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
