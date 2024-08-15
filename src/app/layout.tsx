import { Metadata } from 'next';
import Footer from '@/components/ui/tempFooter';
import Navbar from '@/components/ui/tempNavbar';
import { Toaster } from '@/components/ui/tempToasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
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
      <body className="bg-background">{children}</body>
    </html>
  );
}
