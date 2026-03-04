import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from './client';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your personalized fortune readings.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 pb-8 pt-14">
        <Suspense fallback={<div className="text-sm text-muted">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
