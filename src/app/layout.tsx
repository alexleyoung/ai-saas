import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/toaster';

import './main.css';

const title = 'AI-SaaS';
const description = 'Headstarter Project 4';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-background">
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
