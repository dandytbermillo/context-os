import type { Metadata } from 'next';
import '../styles.css';

export const metadata: Metadata = {
  title: 'Document Annotation System',
  description: 'A modular annotation system for documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}